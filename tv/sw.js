const CACHE_NAME = 'pizzatv-v4'; 
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './tv.png',
    './manifest.json'
];

// 1. Instalar el Service Worker y guardar archivos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
    // Fuerza a este nuevo Service Worker a activarse de inmediato
    self.skipWaiting(); 
});

// 2. Activar y BORRAR las cachés viejas automáticamente
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
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

// 3. Interceptar peticiones
self.addEventListener('fetch', event => {
    // Ignorar streams (.m3u8, .ts) y cualquier dominio externo (como el proxy o los servidores de TV)
    if (event.request.url.includes('.m3u8') || 
        event.request.url.includes('.ts') || 
        !event.request.url.startsWith(self.location.origin)) { 
        return; 
    }

    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request);
        })
    );
});
