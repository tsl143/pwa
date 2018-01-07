const dataCacheName = 'NG_TSL_API_DATA_4';
const cacheName = 'NG_TSL_API_PWA_4';
const filesToCache = [
  '/pwa/',
  '/pwa/index.html',
  '/pwa/bundle.js'
];

self.addEventListener('install', function(e) {
  console.info('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.info('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.info('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.info('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});
/*
self.addEventListener('fetch', function(e) {
  console.info('[Service Worker] Fetch', e.request.url);
  const dataUrl = 'https://temp.neargroup.me/ng/myNotification';
  if (e.request.url.indexOf(dataUrl) > -1 || e.request.url.includes('img.neargroup.me')) {
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});*/