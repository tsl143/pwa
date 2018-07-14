const cacheName = 'NG_SD_API_PWA_2_8';
const filesToCache = [
    '/',
    '/index.html',
    '/bundle.js',
    '/logo.png',
    '/notify.png',
    '/avtar.svg',
    'noFriends.svg',
    'https://www.gstatic.com/firebasejs/4.8.1/firebase.js',
    'https://cdn.firebase.com/js/client/2.4.0/firebase.js'
];

self.addEventListener('install', function(e) {
    console.info('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            cache.addAll(filesToCache).then(()=>{
                return self.clients.claim();
            });
        })
    );
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(key => {
                if (key.startsWith('NG_SD') && key !== cacheName) {
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
            return Promise.all(keyList.map(key => {
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
  console.info('[ServiceWorker] Fetch', event.request.cache, event.request.mode);
  // if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    event.respondWith(
      caches.open(cacheName).then(function (cache) {
        console.log("cache when fetch: ", cache, cacheName, );
        return caches.match(event.request).then(response => {
          console.log("response for ", event.request, response)
          return response || fetch(event.request.clone());
        }).catch(e => {
            console.log("service-woeker fetch ERROR= ", e)
        })
      })
    );
  // }
});
