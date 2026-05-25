const IDB = {
    name: 'EduEquityDB',
    version: 1,
    db: null,

    stores: {
        posts: { keyPath: 'id', indexes: ['category', 'createdAt', 'author'] },
        agents: { keyPath: 'id', indexes: ['type', 'createdAt', 'author'] },
        resources: { keyPath: 'id', indexes: ['subject', 'type'] },
        chatHistory: { keyPath: 'id', indexes: ['agentId', 'timestamp'] },
        favorites: { keyPath: 'key', indexes: ['type', 'timestamp'] },
        notifications: { keyPath: 'id', indexes: ['read', 'createdAt'] },
        userData: { keyPath: 'key' },
        offlineQueue: { keyPath: 'id', indexes: ['type', 'timestamp'] }
    },

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.name, this.version);

            request.onerror = () => {
                console.error('IndexedDB error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB initialized');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                Object.entries(this.stores).forEach(([name, config]) => {
                    if (!db.objectStoreNames.contains(name)) {
                        const store = db.createObjectStore(name, { keyPath: config.keyPath });
                        
                        if (config.indexes) {
                            config.indexes.forEach(index => {
                                store.createIndex(index, index, { unique: false });
                            });
                        }
                    }
                });
            };
        });
    },

    async getStore(storeName, mode = 'readonly') {
        if (!this.db) await this.init();
        const transaction = this.db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    },

    async get(storeName, key) {
        const store = await this.getStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getAll(storeName, query = null, count = null) {
        const store = await this.getStore(storeName);
        return new Promise((resolve, reject) => {
            const request = query ? store.getAll(query, count) : store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async put(storeName, data) {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async putAll(storeName, items) {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const results = [];
            let completed = 0;

            items.forEach(item => {
                const request = store.put(item);
                request.onsuccess = () => {
                    results.push(request.result);
                    completed++;
                    if (completed === items.length) resolve(results);
                };
                request.onerror = () => reject(request.error);
            });

            if (items.length === 0) resolve([]);
        });
    },

    async delete(storeName, key) {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async clear(storeName) {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    async count(storeName, query = null) {
        const store = await this.getStore(storeName);
        return new Promise((resolve, reject) => {
            const request = query ? store.count(query) : store.count();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getByIndex(storeName, indexName, value) {
        const store = await this.getStore(storeName);
        const index = store.index(indexName);
        return new Promise((resolve, reject) => {
            const request = index.getAll(value);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async query(storeName, options = {}) {
        const store = await this.getStore(storeName);
        const { index, range, direction = 'next', limit } = options;
        
        return new Promise((resolve, reject) => {
            const source = index ? store.index(index) : store;
            const keyRange = range ? IDBKeyRange[range.method](...range.args) : null;
            const request = source.openCursor(keyRange, direction);
            
            const results = [];
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    if (limit && results.length >= limit) {
                        resolve(results);
                    } else {
                        cursor.continue();
                    }
                } else {
                    resolve(results);
                }
            };
            
            request.onerror = () => reject(request.error);
        });
    },

    async transaction(storeNames, mode, callback) {
        if (!this.db) await this.init();
        const tx = this.db.transaction(storeNames, mode);
        const stores = {};
        
        if (Array.isArray(storeNames)) {
            storeNames.forEach(name => {
                stores[name] = tx.objectStore(name);
            });
        } else {
            stores[storeNames] = tx.objectStore(storeNames);
        }
        
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
            
            try {
                callback(stores);
            } catch (error) {
                tx.abort();
                reject(error);
            }
        });
    }
};

const OfflineQueue = {
    async add(type, data) {
        const item = {
            id: Utils.generateId(),
            type,
            data,
            timestamp: Date.now(),
            attempts: 0,
            status: 'pending'
        };
        await IDB.put('offlineQueue', item);
        return item;
    },

    async processQueue() {
        const items = await IDB.getAll('offlineQueue');
        const pending = items.filter(i => i.status === 'pending');
        
        for (const item of pending) {
            try {
                await this.processItem(item);
                await IDB.delete('offlineQueue', item.id);
            } catch (error) {
                item.attempts++;
                item.lastError = error.message;
                item.status = item.attempts >= 3 ? 'failed' : 'pending';
                await IDB.put('offlineQueue', item);
            }
        }
    },

    async processItem(item) {
        switch (item.type) {
            case 'post':
                console.log('Syncing post:', item.data);
                break;
            case 'favorite':
                console.log('Syncing favorite:', item.data);
                break;
            default:
                console.log('Unknown queue item type:', item.type);
        }
    },

    async getPending() {
        return IDB.getByIndex('offlineQueue', 'status', 'pending');
    },

    async clear() {
        return IDB.clear('offlineQueue');
    }
};

const DataSync = {
    lastSync: null,
    syncInterval: 5 * 60 * 1000,

    async init() {
        await IDB.init();
        this.lastSync = await this.getLastSync();
        this.startAutoSync();
        
        window.addEventListener('online', () => this.sync());
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.checkSync();
            }
        });
    },

    async getLastSync() {
        const data = await IDB.get('userData', 'lastSync');
        return data?.value || null;
    },

    async setLastSync(timestamp) {
        await IDB.put('userData', { key: 'lastSync', value: timestamp });
        this.lastSync = timestamp;
    },

    async checkSync() {
        if (!this.lastSync || Date.now() - this.lastSync > this.syncInterval) {
            await this.sync();
        }
    },

    startAutoSync() {
        setInterval(() => {
            if (navigator.onLine) {
                this.checkSync();
            }
        }, this.syncInterval);
    },

    async sync() {
        if (!navigator.onLine) {
            console.log('Offline, skipping sync');
            return;
        }

        console.log('Starting sync...');
        
        await OfflineQueue.processQueue();
        
        await this.setLastSync(Date.now());
        
        console.log('Sync completed');
        EventBus.emit('sync:complete');
    },

    async exportData() {
        const data = {
            posts: await IDB.getAll('posts'),
            agents: await IDB.getAll('agents'),
            resources: await IDB.getAll('resources'),
            favorites: await IDB.getAll('favorites'),
            chatHistory: await IDB.getAll('chatHistory'),
            notifications: await IDB.getAll('notifications'),
            exportedAt: Date.now()
        };
        
        return JSON.stringify(data, null, 2);
    },

    async importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            if (data.posts) await IDB.putAll('posts', data.posts);
            if (data.agents) await IDB.putAll('agents', data.agents);
            if (data.resources) await IDB.putAll('resources', data.resources);
            if (data.favorites) await IDB.putAll('favorites', data.favorites);
            if (data.chatHistory) await IDB.putAll('chatHistory', data.chatHistory);
            if (data.notifications) await IDB.putAll('notifications', data.notifications);
            
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }
};

window.IDB = IDB;
window.OfflineQueue = OfflineQueue;
window.DataSync = DataSync;
