const CACHE_NAME = 'neon-dash-v3';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './coin.wav',
  './hit.wav'
];

// Instalar el Service Worker y guardar TODO en caché (incluyendo audios)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos y audios guardados en caché');
        return cache.addAll(assets);
      })
  );
});

// Responder desde el caché
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Limpiar cachés antiguos (opcional pero recomendado)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});
