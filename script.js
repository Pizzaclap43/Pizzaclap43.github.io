// ── Splash: bloquear scroll mientras carga
document.body.style.overflow = 'hidden';
setTimeout(() => { document.body.style.overflow = ''; }, 3400);

// ── Navbar: clase scrolled al bajar
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// ── Navbar: toggle mobile
document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
});

// ── Cerrar menu mobile al hacer click en un link
document.querySelectorAll('.nav-link:not(.nav-soon)').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
    });
});

// ── YouTube: cargar último video automáticamente
const YT_API_KEY   = 'AIzaSyAp9QRBNfxQcq3ldn-NMzzeKxJzDpWsvzs';
const YT_CHANNEL_ID = 'UCAHqT9NOnooeGQO6xVCuf3g';

async function cargarUltimoVideo() {
    const wrapper = document.getElementById('videoWrapper');
    if (!wrapper) return;

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${YT_CHANNEL_ID}&part=snippet&order=date&type=video&maxResults=1`;
        const res  = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.warn('YouTube API error:', data.error.message);
            return;
        }

        const video = data.items?.[0];
        if (!video) return;

        const videoId    = video.id.videoId;
        const iframe     = wrapper.querySelector('iframe');
        if (iframe) {
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
        }

    } catch (err) {
        console.warn('No se pudo cargar el último video:', err);
    }
}

cargarUltimoVideo();
