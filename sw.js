const CACHE_NAME = 'arek-v8';
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
    // Natychmiast przejdź do aktywacji bez czekania
    self.skipWaiting();
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
    // Przejmij kontrolę nad wszystkimi otwartymi kartami
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Strategia "network first" dla HTML (index.html), "cache first" dla assets
    const isHtmlRequest = e.request.destination === 'document' || e.request.url.includes('.html');
    
    if (isHtmlRequest) {
        // HTML: spróbuj sieci najpierw, fallback do cache
        e.respondWith(
            fetch(e.request).catch(() => caches.match(e.request))
        );
    } else {
        // Assets (JS, CSS, images): cache first, fallback do sieci
        e.respondWith(
            caches.match(e.request).then((response) => response || fetch(e.request))
        );
    }
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});