var staticCacheName = "reward-status-v" + new Date().getTime();
var filesToCache = [
    '/offline.html',
    '/icons/apple-icon-180.png',
    '/icons/apple-splash-2048-2732.jpg',
    '/icons/apple-splash-1668-2388.jpg',
    '/icons/apple-splash-1536-2048.jpg',
    '/icons/apple-splash-1668-2224.jpg',
    '/icons/apple-splash-1620-2160.jpg',
    '/icons/apple-splash-1284-2778.jpg',
    '/icons/apple-splash-1170-2532.jpg',
    '/icons/apple-splash-1125-2436.jpg',
    '/icons/apple-splash-1242-2688.jpg',
    '/icons/apple-splash-828-1792.jpg',
    '/icons/apple-splash-1242-2208.jpg',
    '/icons/apple-splash-750-1334.jpg',
    '/icons/apple-splash-640-1136.jpg'
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("reward-status-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});


// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('/offline.html');
            })
    )
});