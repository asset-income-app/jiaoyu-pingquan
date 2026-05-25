const EventBus = {
    events: new Map(),
    
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
        return () => this.off(event, callback);
    },
    
    off(event, callback) {
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
        }
    },
    
    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`EventBus error in ${event}:`, e);
                }
            });
        }
    },
    
    once(event, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
};

const Utils = {
    debounce(fn, delay = 300) {
        let timer = null;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    throttle(fn, delay = 100) {
        let last = 0;
        return function(...args) {
            const now = Date.now();
            if (now - last >= delay) {
                last = now;
                fn.apply(this, args);
            }
        };
    },

    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
        
        const date = new Date(timestamp);
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    },

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    truncate(text, length = 100) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        }
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return Promise.resolve();
    },

    isMobile() {
        return window.innerWidth <= 768;
    },

    scrollToTop(smooth = true) {
        window.scrollTo({
            top: 0,
            behavior: smooth ? 'smooth' : 'auto'
        });
    },

    animateNumber(element, target, duration = 1000) {
        const start = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    lazyLoad(selector = '.lazy-load') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (el.dataset.src) {
                        el.src = el.dataset.src;
                        el.removeAttribute('data-src');
                    }
                    el.classList.add('loaded');
                    observer.unobserve(el);
                }
            });
        }, { rootMargin: '50px' });

        document.querySelectorAll(selector).forEach(el => observer.observe(el));
        return observer;
    },

    createRipple(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    },

    highlightText(text, query) {
        if (!query) return this.escapeHtml(text);
        const escaped = this.escapeHtml(text);
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return escaped.replace(regex, '<mark class="highlight">$1</mark>');
    },

    parseUrl(url) {
        try {
            const parsed = new URL(url);
            return {
                valid: true,
                protocol: parsed.protocol,
                host: parsed.host,
                pathname: parsed.pathname,
                search: parsed.search,
                hash: parsed.hash
            };
        } catch {
            return { valid: false };
        }
    },

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    shuffle(arr) {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    requestIdleCallback(callback, options = {}) {
        if ('requestIdleCallback' in window) {
            return window.requestIdleCallback(callback, options);
        }
        return setTimeout(callback, 1);
    },

    cancelIdleCallback(id) {
        if ('cancelIdleCallback' in window) {
            window.cancelIdleCallback(id);
        } else {
            clearTimeout(id);
        }
    },

    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    },

    async measurePerformanceAsync(name, fn) {
        const start = performance.now();
        const result = await fn();
        const end = performance.now();
        console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    },

    createIntersectionObserver(callback, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        return new IntersectionObserver(callback, { ...defaultOptions, ...options });
    },

    createResizeObserver(callback) {
        if ('ResizeObserver' in window) {
            return new ResizeObserver(callback);
        }
        return null;
    },

    prefetch(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    },

    preload(url, as = 'script') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = as;
        document.head.appendChild(link);
    }
};

const Store = {
    state: {
        user: null,
        posts: [],
        agents: [],
        resources: [],
        comments: {},
        stories: [],
        favorites: [],
        notifications: [],
        theme: 'light',
        searchHistory: [],
        chatHistory: {},
        settings: {
            notifications: true,
            sounds: true,
            autoSave: true
        }
    },

    listeners: new Set(),
    middleware: [],

    KEYS: {
        USER: 'eduequity_user',
        POSTS: 'eduequity_posts',
        AGENTS: 'eduequity_agents',
        RESOURCES: 'eduequity_resources',
        COMMENTS: 'eduequity_comments',
        STORIES: 'eduequity_stories',
        FAVORITES: 'eduequity_favorites',
        NOTIFICATIONS: 'eduequity_notifications',
        THEME: 'eduequity_theme',
        SEARCH_HISTORY: 'eduequity_search_history',
        CHAT_HISTORY: 'eduequity_chat_history',
        SETTINGS: 'eduequity_settings'
    },

    EVENTS: {
        USER_LOGIN: 'user:login',
        USER_LOGOUT: 'user:logout',
        POST_CREATE: 'post:create',
        POST_UPDATE: 'post:update',
        AGENT_CREATE: 'agent:create',
        NOTIFICATION_NEW: 'notification:new',
        THEME_CHANGE: 'theme:change',
        STATE_CHANGE: 'state:change'
    },

    init() {
        this.loadFromStorage();
        this.initSampleData();
        this.setupAutoSave();
        return this;
    },

    use(middleware) {
        this.middleware.push(middleware);
    },

    runMiddleware(action, data) {
        this.middleware.forEach(fn => {
            try {
                fn(action, data, this.state);
            } catch (e) {
                console.error('Middleware error:', e);
            }
        });
    },

    loadFromStorage() {
        Object.keys(this.KEYS).forEach(key => {
            const value = this.get(this.KEYS[key]);
            if (value !== null) {
                const stateKey = key.toLowerCase();
                if (this.state.hasOwnProperty(stateKey)) {
                    this.state[stateKey] = value;
                }
            }
        });
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage get error:', e);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            if (e.name === 'QuotaExceededError') {
                this.handleStorageQuotaExceeded();
            }
            return false;
        }
    },

    handleStorageQuotaExceeded() {
        const oldPosts = this.state.posts;
        if (oldPosts.length > 50) {
            this.state.posts = oldPosts.slice(0, 50);
            this.set(this.KEYS.POSTS, this.state.posts);
        }
        EventBus.emit('storage:quota_exceeded');
    },

    setupAutoSave() {
        window.addEventListener('beforeunload', () => {
            this.persist();
        });
    },

    persist() {
        Object.keys(this.KEYS).forEach(key => {
            const stateKey = key.toLowerCase();
            if (this.state[stateKey] !== undefined) {
                this.set(this.KEYS[key], this.state[stateKey]);
            }
        });
    },

    getState() {
        return { ...this.state };
    },

    setState(updates, silent = false) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...updates };
        this.runMiddleware('setState', { prevState, updates });
        if (!silent) {
            this.notify();
            EventBus.emit(this.EVENTS.STATE_CHANGE, { prevState, newState: this.state });
        }
    },

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    },

    notify() {
        this.listeners.forEach(listener => {
            try {
                listener(this.state);
            } catch (e) {
                console.error('Store listener error:', e);
            }
        });
    },

    saveUser(user) {
        this.state.user = user;
        this.set(this.KEYS.USER, user);
        this.notify();
        EventBus.emit(this.EVENTS.USER_LOGIN, user);
    },

    clearUser() {
        this.state.user = null;
        localStorage.removeItem(this.KEYS.USER);
        this.notify();
        EventBus.emit(this.EVENTS.USER_LOGOUT);
    },

    savePosts(posts) {
        this.state.posts = posts;
        this.set(this.KEYS.POSTS, posts);
        this.notify();
    },

    addPost(post) {
        this.state.posts.unshift(post);
        this.set(this.KEYS.POSTS, this.state.posts);
        this.notify();
        EventBus.emit(this.EVENTS.POST_CREATE, post);
    },

    updatePost(postId, updates) {
        const index = this.state.posts.findIndex(p => p.id === postId);
        if (index !== -1) {
            this.state.posts[index] = { ...this.state.posts[index], ...updates };
            this.set(this.KEYS.POSTS, this.state.posts);
            this.notify();
            EventBus.emit(this.EVENTS.POST_UPDATE, { postId, updates });
        }
    },

    deletePost(postId) {
        this.state.posts = this.state.posts.filter(p => p.id !== postId);
        this.set(this.KEYS.POSTS, this.state.posts);
        this.notify();
    },

    saveAgents(agents) {
        this.state.agents = agents;
        this.set(this.KEYS.AGENTS, agents);
        this.notify();
    },

    addAgent(agent) {
        this.state.agents.unshift(agent);
        this.set(this.KEYS.AGENTS, this.state.agents);
        this.notify();
        EventBus.emit(this.EVENTS.AGENT_CREATE, agent);
    },

    updateAgent(agentId, updates) {
        const index = this.state.agents.findIndex(a => a.id === agentId);
        if (index !== -1) {
            this.state.agents[index] = { ...this.state.agents[index], ...updates };
            this.set(this.KEYS.AGENTS, this.state.agents);
            this.notify();
        }
    },

    getComments(postId) {
        return this.state.comments[postId] || [];
    },

    addComment(postId, comment) {
        if (!this.state.comments[postId]) {
            this.state.comments[postId] = [];
        }
        this.state.comments[postId].push(comment);
        this.set(this.KEYS.COMMENTS, this.state.comments);
        this.notify();
    },

    toggleFavorite(id, type = 'post') {
        const key = `${type}_${id}`;
        const index = this.state.favorites.indexOf(key);
        if (index === -1) {
            this.state.favorites.push(key);
        } else {
            this.state.favorites.splice(index, 1);
        }
        this.set(this.KEYS.FAVORITES, this.state.favorites);
        this.notify();
        return index === -1;
    },

    isFavorite(id, type = 'post') {
        return this.state.favorites.includes(`${type}_${id}`);
    },

    getFavorites(type = null) {
        return this.state.favorites
            .filter(key => type ? key.startsWith(`${type}_`) : true)
            .map(key => {
                const [t, id] = key.split('_');
                const collection = t === 'post' ? this.state.posts : 
                                  t === 'agent' ? this.state.agents : 
                                  this.state.resources;
                return collection.find(item => item.id === id);
            })
            .filter(Boolean);
    },

    addNotification(notification) {
        const newNotification = {
            ...notification,
            id: Utils.generateId(),
            read: false,
            createdAt: Date.now()
        };
        this.state.notifications.unshift(newNotification);
        this.set(this.KEYS.NOTIFICATIONS, this.state.notifications);
        this.notify();
        EventBus.emit(this.EVENTS.NOTIFICATION_NEW, newNotification);
        return newNotification;
    },

    markNotificationRead(notificationId) {
        const notification = this.state.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.set(this.KEYS.NOTIFICATIONS, this.state.notifications);
            this.notify();
        }
    },

    markAllNotificationsRead() {
        this.state.notifications.forEach(n => n.read = true);
        this.set(this.KEYS.NOTIFICATIONS, this.state.notifications);
        this.notify();
    },

    getUnreadCount() {
        return this.state.notifications.filter(n => !n.read).length;
    },

    addSearchHistory(query) {
        if (!query.trim()) return;
        this.state.searchHistory = [
            query,
            ...this.state.searchHistory.filter(q => q !== query)
        ].slice(0, 20);
        this.set(this.KEYS.SEARCH_HISTORY, this.state.searchHistory);
    },

    clearSearchHistory() {
        this.state.searchHistory = [];
        this.set(this.KEYS.SEARCH_HISTORY, this.state.searchHistory);
    },

    saveChatHistory(agentId, messages) {
        this.state.chatHistory[agentId] = messages;
        this.set(this.KEYS.CHAT_HISTORY, this.state.chatHistory);
    },

    getChatHistory(agentId) {
        return this.state.chatHistory[agentId] || [];
    },

    updateSettings(updates) {
        this.state.settings = { ...this.state.settings, ...updates };
        this.set(this.KEYS.SETTINGS, this.state.settings);
        this.notify();
    },

    initSampleData() {
        if (this.state.posts.length === 0) {
            this.state.posts = this.createSamplePosts();
            this.set(this.KEYS.POSTS, this.state.posts);
        }

        if (this.state.agents.length === 0) {
            this.state.agents = this.createSampleAgents();
            this.set(this.KEYS.AGENTS, this.state.agents);
        }

        if (this.state.resources.length === 0) {
            this.state.resources = this.createSampleResources();
            this.set(this.KEYS.RESOURCES, this.state.resources);
        }

        if (this.state.stories.length === 0) {
            this.state.stories = this.createSampleStories();
            this.set(this.KEYS.STORIES, this.state.stories);
        }

        this.notify();
    },

    createSamplePosts() {
        return [
            {
                id: Utils.generateId(),
                author: { name: '张老师', avatar: '👨‍🏫', role: '教师', bio: '20年教龄数学老师' },
                title: '2024高考数学备考策略分享',
                content: '作为一名从教20年的数学老师，我想分享一些高考数学备考的核心策略。\n\n首先，基础知识的扎实掌握是关键，不要盲目追求难题。很多同学忽视了课本上的基础概念，这其实是很大的误区。\n\n其次，错题本的整理和定期复习非常重要。建议每周至少复习一次错题，分析错误原因，避免重复犯错。\n\n最后，合理分配时间，不要在某一道题上花费太多时间。考试时要学会取舍，先易后难。',
                category: 'gaokao',
                tags: ['数学', '高考', '备考策略', '学习方法'],
                likes: 128,
                comments: 24,
                views: 1520,
                favorites: 56,
                createdAt: Date.now() - 3600000
            },
            {
                id: Utils.generateId(),
                author: { name: '学霸小李', avatar: '👩‍🎓', role: '学生', bio: '北大在读' },
                title: '从农村到北大，我的高考逆袭之路',
                content: '我来自河南农村，学校条件有限，但我通过网络资源自学，最终以687分考入北大。\n\n想和大家分享我的学习方法：\n\n1. 制定详细的学习计划，每天坚持执行\n2. 利用网络资源弥补学校教育的不足\n3. 加入学习社群，和志同道合的人一起进步\n4. 保持积极心态，相信自己一定能行\n\n希望我的经历能给正在奋斗的你们一些鼓励！',
                category: 'experience',
                tags: ['逆袭', '学习方法', '励志', '农村教育'],
                likes: 356,
                comments: 89,
                views: 4520,
                favorites: 123,
                createdAt: Date.now() - 7200000
            },
            {
                id: Utils.generateId(),
                author: { name: '教育志愿者', avatar: '🤝', role: '志愿者', bio: '致力于教育公平' },
                title: '【资源分享】近5年全国各地高考真题合集',
                content: '整理了近5年全国各地的高考真题，包括全国卷和各省市自主命题试卷，附带详细解析。\n\n包含科目：语文、数学、英语、物理、化学、生物、政治、历史、地理\n\n适用人群：高三备考学生、教师参考\n\n使用方法：点击获取资源，即可下载使用\n\n希望对大家备考有帮助！有任何问题欢迎留言讨论。',
                category: 'resources',
                tags: ['真题', '资源', '免费', '高考'],
                likes: 520,
                comments: 156,
                views: 8920,
                favorites: 234,
                createdAt: Date.now() - 10800000
            },
            {
                id: Utils.generateId(),
                author: { name: '心理老师小王', avatar: '🧠', role: '教师', bio: '心理咨询师' },
                title: '考前焦虑怎么办？这些方法帮你缓解压力',
                content: '高考临近，很多同学出现了焦虑症状：失眠、食欲不振、注意力不集中...\n\n这些都是正常的应激反应，以下方法可以帮助你缓解：\n\n1. 深呼吸练习：每天花10分钟做深呼吸\n2. 适度运动：散步、慢跑都能释放压力\n3. 合理作息：保证充足睡眠\n4. 积极暗示：告诉自己"我能行"\n5. 寻求帮助：必要时找老师或心理咨询师聊聊\n\n记住，适度的压力是动力，过度的压力才需要调节。',
                category: 'experience',
                tags: ['心理', '减压', '高考', '健康'],
                likes: 234,
                comments: 67,
                views: 3210,
                favorites: 89,
                createdAt: Date.now() - 14400000
            },
            {
                id: Utils.generateId(),
                author: { name: '物理达人', avatar: '⚡', role: '学生', bio: '物理竞赛获奖者' },
                title: '高中物理学习方法和技巧总结',
                content: '物理是很多同学的痛点，但掌握方法后其实并不难。\n\n核心方法：\n1. 理解概念，而不是死记公式\n2. 多做典型例题，掌握解题思路\n3. 画图分析，把抽象问题具体化\n4. 建立知识体系，形成物理直觉\n\n常见误区：\n- 只刷题不总结\n- 忽视课本概念\n- 不重视实验\n\n有问题欢迎留言讨论！',
                category: 'experience',
                tags: ['物理', '学习方法', '高考', '技巧'],
                likes: 189,
                comments: 45,
                views: 2340,
                favorites: 67,
                createdAt: Date.now() - 18000000
            }
        ];
    },

    createSampleAgents() {
        return [
            {
                id: Utils.generateId(),
                name: '高考数学助手',
                avatar: '🧮',
                type: 'tutor',
                description: '专注于高中数学辅导，涵盖函数、几何、概率等所有知识点，提供详细解题步骤和思路分析。',
                tags: ['数学', '高考', '解题', '辅导'],
                prompt: '你是一位经验丰富的高中数学老师，擅长用简单易懂的方式讲解复杂的数学概念。回答时要：1. 先理解问题的核心 2. 提供清晰的解题步骤 3. 解释每一步的原理 4. 给出相关的知识点拓展',
                greeting: '你好！我是高考数学助手 🧮\n\n我可以帮你解决高中数学的各类问题，包括函数、几何、概率、数列等。\n\n请告诉我你遇到的问题，我会详细为你解答！',
                chats: 1250,
                likes: 356,
                rating: 4.8,
                author: '官方',
                featured: true,
                createdAt: Date.now() - 86400000
            },
            {
                id: Utils.generateId(),
                name: '英语作文批改',
                avatar: '📝',
                type: 'qa',
                description: '专业的英语作文批改助手，提供语法纠错、词汇建议、结构优化等全方位指导，助你写出高分作文。',
                tags: ['英语', '作文', '批改', '写作'],
                prompt: '你是一位资深的英语教师，专注于帮助学生提高英语写作能力。批改作文时要：1. 指出语法错误 2. 提供更地道的表达 3. 优化文章结构 4. 给出改进建议和范文',
                greeting: '欢迎！我是英语作文批改助手 📝\n\n请把你的英语作文发给我，我会帮你：\n• 纠正语法错误\n• 优化词汇表达\n• 改善文章结构\n• 提供写作建议',
                chats: 890,
                likes: 234,
                rating: 4.7,
                author: '官方',
                featured: true,
                createdAt: Date.now() - 172800000
            },
            {
                id: Utils.generateId(),
                name: '学习规划师',
                avatar: '📅',
                type: 'planner',
                description: '根据你的学习情况和目标，制定个性化的学习计划和备考策略，帮你高效利用时间。',
                tags: ['规划', '学习计划', '时间管理', '备考'],
                prompt: '你是一位专业的学习规划师，善于根据学生的具体情况制定合理的学习计划。制定计划时要考虑：1. 学生当前水平 2. 目标分数 3. 可用时间 4. 学习效率 5. 弱项突破',
                greeting: '你好！我是学习规划师 📅\n\n告诉我以下信息，我来帮你制定学习计划：\n• 你的年级和目标\n• 目前各科成绩\n• 每天可学习时间\n• 需要重点突破的科目',
                chats: 560,
                likes: 189,
                rating: 4.6,
                author: '官方',
                featured: false,
                createdAt: Date.now() - 259200000
            },
            {
                id: Utils.generateId(),
                name: '心理辅导小助手',
                avatar: '💚',
                type: 'motivator',
                description: '考前焦虑？学习压力大？我来帮你调节心态，保持积极的学习状态，做你的心灵伙伴。',
                tags: ['心理', '减压', '励志', '情绪管理'],
                prompt: '你是一位温暖的心理辅导员，善于倾听学生的困扰并给予积极的建议。交流时要：1. 先倾听和理解 2. 给予情感支持 3. 提供实用建议 4. 鼓励积极行动',
                greeting: '你好呀！我是心理辅导小助手 💚\n\n备考路上有什么烦恼吗？\n• 学习压力大\n• 考前焦虑\n• 人际困扰\n• 情绪低落\n\n说出来，我们一起面对！',
                chats: 420,
                likes: 167,
                rating: 4.9,
                author: '官方',
                featured: true,
                createdAt: Date.now() - 345600000
            },
            {
                id: Utils.generateId(),
                name: '语文阅读理解',
                avatar: '📖',
                type: 'tutor',
                description: '专注语文阅读理解，教你答题技巧，分析文章结构，提高阅读理解得分率。',
                tags: ['语文', '阅读理解', '答题技巧', '高考'],
                prompt: '你是一位语文老师，擅长阅读理解教学。回答时要：1. 分析文章结构和主旨 2. 讲解答题技巧 3. 提供答题模板 4. 举例说明',
                greeting: '你好！我是语文阅读理解助手 📖\n\n我可以帮你：\n• 分析文章结构\n• 掌握答题技巧\n• 理解文章主旨\n• 提高得分率\n\n请把你的问题发给我！',
                chats: 380,
                likes: 145,
                rating: 4.5,
                author: '官方',
                featured: false,
                createdAt: Date.now() - 432000000
            },
            {
                id: Utils.generateId(),
                name: '化学实验助手',
                avatar: '🧪',
                type: 'qa',
                description: '化学实验操作指导、原理讲解、现象分析，帮你攻克化学实验题。',
                tags: ['化学', '实验', '高考', '原理'],
                prompt: '你是一位化学老师，专注于实验教学。回答时要：1. 解释实验原理 2. 描述操作步骤 3. 分析实验现象 4. 指出注意事项',
                greeting: '你好！我是化学实验助手 🧪\n\n我可以帮你：\n• 理解实验原理\n• 掌握操作步骤\n• 分析实验现象\n• 解决实验问题',
                chats: 290,
                likes: 98,
                rating: 4.4,
                author: '官方',
                featured: false,
                createdAt: Date.now() - 518400000
            }
        ];
    },

    createSampleResources() {
        return [
            { id: Utils.generateId(), title: '2024年全国高考数学真题及解析', subject: 'math', type: 'past', province: 'national', description: '2024年全国甲卷、乙卷数学真题，附带详细解析和考点分析。', downloads: 2340, icon: '📐', size: '2.3MB' },
            { id: Utils.generateId(), title: '高中物理知识点思维导图', subject: 'physics', type: 'notes', province: 'all', description: '涵盖高中物理全部知识点的思维导图，帮助构建知识体系。', downloads: 1560, icon: '⚡', size: '5.1MB' },
            { id: Utils.generateId(), title: '高考英语高频词汇3500', subject: 'english', type: 'notes', province: 'all', description: '高考英语大纲要求词汇，按词频排序，附带例句和用法。', downloads: 3200, icon: '📖', size: '1.2MB' },
            { id: Utils.generateId(), title: '2024高考语文作文预测与范文', subject: 'chinese', type: 'tips', province: 'all', description: '基于时事热点的高考作文预测，附带高分范文解析。', downloads: 1890, icon: '✍️', size: '890KB' },
            { id: Utils.generateId(), title: '化学实验操作视频合集', subject: 'chemistry', type: 'video', province: 'all', description: '高中化学必考实验的操作视频，详细讲解实验原理和注意事项。', downloads: 980, icon: '🧪', size: '156MB' },
            { id: Utils.generateId(), title: '历史时间线记忆法', subject: 'history', type: 'tips', province: 'all', description: '用时间线的方式整理中外历史大事，便于记忆和理解。', downloads: 1120, icon: '📜', size: '2.8MB' },
            { id: Utils.generateId(), title: '生物知识点速记手册', subject: 'biology', type: 'notes', province: 'all', description: '高中生物核心知识点速记，图表结合，便于复习。', downloads: 890, icon: '🧬', size: '3.5MB' },
            { id: Utils.generateId(), title: '政治时政热点汇编', subject: 'politics', type: 'notes', province: 'all', description: '2024年重要时政热点整理，附带考点分析。', downloads: 1450, icon: '📰', size: '1.8MB' },
            { id: Utils.generateId(), title: '地理图表解读技巧', subject: 'geography', type: 'tips', province: 'all', description: '高考地理图表题解题技巧，涵盖各类图表分析方法。', downloads: 760, icon: '🌍', size: '4.2MB' },
            { id: Utils.generateId(), title: '高考数学压轴题突破', subject: 'math', type: 'mock', province: 'all', description: '精选高考数学压轴题，详细解析解题思路和方法。', downloads: 1680, icon: '🔢', size: '2.1MB' },
            { id: Utils.generateId(), title: '英语听力训练音频', subject: 'english', type: 'video', province: 'all', description: '高考英语听力模拟训练音频，含原文和解析。', downloads: 2100, icon: '🎧', size: '89MB' },
            { id: Utils.generateId(), title: '语文文言文全解', subject: 'chinese', type: 'notes', province: 'all', description: '高中语文文言文篇目全解，含翻译、注释、赏析。', downloads: 1950, icon: '📚', size: '6.7MB' }
        ];
    },

    createSampleStories() {
        return [
            {
                id: Utils.generateId(),
                author: '小王同学',
                avatar: '👦',
                location: '云南山区',
                content: '感谢教育平权社区的志愿者老师，通过在线辅导，我的数学成绩从60分提高到了120分。虽然我们学校条件有限，但通过网络，我也能享受到优质的教育资源。今年高考我考上了理想的大学！'
            },
            {
                id: Utils.generateId(),
                author: '李老师',
                avatar: '👨‍🏫',
                location: '甘肃农村',
                content: '作为一名乡村教师，我深知教育资源的不均衡。加入教育平权社区后，我不仅能为更多学生提供帮助，也从其他老师那里学到了很多教学方法。这个平台让教育资源的流动变得更加顺畅。'
            },
            {
                id: Utils.generateId(),
                author: '高考生小陈',
                avatar: '👧',
                location: '贵州山区',
                content: '通过社区分享的真题和笔记，我成功考上了理想的大学。现在我也成为了志愿者，希望能帮助更多像我一样的农村学子。教育改变命运，我会把这份爱传递下去。'
            },
            {
                id: Utils.generateId(),
                author: '张妈妈',
                avatar: '👩',
                location: '河南农村',
                content: '孩子在学校成绩一直不好，我们家长也不懂怎么辅导。通过社区找到的志愿者老师，耐心地给孩子讲解，现在孩子对学习有了信心，成绩也提高了。真心感谢这个平台！'
            }
        ];
    }
};

const Router = {
    currentPage: 'home',
    history: [],
    params: {},

    init() {
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                this.navigate(e.state.page, false);
            }
        });

        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('[data-page]');
            if (link) {
                e.preventDefault();
                this.navigate(link.dataset.page);
            }
        });

        this.handleInitialRoute();
    },

    handleInitialRoute() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            const [page, ...params] = hash.split('/');
            if (this.isValidPage(page)) {
                this.navigate(page, false);
                this.params = { id: params[0] };
            } else {
                this.navigate('home', false);
            }
        } else {
            this.navigate('home', false);
        }
    },

    isValidPage(page) {
        const validPages = ['home', 'community', 'agents', 'gaokao', 'equity', 'profile', 'settings'];
        return validPages.includes(page);
    },

    navigate(page, pushState = true) {
        if (!this.isValidPage(page)) {
            page = 'home';
        }

        const prevPage = this.currentPage;
        this.currentPage = page;
        this.history.push(page);

        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
            targetPage.style.animation = 'fadeIn 0.3s ease';
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        if (pushState) {
            history.pushState({ page }, '', `#${page}`);
        }

        EventBus.emit('router:navigate', { page, prevPage });
        Utils.scrollToTop();
    },

    back() {
        if (this.history.length > 1) {
            this.history.pop();
            const prevPage = this.history[this.history.length - 1];
            this.navigate(prevPage, false);
        }
    },

    getParam(key) {
        return this.params[key];
    }
};

const Modal = {
    stack: [],
    
    open(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.stack.push(id);

        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        EventBus.emit('modal:open', { id });
    },

    close(id) {
        const modal = id ? document.getElementById(id) : document.getElementById(this.stack.pop());
        if (!modal) return;

        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            if (this.stack.length === 0) {
                document.body.style.overflow = '';
            }
        }, 200);

        EventBus.emit('modal:close', { id });
    },

    closeAll() {
        while (this.stack.length > 0) {
            const id = this.stack.pop();
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.remove('active', 'show');
                modal.style.display = 'none';
            }
        }
        document.body.style.overflow = '';
    },

    isOpen() {
        return this.stack.length > 0;
    }
};

const Toast = {
    queue: [],
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 3000) {
        this.init();

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${Utils.escapeHtml(message)}</span>
        `;

        this.container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);

        EventBus.emit('toast:show', { message, type });
    },

    success(message, duration) {
        this.show(message, 'success', duration);
    },

    error(message, duration) {
        this.show(message, 'error', duration);
    },

    warning(message, duration) {
        this.show(message, 'warning', duration);
    },

    info(message, duration) {
        this.show(message, 'info', duration);
    }
};

const Loader = {
    show(message = '加载中...') {
        let loader = document.getElementById('globalLoader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.className = 'global-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <div class="loader-message">${message}</div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.classList.add('active');
    },

    hide() {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.classList.remove('active');
            setTimeout(() => loader.remove(), 300);
        }
    }
};

const AnimationManager = {
    observer: null,

    init() {
        this.initIntersectionObserver();
        this.initStaggerAnimations();
    },

    initIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.stagger-item').forEach(el => {
            this.observer.observe(el);
        });
    },

    initStaggerAnimations() {
        const containers = document.querySelectorAll('[data-stagger]');
        containers.forEach(container => {
            const items = container.children;
            Array.from(items).forEach((item, index) => {
                item.classList.add('stagger-item');
                item.style.animationDelay = `${index * 0.1}s`;
            });
        });
    },

    animateElement(element, animation, duration = 300) {
        return new Promise(resolve => {
            element.style.animation = `${animation} ${duration}ms ease forwards`;
            setTimeout(resolve, duration);
        });
    },

    async staggerIn(elements, delay = 100) {
        for (let i = 0; i < elements.length; i++) {
            await this.delay(delay);
            elements[i].classList.add('visible');
        }
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    shake(element) {
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 500);
    },

    pulse(element) {
        element.classList.add('pulse');
        setTimeout(() => element.classList.remove('pulse'), 2000);
    },

    confetti(count = 50) {
        const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        const container = document.createElement('div');
        container.className = 'confetti';
        document.body.appendChild(container);

        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.top = '-10px';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 0.5 + 's';
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(piece);
        }

        setTimeout(() => container.remove(), 4000);
    },

    ripple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    },

    typewriter(element, text, speed = 30) {
        return new Promise(resolve => {
            element.textContent = '';
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    },

    countUp(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const diff = end - start;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + diff * eased);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
};

const ErrorHandler = {
    errors: [],
    maxErrors: 50,

    init() {
        window.onerror = (message, source, lineno, colno, error) => {
            this.handleError({
                type: 'javascript',
                message,
                source,
                lineno,
                colno,
                stack: error?.stack,
                timestamp: Date.now()
            });
            return false;
        };

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled Promise Rejection',
                stack: event.reason?.stack,
                timestamp: Date.now()
            });
        });

        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleError({
                    type: 'resource',
                    message: `Failed to load: ${event.target.src || event.target.href}`,
                    tagName: event.target.tagName,
                    timestamp: Date.now()
                });
            }
        }, true);
    },

    handleError(error) {
        this.errors.push(error);
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        console.error('[ErrorHandler]', error);

        if (error.type === 'javascript' && !this.isIgnorable(error.message)) {
            Toast.error('发生错误，请刷新页面重试');
        }

        EventBus.emit('error:occurred', error);
    },

    isIgnorable(message) {
        const ignorable = [
            'ResizeObserver',
            'Network request failed',
            'Script error',
            'Non-Error promise rejection'
        ];
        return ignorable.some(pattern => message?.includes(pattern));
    },

    getErrors() {
        return this.errors;
    },

    clearErrors() {
        this.errors = [];
    },

    showReportDialog() {
        const errorReport = this.errors.slice(-5).map(e => 
            `[${new Date(e.timestamp).toISOString()}] ${e.type}: ${e.message}`
        ).join('\n');

        const content = `
            <div class="error-report">
                <p>最近错误记录：</p>
                <pre class="error-log">${errorReport || '无错误记录'}</pre>
                <button class="btn-secondary btn-full" onclick="ErrorHandler.clearErrors(); Toast.success('已清除'); Modal.close('errorReportModal');">清除错误记录</button>
            </div>
        `;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'errorReportModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>错误报告</h2>
                    <button class="modal-close" onclick="Modal.close('errorReportModal')">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        Modal.closeAll();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        Modal.closeAll();
    }
});

ErrorHandler.init();

window.EventBus = EventBus;
window.Utils = Utils;
window.Store = Store;
window.Router = Router;
window.Modal = Modal;
window.Toast = Toast;
window.Loader = Loader;
window.ErrorHandler = ErrorHandler;
window.AnimationManager = AnimationManager;

const I18n = {
    locale: 'zh-CN',
    fallbackLocale: 'zh-CN',
    messages: {},

    translations: {
        'zh-CN': {
            common: {
                search: '搜索',
                login: '登录',
                logout: '退出',
                save: '保存',
                cancel: '取消',
                delete: '删除',
                edit: '编辑',
                create: '创建',
                submit: '提交',
                loading: '加载中...',
                success: '成功',
                error: '错误',
                warning: '警告',
                confirm: '确认',
                back: '返回',
                next: '下一步',
                previous: '上一步',
                close: '关闭',
                more: '更多',
                all: '全部',
                none: '无'
            },
            nav: {
                home: '首页',
                community: '社区',
                agents: '智能体',
                gaokao: '高考资源',
                equity: '教育平权',
                profile: '个人中心',
                settings: '设置'
            },
            home: {
                heroTitle: '教育平权，人人共享',
                heroSubtitle: '打破教育资源壁垒，让每个学子都能获得公平的教育机会',
                members: '社区成员',
                posts: '分享帖子',
                agents: '智能体',
                resources: '学习资源',
                joinCommunity: '加入社区',
                createAgent: '创建智能体',
                studyStats: '学习统计',
                todayHours: '今日学习(小时)',
                streak: '连续学习(天)',
                goals: '目标完成'
            },
            community: {
                title: '社区广场',
                subtitle: '分享学习心得，交流备考经验',
                newPost: '发布帖子',
                hotTopics: '热门话题',
                latestPosts: '最新帖子',
                noPosts: '暂无帖子',
                loginToPost: '登录后发帖'
            },
            agent: {
                title: '智能体',
                subtitle: '创建专属AI助手，辅助学习',
                createAgent: '创建智能体',
                myAgents: '我的智能体',
                popularAgents: '热门智能体',
                startChat: '开始对话',
                typing: '正在输入...'
            },
            resource: {
                title: '高考资源',
                subtitle: '汇集优质学习资料',
                download: '下载',
                downloads: '次下载',
                subjects: {
                    math: '数学',
                    chinese: '语文',
                    english: '英语',
                    physics: '物理',
                    chemistry: '化学',
                    biology: '生物',
                    history: '历史',
                    geography: '地理',
                    politics: '政治'
                }
            },
            profile: {
                title: '个人中心',
                editProfile: '编辑资料',
                myPosts: '我的帖子',
                myAgents: '我的智能体',
                favorites: '收藏',
                studyData: '学习数据'
            },
            settings: {
                title: '设置',
                appearance: '外观',
                theme: '主题模式',
                themeLight: '浅色',
                themeDark: '深色',
                themeAuto: '自动',
                fontSize: '字体大小',
                notifications: '通知',
                pushNotifications: '推送通知',
                soundNotifications: '声音通知',
                privacy: '隐私',
                publicProfile: '公开资料',
                data: '数据',
                exportData: '导出数据',
                importData: '导入数据',
                clearCache: '清除缓存',
                deleteAccount: '删除账户'
            },
            errors: {
                networkError: '网络错误，请检查网络连接',
                serverError: '服务器错误，请稍后重试',
                notFound: '未找到相关内容',
                unauthorized: '请先登录',
                validationError: '输入信息有误',
                unknown: '发生未知错误'
            }
        },
        'en-US': {
            common: {
                search: 'Search',
                login: 'Login',
                logout: 'Logout',
                save: 'Save',
                cancel: 'Cancel',
                delete: 'Delete',
                edit: 'Edit',
                create: 'Create',
                submit: 'Submit',
                loading: 'Loading...',
                success: 'Success',
                error: 'Error',
                warning: 'Warning',
                confirm: 'Confirm',
                back: 'Back',
                next: 'Next',
                previous: 'Previous',
                close: 'Close',
                more: 'More',
                all: 'All',
                none: 'None'
            },
            nav: {
                home: 'Home',
                community: 'Community',
                agents: 'Agents',
                gaokao: 'Resources',
                equity: 'Equity',
                profile: 'Profile',
                settings: 'Settings'
            },
            home: {
                heroTitle: 'Education Equity for All',
                heroSubtitle: 'Breaking barriers to quality education',
                members: 'Members',
                posts: 'Posts',
                agents: 'Agents',
                resources: 'Resources',
                joinCommunity: 'Join Community',
                createAgent: 'Create Agent',
                studyStats: 'Study Stats',
                todayHours: 'Today (hours)',
                streak: 'Streak (days)',
                goals: 'Goals'
            },
            community: {
                title: 'Community',
                subtitle: 'Share and learn together',
                newPost: 'New Post',
                hotTopics: 'Hot Topics',
                latestPosts: 'Latest Posts',
                noPosts: 'No posts yet',
                loginToPost: 'Login to post'
            },
            agent: {
                title: 'AI Agents',
                subtitle: 'Create your AI assistant',
                createAgent: 'Create Agent',
                myAgents: 'My Agents',
                popularAgents: 'Popular Agents',
                startChat: 'Start Chat',
                typing: 'Typing...'
            },
            resource: {
                title: 'Resources',
                subtitle: 'Quality learning materials',
                download: 'Download',
                downloads: 'downloads',
                subjects: {
                    math: 'Math',
                    chinese: 'Chinese',
                    english: 'English',
                    physics: 'Physics',
                    chemistry: 'Chemistry',
                    biology: 'Biology',
                    history: 'History',
                    geography: 'Geography',
                    politics: 'Politics'
                }
            },
            profile: {
                title: 'Profile',
                editProfile: 'Edit Profile',
                myPosts: 'My Posts',
                myAgents: 'My Agents',
                favorites: 'Favorites',
                studyData: 'Study Data'
            },
            settings: {
                title: 'Settings',
                appearance: 'Appearance',
                theme: 'Theme',
                themeLight: 'Light',
                themeDark: 'Dark',
                themeAuto: 'Auto',
                fontSize: 'Font Size',
                notifications: 'Notifications',
                pushNotifications: 'Push Notifications',
                soundNotifications: 'Sound',
                privacy: 'Privacy',
                publicProfile: 'Public Profile',
                data: 'Data',
                exportData: 'Export Data',
                importData: 'Import Data',
                clearCache: 'Clear Cache',
                deleteAccount: 'Delete Account'
            },
            errors: {
                networkError: 'Network error',
                serverError: 'Server error',
                notFound: 'Not found',
                unauthorized: 'Please login',
                validationError: 'Invalid input',
                unknown: 'Unknown error'
            }
        }
    },

    init() {
        const saved = localStorage.getItem('eduequity_locale');
        if (saved && this.translations[saved]) {
            this.locale = saved;
        } else {
            const browserLang = navigator.language;
            if (this.translations[browserLang]) {
                this.locale = browserLang;
            }
        }
        this.messages = this.translations[this.locale];
    },

    setLocale(locale) {
        if (this.translations[locale]) {
            this.locale = locale;
            this.messages = this.translations[locale];
            localStorage.setItem('eduequity_locale', locale);
            document.documentElement.lang = locale;
            EventBus.emit('locale:changed', locale);
        }
    },

    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.messages;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return this.getFallback(key, params);
            }
        }

        if (typeof value === 'string') {
            return this.interpolate(value, params);
        }

        return key;
    },

    getFallback(key, params) {
        const keys = key.split('.');
        let value = this.translations[this.fallbackLocale];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        return typeof value === 'string' ? this.interpolate(value, params) : key;
    },

    interpolate(str, params) {
        return str.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    },

    getLocales() {
        return Object.keys(this.translations);
    },

    getCurrentLocale() {
        return this.locale;
    },

    getLocaleName(locale) {
        const names = {
            'zh-CN': '简体中文',
            'en-US': 'English'
        };
        return names[locale] || locale;
    }
};

const ShortcutManager = {
    shortcuts: {
        'alt+h': { action: 'navigate', page: 'home', label: '首页' },
        'alt+c': { action: 'navigate', page: 'community', label: '社区' },
        'alt+a': { action: 'navigate', page: 'agents', label: '智能体' },
        'alt+r': { action: 'navigate', page: 'gaokao', label: '资源' },
        'alt+e': { action: 'navigate', page: 'equity', label: '平权' },
        'alt+p': { action: 'navigate', page: 'profile', label: '个人中心' },
        'alt+s': { action: 'navigate', page: 'settings', label: '设置' },
        '/': { action: 'search', label: '搜索' },
        'alt+n': { action: 'newPost', label: '发帖' },
        'alt+f': { action: 'favorites', label: '收藏' },
        'alt+l': { action: 'toggleTheme', label: '切换主题' },
        'escape': { action: 'closeModal', label: '关闭弹窗' },
        'alt+?': { action: 'showHelp', label: '快捷键帮助' }
    },

    init() {
        this.bindShortcuts();
    },

    bindShortcuts() {
        document.addEventListener('keydown', (e) => {
            const key = this.getKey(e);
            const shortcut = this.shortcuts[key];

            if (shortcut && !this.isInputFocused(e)) {
                e.preventDefault();
                this.executeShortcut(shortcut);
            }
        });
    },

    getKey(e) {
        const modifiers = [];
        if (e.altKey) modifiers.push('alt');
        if (e.ctrlKey) modifiers.push('ctrl');
        if (e.shiftKey) modifiers.push('shift');
        if (e.metaKey) modifiers.push('meta');

        const key = e.key.toLowerCase();
        return modifiers.length > 0 ? `${modifiers.join('+')}${key}` : key;
    },

    isInputFocused(e) {
        const target = e.target;
        return target.matches('input, textarea, [contenteditable]') || 
               target.closest('[contenteditable]');
    },

    executeShortcut(shortcut) {
        switch (shortcut.action) {
            case 'navigate':
                Router.navigate(shortcut.page);
                break;
            case 'search':
                SearchManager.open();
                break;
            case 'newPost':
                Router.navigate('community');
                setTimeout(() => Modal.open('createPostModal'), 100);
                break;
            case 'favorites':
                Router.navigate('profile');
                setTimeout(() => {
                    document.querySelector('.profile-tab[data-tab="favorites-posts"]')?.click();
                }, 100);
                break;
            case 'toggleTheme':
                SettingsManager.settings.theme = SettingsManager.settings.theme === 'light' ? 'dark' : 'light';
                SettingsManager.applyTheme();
                SettingsManager.saveSettings();
                Toast.success('主题已切换');
                break;
            case 'closeModal':
                Modal.closeAll();
                break;
            case 'showHelp':
                this.showHelp();
                break;
        }
    },

    showHelp() {
        const content = `
            <div class="shortcuts-help">
                <div class="shortcuts-help-header">
                    <h3>⌨️ 快捷键</h3>
                    <p>使用快捷键提升操作效率</p>
                </div>
                <div class="shortcuts-list">
                    ${Object.entries(this.shortcuts).map(([key, shortcut]) => `
                        <div class="shortcut-item">
                            <kbd class="shortcut-key">${this.formatKey(key)}</kbd>
                            <span class="shortcut-label">${shortcut.label}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="shortcuts-tip">
                    💡 提示：在输入框中快捷键不会触发
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'shortcutsHelpModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>快捷键帮助</h2>
                    <button class="modal-close" onclick="Modal.close('shortcutsHelpModal')">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    formatKey(key) {
        return key.replace(/\+/g, ' + ').toUpperCase();
    },

    registerShortcut(key, action, label) {
        this.shortcuts[key] = { action, label };
    },

    unregisterShortcut(key) {
        delete this.shortcuts[key];
    }
};

window.I18n = I18n;
window.ShortcutManager = ShortcutManager;
I18n.init();
ShortcutManager.init();

const PerformanceMonitor = {
    metrics: {
        pageLoadTime: 0,
        domContentLoaded: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0,
        memoryUsage: 0,
        apiResponseTimes: [],
        renderTimes: []
    },
    maxSamples: 100,

    init() {
        this.measurePageLoad();
        this.observeWebVitals();
        this.startMemoryMonitoring();
        this.bindEvents();
    },

    measurePageLoad() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
            this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        }
    },

    observeWebVitals() {
        if ('PerformanceObserver' in window) {
            try {
                const paintObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            this.metrics.firstContentfulPaint = entry.startTime;
                        }
                        if (entry.name === 'largest-contentful-paint') {
                            this.metrics.largestContentfulPaint = entry.startTime;
                        }
                    }
                });
                paintObserver.observe({ type: 'paint', buffered: true });

                const layoutShiftObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            this.metrics.cumulativeLayoutShift += entry.value;
                        }
                    }
                });
                layoutShiftObserver.observe({ type: 'layout-shift', buffered: true });
            } catch (e) {
                console.warn('Web Vitals monitoring not supported');
            }
        }

        this.measureFID();
    },

    measureFID() {
        if ('PerformanceEventTiming' in window) {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.processingStart && entry.startTime) {
                        this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                    }
                }
            });
            perfObserver.observe({ type: 'first-input', buffered: true });
        }
    },

    startMemoryMonitoring() {
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
            }, 5000);
        }
    },

    bindEvents() {
        EventBus.on('api:request', (url) => {
            this.trackApiRequest(url);
        });

        EventBus.on('api:response', (url, duration) => {
            this.trackApiResponse(url, duration);
        });

        EventBus.on('render:start', (component) => {
            this.trackRenderStart(component);
        });

        EventBus.on('render:end', (component, duration) => {
            this.trackRenderEnd(component, duration);
        });
    },

    trackApiRequest(url) {
        this.apiRequests = this.apiRequests || {};
        this.apiRequests[url] = Date.now();
    },

    trackApiResponse(url, duration) {
        if (!this.metrics.apiResponseTimes) {
            this.metrics.apiResponseTimes = [];
        }
        this.metrics.apiResponseTimes.push({ url, duration, timestamp: Date.now() });
        if (this.metrics.apiResponseTimes.length > this.maxSamples) {
            this.metrics.apiResponseTimes.shift();
        }
    },

    trackRenderStart(component) {
        this.renderStarts = this.renderStarts || {};
        this.renderStarts[component] = performance.now();
    },

    trackRenderEnd(component, duration) {
        if (!this.metrics.renderTimes) {
            this.metrics.renderTimes = [];
        }
        this.metrics.renderTimes.push({ component, duration, timestamp: Date.now() });
        if (this.metrics.renderTimes.length > this.maxSamples) {
            this.metrics.renderTimes.shift();
        }
    },

    getMetrics() {
        return {
            ...this.metrics,
            avgApiResponseTime: this.getAvgApiResponseTime(),
            avgRenderTime: this.getAvgRenderTime(),
            score: this.calculatePerformanceScore()
        };
    },

    getAvgApiResponseTime() {
        if (!this.metrics.apiResponseTimes || this.metrics.apiResponseTimes.length === 0) {
            return 0;
        }
        const total = this.metrics.apiResponseTimes.reduce((sum, m) => sum + m.duration, 0);
        return total / this.metrics.apiResponseTimes.length;
    },

    getAvgRenderTime() {
        if (!this.metrics.renderTimes || this.metrics.renderTimes.length === 0) {
            return 0;
        }
        const total = this.metrics.renderTimes.reduce((sum, m) => sum + m.duration, 0);
        return total / this.metrics.renderTimes.length;
    },

    calculatePerformanceScore() {
        let score = 100;

        if (this.metrics.pageLoadTime > 3000) score -= 10;
        else if (this.metrics.pageLoadTime > 2000) score -= 5;

        if (this.metrics.firstContentfulPaint > 2000) score -= 10;
        else if (this.metrics.firstContentfulPaint > 1000) score -= 5;

        if (this.metrics.cumulativeLayoutShift > 0.25) score -= 15;
        else if (this.metrics.cumulativeLayoutShift > 0.1) score -= 5;

        const avgApiTime = this.getAvgApiResponseTime();
        if (avgApiTime > 1000) score -= 10;
        else if (avgApiTime > 500) score -= 5;

        const avgRenderTime = this.getAvgRenderTime();
        if (avgRenderTime > 100) score -= 10;
        else if (avgRenderTime > 50) score -= 5;

        return Math.max(0, Math.min(100, score));
    },

    getPerformanceReport() {
        const metrics = this.getMetrics();
        return `
            性能报告
            ===========
            
            页面加载时间: ${metrics.pageLoadTime.toFixed(0)}ms
            DOM加载时间: ${metrics.domContentLoaded.toFixed(0)}ms
            首次内容绘制: ${metrics.firstContentfulPaint.toFixed(0)}ms
            最大内容绘制: ${metrics.largestContentfulPaint.toFixed(0)}ms
            首次输入延迟: ${metrics.firstInputDelay.toFixed(0)}ms
            累积布局偏移: ${metrics.cumulativeLayoutShift.toFixed(3)}
            内存使用: ${metrics.memoryUsage.toFixed(2)}MB
            平均API响应: ${metrics.avgApiResponseTime.toFixed(0)}ms
            平均渲染时间: ${metrics.avgRenderTime.toFixed(0)}ms
            
            性能评分: ${metrics.score}/100
        `;
    },

    showPerformancePanel() {
        const metrics = this.getMetrics();
        const content = `
            <div class="perf-panel">
                <div class="perf-header">
                    <h3>📊 性能监控</h3>
                    <button class="btn-secondary btn-sm" onclick="PerformanceMonitor.refresh()">刷新</button>
                </div>
                <div class="perf-metrics">
                    <div class="perf-metric">
                        <div class="perf-metric-label">页面加载</div>
                        <div class="perf-metric-value ${this.getMetricClass(metrics.pageLoadTime, 2000)}">${metrics.pageLoadTime.toFixed(0)}ms</div>
                    </div>
                    <div class="perf-metric">
                        <div class="perf-metric-label">首次绘制</div>
                        <div class="perf-metric-value ${this.getMetricClass(metrics.firstContentfulPaint, 1000)}">${metrics.firstContentfulPaint.toFixed(0)}ms</div>
                    </div>
                    <div class="perf-metric">
                        <div class="perf-metric-label">布局偏移</div>
                        <div class="perf-metric-value ${this.getCLSClass(metrics.cumulativeLayoutShift)}">${metrics.cumulativeLayoutShift.toFixed(3)}</div>
                    </div>
                    <div class="perf-metric">
                        <div class="perf-metric-label">内存使用</div>
                        <div class="perf-metric-value">${metrics.memoryUsage.toFixed(2)}MB</div>
                    </div>
                    <div class="perf-metric">
                        <div class="perf-metric-label">API响应</div>
                        <div class="perf-metric-value ${this.getMetricClass(metrics.avgApiResponseTime, 500)}">${metrics.avgApiResponseTime.toFixed(0)}ms</div>
                    </div>
                    <div class="perf-metric">
                        <div class="perf-metric-label">渲染时间</div>
                        <div class="perf-metric-value ${this.getMetricClass(metrics.avgRenderTime, 50)}">${metrics.avgRenderTime.toFixed(0)}ms</div>
                    </div>
                </div>
                <div class="perf-score">
                    <div class="perf-score-label">性能评分</div>
                    <div class="perf-score-value ${this.getScoreClass(metrics.score)}">${metrics.score.toFixed(0)}</div>
                </div>
                <div class="perf-tips">
                    ${this.getPerformanceTips(metrics)}
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'perfModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>性能监控</h2>
                    <button class="modal-close" onclick="Modal.close('perfModal')">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    getMetricClass(value, threshold) {
        if (value <= threshold * 0.5) return 'perf-good';
        if (value <= threshold) return 'perf-ok';
        return 'perf-bad';
    },

    getCLSClass(value) {
        if (value <= 0.1) return 'perf-good';
        if (value <= 0.25) return 'perf-ok';
        return 'perf-bad';
    },

    getScoreClass(score) {
        if (score >= 80) return 'perf-good';
        if (score >= 60) return 'perf-ok';
        return 'perf-bad';
    },

    getPerformanceTips(metrics) {
        const tips = [];
        if (metrics.pageLoadTime > 2000) tips.push('页面加载较慢，建议优化资源加载');
        if (metrics.firstContentfulPaint > 1000) tips.push('首次绘制较慢，建议优化关键CSS');
        if (metrics.cumulativeLayoutShift > 0.25) tips.push('布局偏移较大，建议检查图片尺寸');
        if (metrics.avgApiResponseTime > 500) tips.push('API响应较慢，建议优化网络请求');
        if (metrics.avgRenderTime > 50) tips.push('渲染时间较长，建议减少DOM操作');
        return tips.length > 0 ? tips.map(t => `<div class="perf-tip">💡 ${t}</div>`).join('') : '<div class="perf-tip perf-good">✅ 性能表现良好</div>';
    },

    refresh() {
        this.metrics = {
            pageLoadTime: 0,
            domContentLoaded: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            firstInputDelay: 0,
            cumulativeLayoutShift: 0,
            memoryUsage: 0,
            apiResponseTimes: [],
            renderTimes: []
        };
        this.measurePageLoad();
        this.showPerformancePanel();
    }
};

window.PerformanceMonitor = PerformanceMonitor;

const OnboardingManager = {
    steps: [],
    currentStep: 0,
    isActive: false,
    overlay: null,
    tooltip: null,

    init() {
        this.checkFirstVisit();
        this.bindEvents();
    },

    checkFirstVisit() {
        const hasVisited = localStorage.getItem('eduequity_onboarding_completed');
        if (!hasVisited) {
            this.showOnboarding();
        }
    },

    showOnboarding() {
        this.steps = [
            {
                target: '.nav-item[data-page="home"]',
                title: '🏠 首页',
                content: '这里是您的学习中心，可以快速访问最新内容和推荐资源。',
                position: 'bottom'
            },
            {
                target: '.nav-item[data-page="community"]',
                title: '💬 社区',
                content: '与同学交流学习心得，分享备考经验，互相鼓励。',
                position: 'bottom'
            },
            {
                target: '.nav-item[data-page="agents"]',
                title: '🤖 智能体',
                content: '创建和使用AI学习助手，个性化辅导您的学习。',
                position: 'bottom'
            },
            {
                target: '.search-trigger',
                title: '🔍 搜索',
                content: '快速查找帖子、智能体和学习资源。',
                position: 'bottom'
            },
            {
                target: '.theme-toggle',
                title: '🎨 主题',
                content: '切换深色/浅色模式，保护您的眼睛。',
                position: 'bottom'
            },
            {
                target: '.notification-trigger',
                title: '🔔 通知',
                content: '查看最新动态和互动消息。',
                position: 'bottom'
            },
            {
                target: '.nav-item[data-page="settings"]',
                title: '⚙️ 设置',
                content: '个性化您的使用体验，调整字体、主题和通知偏好。',
                position: 'bottom'
            }
        ];

        this.currentStep = 0;
        this.isActive = true;
        this.createOverlay();
        this.showStep(0);
    },

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'onboarding-overlay';
        this.overlay.innerHTML = `
            <div class="onboarding-highlight"></div>
            <div class="onboarding-tooltip">
                <div class="onboarding-tooltip-content">
                    <div class="onboarding-tooltip-title"></div>
                    <div class="onboarding-tooltip-text"></div>
                </div>
                <div class="onboarding-tooltip-footer">
                    <div class="onboarding-dots"></div>
                    <div class="onboarding-tooltip-actions">
                        <button class="btn-secondary btn-sm" id="onboardingSkip">跳过</button>
                        <button class="btn-primary btn-sm" id="onboardingNext">下一步</button>
                    </div>
                </div>
                <button class="onboarding-close" id="onboardingClose">&times;</button>
            </div>
        `;
        document.body.appendChild(this.overlay);

        this.bindTooltipEvents();
    },

    bindTooltipEvents() {
        document.getElementById('onboardingSkip').addEventListener('click', () => this.skip());
        document.getElementById('onboardingNext').addEventListener('click', () => this.next());
        document.getElementById('onboardingClose').addEventListener('click', () => this.close());
    },

    showStep(index) {
        if (index >= this.steps.length) {
            this.complete();
            return;
        }

        this.currentStep = index;
        const step = this.steps[index];
        const target = document.querySelector(step.target);

        if (!target) {
            this.next();
            return;
        }

        const highlight = this.overlay.querySelector('.onboarding-highlight');
        const rect = target.getBoundingClientRect();
        
        highlight.style.top = rect.top + 'px';
        highlight.style.left = rect.left + 'px';
        highlight.style.width = rect.width + 'px';
        highlight.style.height = rect.height + 'px';

        const tooltip = this.overlay.querySelector('.onboarding-tooltip');
        tooltip.className = 'onboarding-tooltip onboarding-tooltip-' + step.position;

        tooltip.querySelector('.onboarding-tooltip-title').textContent = step.title;
        tooltip.querySelector('.onboarding-tooltip-text').textContent = step.content;

        this.updateDots();
        this.updateButtons();
    },

    updateDots() {
        const dotsContainer = this.overlay.querySelector('.onboarding-dots');
        dotsContainer.innerHTML = this.steps.map((_, i) => `
            <div class="onboarding-dot ${i === this.currentStep ? 'active' : ''}"></div>
        `).join('');
    },

    updateButtons() {
        const nextBtn = document.getElementById('onboardingNext');
        nextBtn.textContent = this.currentStep === this.steps.length - 1 ? '完成' : '下一步';
    },

    next() {
        this.showStep(this.currentStep + 1);
    },

    skip() {
        this.complete();
    },

    close() {
        this.complete();
    },

    complete() {
        this.isActive = false;
        if (this.overlay) {
            this.overlay.classList.add('fade-out');
            setTimeout(() => {
                if (this.overlay) {
                    this.overlay.remove();
                    this.overlay = null;
                }
            }, 300);
        }
        localStorage.setItem('eduequity_onboarding_completed', 'true');
        EventBus.emit('onboarding:completed');
    },

    restart() {
        localStorage.removeItem('eduequity_onboarding_completed');
        this.showOnboarding();
    },

    bindEvents() {
        EventBus.on('onboarding:restart', () => this.restart());
        EventBus.on('onboarding:show', (stepIndex) => {
            if (!this.isActive) {
                this.showOnboarding();
            }
            if (stepIndex !== undefined) {
                this.showStep(stepIndex);
            }
        });
    }
};

window.OnboardingManager = OnboardingManager;

const LayoutManager = {
    settings: {
        density: 'comfortable',
        cardSize: 'medium',
        sidebarPosition: 'left',
        showSidebar: true
    },
    densities: ['compact', 'comfortable', 'spacious'],
    cardSizes: ['small', 'medium', 'large'],
    draggedItem: null,
    dragOverItem: null,

    init() {
        this.loadSettings();
        this.applySettings();
        this.bindEvents();
        setTimeout(() => this.initDragAndDrop(), 100);
    },

    loadSettings() {
        const saved = localStorage.getItem('eduequity_layout_settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    },

    saveSettings() {
        localStorage.setItem('eduequity_layout_settings', JSON.stringify(this.settings));
    },

    applySettings() {
        document.documentElement.setAttribute('data-density', this.settings.density);
        document.documentElement.setAttribute('data-card-size', this.settings.cardSize);
        
        const sidebar = document.querySelector('.community-sidebar');
        if (sidebar) {
            sidebar.style.display = this.settings.showSidebar ? 'flex' : 'none';
        }
    },

    setDensity(density) {
        if (this.densities.includes(density)) {
            this.settings.density = density;
            this.applySettings();
            this.saveSettings();
            EventBus.emit('layout:changed', { type: 'density', value: density });
        }
    },

    setCardSize(size) {
        if (this.cardSizes.includes(size)) {
            this.settings.cardSize = size;
            this.applySettings();
            this.saveSettings();
            EventBus.emit('layout:changed', { type: 'cardSize', value: size });
        }
    },

    toggleSidebar() {
        this.settings.showSidebar = !this.settings.showSidebar;
        this.applySettings();
        this.saveSettings();
        EventBus.emit('layout:changed', { type: 'sidebar', value: this.settings.showSidebar });
    },

    initDragAndDrop() {
        const containers = document.querySelectorAll('[data-draggable]');
        containers.forEach(container => {
            container.addEventListener('dragstart', (e) => this.onDragStart(e));
            container.addEventListener('dragover', (e) => this.onDragOver(e));
            container.addEventListener('drop', (e) => this.onDrop(e));
            container.addEventListener('dragend', (e) => this.onDragEnd(e));
        });
    },

    onDragStart(e) {
        const item = e.target.closest('[data-draggable]');
        if (!item) return;

        this.draggedItem = item;
        item.classList.add('dragging');
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', item.innerHTML);
    },

    onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const item = e.target.closest('[data-draggable]');
        if (item && item !== this.draggedItem) {
            this.dragOverItem = item;
            item.classList.add('drag-over');
        }
    },

    onDrop(e) {
        e.preventDefault();
        
        if (this.draggedItem && this.dragOverItem) {
            const parent = this.draggedItem.parentNode;
            const items = Array.from(parent.children);
            const draggedIndex = items.indexOf(this.draggedItem);
            const overIndex = items.indexOf(this.dragOverItem);

            if (draggedIndex < overIndex) {
                parent.insertBefore(this.draggedItem, this.dragOverItem.nextSibling);
            } else {
                parent.insertBefore(this.draggedItem, this.dragOverItem);
            }

            this.saveOrder(parent);
            EventBus.emit('layout:reordered', { 
                from: draggedIndex, 
                to: overIndex 
            });
        }
    },

    onDragEnd(e) {
        if (this.draggedItem) {
            this.draggedItem.classList.remove('dragging');
        }
        if (this.dragOverItem) {
            this.dragOverItem.classList.remove('drag-over');
        }
        this.draggedItem = null;
        this.dragOverItem = null;
    },

    saveOrder(container) {
        const items = container.querySelectorAll('[data-draggable]');
        const order = Array.from(items).map(item => item.dataset.id);
        localStorage.setItem('eduequity_' + container.id + '_order', JSON.stringify(order));
    },

    loadOrder(container) {
        const saved = localStorage.getItem('eduequity_' + container.id + '_order');
        if (saved) {
            const order = JSON.parse(saved);
            const items = container.querySelectorAll('[data-draggable]');
            const itemMap = new Map();
            items.forEach(item => itemMap.set(item.dataset.id, item));
            
            order.forEach(id => {
                const item = itemMap.get(id);
                if (item) {
                    container.appendChild(item);
                    itemMap.delete(id);
                }
            });
            
            itemMap.forEach(item => container.appendChild(item));
        }
    },

    bindEvents() {
        EventBus.on('layout:setDensity', (density) => this.setDensity(density));
        EventBus.on('layout:setCardSize', (size) => this.setCardSize(size));
        EventBus.on('layout:toggleSidebar', () => this.toggleSidebar());
    }
};

window.LayoutManager = LayoutManager;
