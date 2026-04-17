const CACHE_NAME = 'neon-dash-v10';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './coin.wav', 
  './hit.wav'
];

// Instalación forzada
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Usamos addAll que es más estricto para asegurar que TODO se guarde
      return cache.addAll(assets);
    })
  );
});

// Activación y limpieza de versiones fallidas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Estrategia: Primero Caché, si no hay, busca en Red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      // Esto evita que el juego se ralentice si falla la red
      return new Response('', { status: 404, statusText: 'Offline' });
    })
  );
});
