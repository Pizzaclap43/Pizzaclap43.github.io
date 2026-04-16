const CACHE_NAME = 'neon-dash-v2';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png'
  './coin.wav'
  './hit.wav'
];

// Instalar el Service Worker y guardar los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos guardados en caché');
        return cache.addAll(assets);
      })
  );
});

// Responder con los archivos del caché cuando no hay conexión
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
