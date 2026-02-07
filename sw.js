const CACHE_NAME = 'arek-v7';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    'https://ziggy83pl.github.io/zasoby/portfolio-logos.js',
    'https://ziggy83pl.github.io/zasoby/magnifier.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// Aktywacja: usuwanie starych cache
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});