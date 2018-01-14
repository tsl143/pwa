const cacheName = 'NG_TSL_API_PWA_4';
const filesToCache = [
    '/',
    '/index.html',
    '/bundle.js',
    '/logo.png',
    '/notify.png'
];

self.addEventListener('install', function(e) {
    console.info('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            caches.keys().then(function(keyList) {
                console.log(keyList)
            })
            console.info('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(key => {
                if (key.startsWith('NG_TSL') && key !== cacheName) {
                    console.info('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        }).catch(e => {
            console.log(e)
        })
    );
});

self.addEventListener('activate', function(e) {
    console.info('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            console.log(keyList)
            return Promise.all(keyList.map(key => {
                console.log(key)
                if (key !== cacheName) {
                    console.info('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(()=> {
            fetch(event.request);
        })
    );
});
