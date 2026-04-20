const CACHE_NAME = 'neon-dash-v13';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './coin.wav', 
  './hit.wav',
  './death.wav'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', event => {
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
    }).catch(() => {
      return new Response('', { status: 404, statusText: 'Offline' });
    })
  );
});
