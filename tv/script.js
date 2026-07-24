// Lista de canales
const PROXY_URL = 'https://pizza-proxy.adibabouakar.workers.dev/?url=';

const channels = [
    { id: 'venevision', name: 'Venevision', url: 'https://venevision-blocked-cdn.encoders.immergo.tv/3/streamPlaylist.m3u8' },
    { id: 'canali', name: 'Canal I', url: 'https://streaming.canal-i.com/canal-i/live/primary/1080.m3u8', audioUrl: 'https://streaming.canal-i.com/canal-i/live/primary/audio.m3u8' },
    { id: 'valetv', name: 'Vale TV', url: 'https://59d39900ebfb8.streamlock.net/valetv_480/valetv_480/chunklist_w73698158.m3u8' },
    { id: 'un24', name: 'UN24', url: 'https://59d39900ebfb8.streamlock.net/untv-720/untv-720/chunklist_w285532314.m3u8' },
    { id: 'tvs', name: 'TVS Maracay', url: 'https://vcp10.myplaytv.com/tvs/tvs/chunklist_w188594279.m3u8' },
    { id: 'trv', name: 'TRV Maracay', url: 'https://streaming5.globalhostla.com/rtplive/trvnetve/chunklist_w1585023675.m3u8' },
    { id: 'latinanoticias', name: 'Latina Noticias', url: 'https://redirector.rudo.video/hls-video/567ffde3fa319fadf3419efda25619456231dfea/latinanoticias/latinanoticias.smil/playlist.m3u8?did=r1us539206592f9464dfc502f675a1611d0374450d96c&ndvc=0' },
    { id: 'promartv', name: 'Promar TV', url: 'https://vcp.myplaytv.com/promar/promar/chunklist_w998280401.m3u8' },
    { id: 'cerotactica', name: 'Cero Táctica', url: 'https://vod2live.univtec.com/manifest/c9db01e8-4ea2-48a3-8745-831b6540cdfb/5160000.m3u8' },
    { id: 'veplus', name: 'Venevision Plus', url: 'https://veplus-ioriver-cdn.encoders.immergo.tv/master.m3u8' },
    { id: 'showven', name: 'ShowVen', url: 'http://vcp1.myplaytv.com/coll/coll/playlist.m3u8' },
    { id: 'telesur', name: 'TeleSur', url: 'https://mblesmain01.telesur.ultrabase.net/mbliveMain/480p/chunklist.m3u8' },
    { id: 'canalonce', name: 'Canal 11 del Zulia', url: 'https://tv.streamcasthd.com:3676/live/canal11delzulialive.m3u8' },
    { id: 'tvo', name: 'Televisora del Oriente', url: 'https://cloud.fastchannel.es/manifiest/hls/prog9/tvo.m3u8' },
    { id: 'ctv', name: 'Catatumbo TV', url: 'https://cloud.fastchannel.es/manifiest/hls/prog9/catatumbotv.m3u8' },
    { id: 'bta', name: 'BTA TV', url: 'https://cloud.fastchannel.es/manifiest/hls/prog9/btatv.m3u8' },
    { id: 'vepacotv', name: 'Vepaco TV', url: 'https://cloud.fastchannel.es/manifiest/hls/prog9/vepacotv.m3u8' },
    { id: 'sportsmaxnews', name: 'Sportsmax News', url: 'https://cdnlive.klicgo.net/sportsmaxnews/live/chunklist_w419857861_DVR.m3u8' },
    { id: 'hrmax', name: 'HR Max', url: 'https://cdnlive.klicgo.net/hrmax/live/chunklist_w713107667.m3u8' },
    { id: 'esportsmax', name: 'Esports Max', url: 'https://cdnlive.klicgo.net/esportsmax/live/chunklist_w1598557418_DVR.m3u8' },
    { id: 'maxanime', name: 'Max Anime', url: 'https://cdnlive.klicgo.net/maxanime/live/chunklist_w1287894767_DVR.m3u8' },
    { id: 'rcnnovelas', name: 'RCN Novelas', url: 'https://cdnlive.klicgo.net/rcnnovelas/live/chunklist_w1582423562.m3u8' },
    { id: 'mmc', name: 'Mix Music Channel', url: 'https://cdamix.streaming.ws/mixmusic/live/chunklist_w2048390545.m3u8' }
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
const qualitySelector = document.getElementById('quality-selector'); // Referencia al nuevo botón

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
        
        // Lógica de carga y extracción de calidades
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            tvPlayer.play();
            
            // Limpiar las opciones anteriores
            qualitySelector.innerHTML = '<option value="-1">Automático</option>';
            
            const levels = data.levels;
            
            // Si hay más de una calidad disponible, armamos el menú
            if (levels && levels.length > 1) {
                levels.forEach((level, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.text = level.height + 'p'; 
                    qualitySelector.appendChild(option);
                });
                qualitySelector.style.display = 'inline-block';
            } else {
                // Si solo hay una calidad, ocultamos el botón
                qualitySelector.style.display = 'none';
            }
        });

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
    qualitySelector.style.display = 'none'; // Ocultar el selector al salir
    
    if (hlsInstance) hlsInstance.destroy();
    if (hlsAudioInstance) hlsAudioInstance.destroy();
};

// Evento para cambiar la calidad cuando el usuario selecciona una opción
qualitySelector.addEventListener('change', (e) => {
    if (hlsInstance) {
        hlsInstance.currentLevel = parseInt(e.target.value);
    }
});

searchBar.addEventListener('input', (e) => renderChannels(e.target.value));
renderChannels();
