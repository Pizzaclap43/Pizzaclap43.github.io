const CACHE_NAME = 'neon-dash-v27'; // Subimos a v27
const assets = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './coin.wav', 
  './hit.wav',
  './death.wav'
];

// Instalación: Limpia la caché vieja inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza al SW nuevo a activarse sin esperar
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Activación: Borra CUALQUIER caché que no sea la v27
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de las pestañas abiertas
  );
});

// ESTRATEGIA: NETWORK FIRST (Prioriza la red sobre la caché)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la red funciona, actualizamos la caché con lo nuevo
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Si falla la red (offline), usamos la caché
        return caches.match(event.request);
      })
  );
});
