const CACHE_NAME = 'neon-dash-v4'; // Subimos versión
const assets = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './coin.wav', 
  './hit.wav'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Usamos un bucle para añadir archivos y ver si alguno falla
      return Promise.all(
        assets.map(url => {
          return cache.add(url).catch(err => console.error('Error cacheando:', url, err));
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si el archivo está en caché, lo devuelve; si no, va a internet
      return response || fetch(event.request);
    })
  );
});

// Limpieza de caché viejo para forzar actualización
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
