// =============================================================
//  SERVICE WORKER - Learning Journey v3
//  للعمل بدون إنترنت
// =============================================================

const CACHE_NAME = 'learning-journey-v3.1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './sync.js',
    './features.js',   // ✨ جديد
    './features.css' ,   // ✨ جديد
    './features2.js',    // ✨ جديد
    './features2.css'

];

// Install: Cache all assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app assets...');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate: Clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// Fetch: Network first, fallback to cache
self.addEventListener('fetch', event => {
    // لا تتدخل في طلبات GitHub API
    if (event.request.url.includes('api.github.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // نسخ الاستجابة في الكاش
                if (response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            })
            .catch(() => {
                // لا إنترنت - استخدم الكاش
                return caches.match(event.request).then(cached => {
                    return cached || new Response('Offline', { status: 503 });
                });
            })
    );
});
