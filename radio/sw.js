const CACHE_NAME = 'radio-pizza-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './radio.png'
];

// Instalar el Service Worker y guardar los archivos básicos en caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
    // Ignorar las peticiones al clima y a las emisoras de radio (no queremos cachear el audio en vivo)
    if (event.request.url.includes('stream') || event.request.url.includes('api.open-meteo') || event.request.url.includes('zeno.fm') || event.request.url.includes('lorini.net')) {
        return; 
    }

    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Devuelve la versión en caché si existe, si no, la descarga de internet
            return response || fetch(event.request);
        })
    );
});
