// ── Navbar: clase scrolled al bajar
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// ── Navbar: toggle mobile
document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
});

// ── Cerrar menu mobile al hacer click en un link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
    });
});

// ── Widget de Fecha, Hora y Clima (Open-Meteo)
function initNavWidget() {
    const timeEl = document.getElementById('navTime');
    const dateEl = document.getElementById('navDate');
    const tempEl = document.getElementById('navTemp');
    const iconEl = document.getElementById('navWeatherIcon');
    const textEl = document.getElementById('navWeatherText');

    // 1. Reloj en tiempo real
    function updateClock() {
    const now = new Date();
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
    setInterval(updateClock, 1000);
    updateClock();

    // 2. Fetch de clima a Open-Meteo
    function fetchWeather(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data && data.current_weather) {
    const temp = Math.round(data.current_weather.temperature);
    const code = data.current_weather.weathercode;
    if (tempEl) tempEl.textContent = `${temp}°C`;
    if (iconEl) iconEl.className = getWeatherIcon(code);
    if (textEl) textEl.textContent = getWeatherText(code);
}
            })
            .catch(err => {
                console.warn('No se pudo cargar el clima:', err);
                if (iconEl) iconEl.className = 'fas fa-cloud-moon';
            });
    }

    // 3. Iconos según código WMO
    function getWeatherText(code) {
    if (code === 0) return 'Soleado';
    if (code >= 1 && code <= 3) return 'Nublado';
    if (code === 45 || code === 48) return 'Niebla';
    if (code >= 51 && code <= 67) return 'Lloviendo';
    if (code >= 71 && code <= 82) return 'Nevando';
    if (code >= 95) return 'Tormenta';
    return 'Despejado';
}

    // 4. Ubicación del usuario o Fallback silencioso a coordenadas predeterminadas
    const fallbackLat = 10.1693;
    const fallbackLon = -67.5614;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                // Si el usuario rechaza la ubicación, mostramos las coordenadas por defecto sin dar error.
                fetchWeather(fallbackLat, fallbackLon);
            },
            { timeout: 5000 }
        );
    } else {
        fetchWeather(fallbackLat, fallbackLon);
    }
}
// Inicializar widget
initNavWidget();


// ── YouTube API (Asegurado por dominio)
const YT_API_KEY   = 'AIzaSyAp9QRBNfxQcq3ldn-NMzzeKxJzDpWsvzs';
const YT_CHANNEL_ID = 'UCAHqT9NOnooeGQO6xVCuf3g';

async function cargarUltimoVideo() {
    const wrapper = document.getElementById('videoWrapper');
    if (!wrapper) return;

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${YT_CHANNEL_ID}&part=snippet&order=date&type=video&maxResults=1`;
        const res  = await fetch(url);
        const data = await res.json();

        if (data.error) return;

        const video = data.items?.[0];
        if (!video) return;

        const videoId = video.id.videoId;
        const iframe = wrapper.querySelector('iframe');
        if (iframe) {
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
        }
    } catch (err) {
        console.warn('No se pudo cargar el último video', err);
    }
}

cargarUltimoVideo();

// ── YouTube Widget: Minimizar/Maximizar
const ytToggleBtn = document.getElementById('ytToggleBtn');
const ytWidget = document.getElementById('ytWidget');

if (ytToggleBtn && ytWidget) {
    ytToggleBtn.addEventListener('click', () => {
        ytWidget.classList.toggle('minimized');
    });
}
