const CACHE_NAME = 'eduequity-v2';
const STATIC_CACHE = 'eduequity-static-v2';
const DYNAMIC_CACHE = 'eduequity-dynamic-v2';
const IMAGE_CACHE = 'eduequity-images-v2';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/core.js',
    '/js/components.js',
    '/js/app.js',
    '/manifest.json'
];

const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

function getCacheStrategy(url) {
    if (url.includes('/css/') || url.includes('/js/')) {
        return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
    }
    if (url.includes('/icons/') || url.includes('.png') || url.includes('.jpg') || url.includes('.svg')) {
        return CACHE_STRATEGIES.CACHE_FIRST;
    }
    if (url.includes('/api/')) {
        return CACHE_STRATEGIES.NETWORK_FIRST;
    }
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
}

async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        return new Response('离线状态，内容不可用', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) return cached;
        
        return new Response(JSON.stringify({ error: '离线状态', offline: true }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached);
    
    return cached || fetchPromise;
}

self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
            caches.open(DYNAMIC_CACHE),
            caches.open(IMAGE_CACHE)
        ]).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => !name.includes('v2'))
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    if (url.origin !== location.origin) return;
    if (request.method !== 'GET') return;
    
    const strategy = getCacheStrategy(url.pathname);
    let cacheName = DYNAMIC_CACHE;
    
    if (url.pathname.includes('/css/') || url.pathname.includes('/js/')) {
        cacheName = STATIC_CACHE;
    } else if (url.pathname.includes('/icons/') || url.pathname.match(/\.(png|jpg|svg|webp)$/)) {
        cacheName = IMAGE_CACHE;
    }
    
    switch (strategy) {
        case CACHE_STRATEGIES.CACHE_FIRST:
            event.respondWith(cacheFirst(request, cacheName));
            break;
        case CACHE_STRATEGIES.NETWORK_FIRST:
            event.respondWith(networkFirst(request, cacheName));
            break;
        default:
            event.respondWith(staleWhileRevalidate(request, cacheName));
    }
});

self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE).then(cache => cache.addAll(event.data.urls))
        );
    }
    
    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))))
        );
    }
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-posts') {
        event.waitUntil(syncPosts());
    }
    
    if (event.tag === 'sync-favorites') {
        event.waitUntil(syncFavorites());
    }
});

async function syncPosts() {
    console.log('Background sync: posts');
}

async function syncFavorites() {
    console.log('Background sync: favorites');
}

self.addEventListener('push', event => {
    const data = event.data?.json() || {};
    
    const options = {
        body: data.body || '您有新的消息',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        },
        actions: [
            { action: 'open', title: '查看' },
            { action: 'close', title: '关闭' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || '教育平权社区', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
