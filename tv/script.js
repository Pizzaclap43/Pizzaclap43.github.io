// Lista de canales
const PROXY_URL = 'https://pizza-proxy.adibabouakar.workers.dev/?url=';

const channels = [
    { id: 'venevision', name: 'Venevision', url: 'https://venevision-blocked-cdn.encoders.immergo.tv/3/streamPlaylist.m3u8' },
    { id: 'canali', name: 'Canal I', url: 'https://streaming.canal-i.com/canal-i/live/primary/1080.m3u8', audioUrl: 'https://streaming.canal-i.com/canal-i/live/primary/audio.m3u8' },
    { id: 'tvs', name: 'TVS Maracay', url: 'https://vcp10.myplaytv.com/tvs/tvs/chunklist_w188594279.m3u8' },
    { id: 'trv', name: 'TRV Maracay', url: 'https://streaming5.globalhostla.com/rtplive/trvnetve/chunklist_w1585023675.m3u8' },
    { id: 'latinanoticias', name: 'Latina Noticias', url: 'https://redirector.rudo.video/hls-video/567ffde3fa319fadf3419efda25619456231dfea/latinanoticias/latinanoticias.smil/playlist.m3u8?did=r1us539206592f9464dfc502f675a1611d0374450d96c&ndvc=0' },
    { id: 'promartv', name: 'Promar TV', url: 'https://vcp.myplaytv.com/promar/promar/chunklist_w998280401.m3u8' },
    { id: 'cerotactica', name: 'Cero Táctica', url: 'https://vod2live.univtec.com/manifest/c9db01e8-4ea2-48a3-8745-831b6540cdfb/5160000.m3u8' },
    { id: 'veplus', name: 'Venevision Plus', url: 'https://veplus-ioriver-cdn.encoders.immergo.tv/master.m3u8' },
    { id: 'showven', name: 'ShowVen', url: 'http://vcp1.myplaytv.com/coll/coll/playlist.m3u8' },
    { id: 'vtv', name: 'Venezolana de Television', url: 'https://live.eu-north-1b.cf.dmcdn.net/sec2(ccM8wEFvouBrwjAr76qq8DCAJUUEDG4tmjgNab5JrPx8jbawGMvj9x-WhS4cuWLIAzAFaIbPoyHFtzsOZJKWjwr3Q4h_nXL3-O9M8aZ_7jTfdU7W3LPA3kuj7FNGNzdJ)/dm/3/x930kre/d/live-720@60.m3u8#cell=lcf-eu-north-1b' },
    { id: 'mtv', name: 'Meridiano TV', url: 'https://live.eu-north-1a.cf.dmcdn.net/sec2(N9ZhMiQgDuJWEkjiBuWCrDFnb8jz1jqh2XR4Hs_DA9mCGr-S8xXAioyPpwfk1NctRIxPym5wEkkYbIVvAMpurW2RRQClpvbsEN6-S9IbV8drFJsphdqfI_c2iJmNIKKc)/dm/3/x9sxu9y/s/live-720.m3u8#cell=lcf-eu-north-1a' },
    { id: 'tlt', name: 'La Tele Tuya', url: 'https://live2.eu-north-1a.cf.dmcdn.net/sec2(UWxBy0Oqus5VmgZnw97hh9PnFK1Nc72mcdY5Z2Sk_al6s1-EUG423x_8q5KWvBBpyHAIvu6IvQ6Xl4snfr8EBpYDl9hmdVHEoASyQdCqGFpjZoGLEb3a1dnAe8oXUibJ)/cloud/3/x8z1lwk/s/live-1080@60.m3u8#cell=lcf2-eu-north-1a' },
    { id: 'globovision', name: 'Globovision', url: 'https://live.eu-north-1b.cf.dmcdn.net/sec2(yBpetJ140O2VbBBsz_J968QjJ6jDDO_ablvDVRRevhvFM3UPxKSJDkfO3sAhPgPJmRPNRETG3lTPyqqS44Ar3zvUkXMfb8BSN_pGzdEamewvo4LAvD1mq1Ckyk3NQRtx)/dm/3/xio7e2/s/live-1080@60.m3u8?startdate=2026-06-30T03%3A15%3A46%2B0000#cell=lcf-eu-north-1b' }
];

let favorites = JSON.parse(localStorage.getItem('pizzatv_favs')) || [];
let hlsInstance;
let hlsAudioInstance; 
const tvAudio = new Audio(); 

// Bandera para saber si el canal actual requiere sincronización de audio
let hasSeparateAudio = false;

const mainView = document.getElementById('main-view');
const playerView = document.getElementById('player-view');
const channelsGrid = document.getElementById('channels-grid');
const favoritesGrid = document.getElementById('favorites-grid');
const favoritesSection = document.getElementById('favorites-section');
const searchBar = document.getElementById('search-bar');
const tvPlayer = document.getElementById('tv-player');
const nowPlaying = document.getElementById('now-playing');
const backBtn = document.getElementById('back-btn');

// --- MOTOR DE SINCRONIZACIÓN ULTRA-PRECISO ---
tvPlayer.addEventListener('play', () => { if (hasSeparateAudio) tvAudio.play().catch(() => {}); });
tvPlayer.addEventListener('pause', () => { if (hasSeparateAudio) tvAudio.pause(); });
tvPlayer.addEventListener('volumechange', () => {
    tvAudio.volume = tvPlayer.volume;
    tvAudio.muted = tvPlayer.muted;
});

// Control de carga (Buffer): Si el video se congela, congelamos el audio
tvPlayer.addEventListener('waiting', () => { if (hasSeparateAudio) tvAudio.pause(); });
tvPlayer.addEventListener('playing', () => { 
    if (hasSeparateAudio && !tvPlayer.paused) {
        tvAudio.currentTime = tvPlayer.currentTime;
        tvAudio.play().catch(() => {});
    } 
});

// Monitoreo constante del tiempo de reproducción
tvPlayer.addEventListener('timeupdate', () => {
    if (hasSeparateAudio && tvAudio.readyState >= 2) {
        const diferencia = tvPlayer.currentTime - tvAudio.currentTime;
        // Si el desfase es mayor a 0.2 segundos (200ms), forzar reajuste inmediato
        if (Math.abs(diferencia) > 0.2) {
            tvAudio.currentTime = tvPlayer.currentTime;
        }
    }
});


function renderChannels(filterText = '') {
    channelsGrid.innerHTML = '';
    favoritesGrid.innerHTML = '';
    let hasFavs = false;

    channels.forEach(channel => {
        if (channel.name.toLowerCase().includes(filterText.toLowerCase())) {
            const isFav = favorites.includes(channel.id);
            const cardHTML = `
                <div class="channel-card">
                    <div class="channel-name" onclick="playChannel('${channel.id}')">${channel.name}</div>
                    <button class="fav-btn" onclick="toggleFavorite('${channel.id}', event)">${isFav ? '★' : '☆'}</button>
                </div>
            `;
            if (isFav && filterText === '') {
                hasFavs = true;
                favoritesGrid.insertAdjacentHTML('beforeend', cardHTML);
            }
            channelsGrid.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
    favoritesSection.style.display = (hasFavs && filterText === '') ? 'block' : 'none';
}

window.toggleFavorite = function(id, event) {
    event.stopPropagation();
    favorites = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    localStorage.setItem('pizzatv_favs', JSON.stringify(favorites));
    renderChannels(searchBar.value);
};

window.playChannel = function(id) {
    const channel = channels.find(c => c.id === id);
    mainView.style.display = 'none';
    playerView.style.display = 'flex';
    nowPlaying.innerText = `📺 ${channel.name}`;

    // AHORA SÍ: Usamos el proxy para cualquier enlace HTTP y para servidores de Dailymotion (dmcdn.net)
    const finalUrl = (channel.url.includes('dmcdn.net') || channel.url.startsWith('http://')) ? PROXY_URL + encodeURIComponent(channel.url) : channel.url;

    // Resetear estados de audio anteriores
    tvAudio.pause();
    tvAudio.src = '';
    if (hlsAudioInstance) hlsAudioInstance.destroy();
    
    // Activar o desactivar el motor de sincronización según el canal elegido
    hasSeparateAudio = !!channel.audioUrl;

    if (Hls.isSupported()) {
        if (hlsInstance) hlsInstance.destroy();
        
        // Cargar Video principal
        hlsInstance = new Hls();
        hlsInstance.loadSource(finalUrl);
        hlsInstance.attachMedia(tvPlayer);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => tvPlayer.play());

        // Cargar Audio secundario si existe
        if (hasSeparateAudio) {
            hlsAudioInstance = new Hls();
            hlsAudioInstance.loadSource(channel.audioUrl);
            hlsAudioInstance.attachMedia(tvAudio);
            hlsAudioInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                // Sincronizar volumen inicial y reproducir
                tvAudio.volume = tvPlayer.volume;
                tvAudio.muted = tvPlayer.muted;
                tvAudio.play().catch(() => {});
            });
        }

    } else if (tvPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Soporte nativo (Safari / Móviles)
        tvPlayer.src = finalUrl;
        tvPlayer.addEventListener('loadedmetadata', () => tvPlayer.play());
        
        if (hasSeparateAudio) {
            tvAudio.src = channel.audioUrl;
            tvAudio.addEventListener('loadedmetadata', () => {
                tvAudio.volume = tvPlayer.volume;
                tvAudio.muted = tvPlayer.muted;
                tvAudio.play().catch(() => {});
            });
        }
    }
};

backBtn.onclick = () => {
    playerView.style.display = 'none';
    mainView.style.display = 'block';
    
    tvPlayer.pause();
    tvAudio.pause();
    hasSeparateAudio = false;
    
    if (hlsInstance) hlsInstance.destroy();
    if (hlsAudioInstance) hlsAudioInstance.destroy();
};

searchBar.addEventListener('input', (e) => renderChannels(e.target.value));
renderChannels();
