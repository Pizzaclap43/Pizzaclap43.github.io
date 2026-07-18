// Cambiado a v3 para forzar la actualización definitiva
const CACHE_NAME = 'radio-pizza-v19'; 
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './radio.png'
];

// 1. Instalar el Service Worker y guardar archivos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
    // ¡CLAVE 1! Fuerza a este nuevo Service Worker a activarse de inmediato
    self.skipWaiting(); 
});

// 2. Activar y BORRAR las cachés viejas automáticamente
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Si encuentra la caché v2 o v1, las elimina de la memoria
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Toma el control de la aplicación de inmediato sin esperar a recargar
    self.clients.claim(); 
});

// 3. Interceptar peticiones (Ignorando streaming en vivo)
self.addEventListener('fetch', event => {
    if (event.request.url.includes('stream') || 
        event.request.url.includes('api.open-meteo') || 
        event.request.url.includes('zeno.fm') || 
        event.request.url.includes('lorini.net') ||
        event.request.url.includes('surfernetwork.com') || // Agregada por tus nuevas emisoras
        event.request.url.includes('globalhostla.com')) {  // Agregada por tus nuevas emisoras
        return; 
    }

    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request);
        })
    );
});
