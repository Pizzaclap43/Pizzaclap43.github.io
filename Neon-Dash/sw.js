const CACHE_NAME = 'neon-dash-v5'; // Subimos a v4
const assets = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './coin.wav', 
  './hit.wav'
];

self.addEventListener('install', event => {
  // Fuerza al Service Worker nuevo a tomar el control de inmediato
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        assets.map(url => {
          return cache.add(url).catch(err => console.error('Error cacheando:', url, err));
        })
      );
    })
  );
});

self.addEventListener('activate', event => {
  // Borra los cachés viejos (v1, v2, v3) automáticamente
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
