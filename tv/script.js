// --- INYECCIÓN DE API DE YOUTUBE (Requerida para motor Pseudo-Live) ---
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
if (firstScriptTag) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
    document.head.appendChild(tag);
}

// Lista de canales
const PROXY_URL = 'https://pizza-proxy.adibabouakar.workers.dev/?url=';

const channels = [
    // Canal simulado con sincronización por reloj (isYtSync: true)
    { id: 'pizzatv', name: '🍕 Pizza TV 24/7', ytPlaylist: 'PL-jhD1_bQZq3BevkaUfRd-U9HpQCf0Il2', isYtSync: true },
    
    { id: 'venevision', name: 'Venevision', url: 'https://venevision-blocked-cdn.encoders.immergo.tv/3/streamPlaylist.m3u8' },
    { id: 'canali', name: 'Canal I', url: 'https://streaming.canal-i.com/canal-i/live/primary/1080.m3u8', audioUrl: 'https://streaming.canal-i.com/canal-i/live/primary/audio.m3u8' },
    { id: 'vtv', name: 'VTV', url: 'https://geo.dailymotion.com/player.html?video=x930kre', isIframe: true },
    { id: 'meridiano', name: 'Meridiano TV', url: 'https://geo.dailymotion.com/player.html?video=x9sxu9y', isIframe: true },
    { id: 'globovision', name: 'Globovision', url: 'https://geo.dailymotion.com/player.html?video=xio7e2', isIframe: true },
    { id: 'tlt', name: 'La Tele Tuya', url: 'https://geo.dailymotion.com/player.html?video=x8z1lwk', isIframe: true },
    { id: 'tves', name: 'Tves', url: 'https://ok.ru/videoembed/14909080673812?nochat=1', isIframe: true },
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
    { id: 'mmc', name: 'Mix Music Channel', url: 'https://cdamix.streaming.ws/mixmusic/live/chunklist_w2048390545.m3u8' },
    { id: 'trt', name: 'TRT', url: 'https://vcp12.myplaytv.com/trt/trt/chunklist_w648801039.m3u8' },
    { id: 'aguacatetv', name: 'Aguacate TV', url: 'https://streamtv.intervenhosting.net:3040/live/aguacatetvbqtolive.m3u8' },
    { id: 'canal21', name: 'Canal 21 del Tachira', url: 'https://stmv2.voxtvhd.com.br/canal21/canal21/playlist.m3u8?hls_ctx=5945901l' },
    { id: 'canalc', name: 'Canal C del Zulia', url: 'https://calm-forest-3478.cristianbracho904.workers.dev/hls/index.m3u8' },
    { id: 'cdiplomatico', name: 'Canal Diplomatico', url: 'https://master.myplaytv.com:2020/hls/canaldiplomatico/canaldiplomatico.m3u8' },
    { id: 'grandetv', name: 'Grande TV', url: 'https://vs20.live.opencaster.com/grande41_0b593479/index.m3u8' },
    { id: 'islatv', name: 'Isla TV', url: 'https://59d39900ebfb8.streamlock.net/islatv/islatv/chunklist_w951701356.m3u8' },
    { id: 'latinatv', name: 'Latina TV', url: 'https://streamtv.latinamedios.com:3413/live/latinatvlive.m3u8' },
    { id: 'maximatv', name: 'Maxima TV', url: 'https://maximatv.net/hls/stream.m3u8' },
    { id: 'ploustv', name: 'Plous TV', url: 'https://vcp.myplaytv.com/glowtv/glowtv/chunklist_w1670091102.m3u8' },
    { id: 'reformatv', name: 'Reforma TV', url: 'https://5bf8041cb3fed.streamlock.net/ReformaTV/ReformaTV/playlist.m3u8' },
    { id: 'siembratv', name: 'Siembra TV', url: 'https://cloud2.streaminglivehd.com:1936/siembratv/siembratv/chunklist_w2003597858.m3u8' },
    { id: 'somostv', name: 'Somos TV', url: 'https://vcp3.myplaytv.com/somostv/somostv/chunklist_w1296929545.m3u8' },
    { id: 'tutv', name: 'Tu TV', url: 'https://astl-mainstr.qvixsolutions.com/asltvtu_ext/tracks-v1a1/mono.ts.m3u8' },
    { id: 'tvm', name: 'TVM+', url: 'https://streamtv.intervenhosting.net:3529/live/tvmparatilive.m3u8' },
    { id: 'watavision', name: 'Wata Vision', url: 'https://live20.bozztv.com/giatv/giatv-watavision/watavision/chunks.m3u8' }
];

let favorites = JSON.parse(localStorage.getItem('pizzatv_favs')) || [];
let hlsInstance;
let hlsAudioInstance; 
const tvAudio = new Audio(); 
let ytPlayer = null; // Variable global para manejar el reproductor de YouTube

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
const qualitySelector = document.getElementById('quality-selector'); 

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

    // Resetear estados de audio/video anteriores
    tvPlayer.pause();
    tvAudio.pause();
    tvAudio.src = '';
    if (hlsInstance) hlsInstance.destroy();
    if (hlsAudioInstance) hlsAudioInstance.destroy();

    // 1. Limpiar cualquier iframe y reproductor YT anterior
    let oldIframe = document.getElementById('dm-iframe');
    if (oldIframe) oldIframe.remove();
    
    if (ytPlayer) {
        ytPlayer.destroy();
        ytPlayer = null;
    }
    let oldYtContainer = document.getElementById('yt-sync-player');
    if (oldYtContainer) oldYtContainer.remove();

    // 2. Lógica para Canal Simulado 24/7 (Sincronización Pseudo-Live Mundial UTC)
    if (channel.isYtSync) {
        tvPlayer.style.display = 'none'; 
        qualitySelector.style.display = 'none';
        hasSeparateAudio = false;

        const ytContainer = document.createElement('div');
        ytContainer.id = 'yt-sync-player';
        ytContainer.style.width = '100%';
        ytContainer.style.height = '100%';
        document.querySelector('.video-container').appendChild(ytContainer);

        const checkYTAndInit = () => {
            if (typeof YT !== 'undefined' && YT.Player) {
                let isSynced = false;
                ytPlayer = new YT.Player('yt-sync-player', {
                    playerVars: { 
                        autoplay: 1, 
                        controls: 1, 
                        disablekb: 1, 
                        rel: 0 
                    },
                    events: {
                        'onReady': (event) => {
                            event.target.loadPlaylist({ list: channel.ytPlaylist });
                        },
                        'onStateChange': (event) => {
                            // Cuando comienza a reproducir (Estado 1)
                            if (event.data === 1 && !isSynced) {
                                isSynced = true;
                                const playlist = event.target.getPlaylist();
                                if (playlist && playlist.length > 0) {
                                    const now = new Date();
                                    
                                    // Sincronización global usando UTC (Tiempo Universal Coordinado)
                                    const totalMinutes = (now.getUTCHours() * 60) + now.getUTCMinutes();
                                    
                                    // Índice matemático: saltamos a un video específico basado en la hora mundial
                                    const index = totalMinutes % playlist.length;
                                    
                                    // Sincronización de segundos basada en la hora mundial
                                    const startSeconds = ((now.getUTCMinutes() % 10) * 60) + now.getUTCSeconds();
                                    
                                    event.target.playVideoAt(index);
                                    event.target.seekTo(startSeconds, true);
                                }
                            }
                        }
                    }
                });
            } else {
                // Si el internet es lento y la API de YouTube no ha cargado, lo reintenta
                setTimeout(checkYTAndInit, 300);
            }
        };
        checkYTAndInit();
        return; 
    }

    // 3. Lógica para canales insertados por Iframe nativo (Dailymotion u otros)
    else if (channel.isIframe) {
        tvPlayer.style.display = 'none';
        qualitySelector.style.display = 'none';
        hasSeparateAudio = false;

        const iframe = document.createElement('iframe');
        iframe.id = 'dm-iframe';
        iframe.src = channel.url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('allow', 'autoplay; encrypted-media; web-share; fullscreen; picture-in-picture');
        
        document.querySelector('.video-container').appendChild(iframe);
        return; 
    } 
    // Restauramos el reproductor nativo para los otros canales
    else {
        tvPlayer.style.display = ''; 
    }

    // 4. Lógica original para canales HLS (M3U8)
    const finalUrl = (channel.url.includes('dmcdn.net') || channel.url.startsWith('http://')) ? PROXY_URL + encodeURIComponent(channel.url) : channel.url;
    hasSeparateAudio = !!channel.audioUrl;

    if (Hls.isSupported()) {
        if (hlsInstance) hlsInstance.destroy();
        
        hlsInstance = new Hls();
        hlsInstance.loadSource(finalUrl);
        hlsInstance.attachMedia(tvPlayer);
        
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            tvPlayer.play();
            qualitySelector.innerHTML = '<option value="-1">Automático</option>';
            const levels = data.levels;
            
            if (levels && levels.length > 1) {
                levels.forEach((level, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.text = level.height + 'p'; 
                    qualitySelector.appendChild(option);
                });
                qualitySelector.style.display = 'inline-block';
            } else {
                qualitySelector.style.display = 'none';
            }
        });

        if (hasSeparateAudio) {
            hlsAudioInstance = new Hls();
            hlsAudioInstance.loadSource(channel.audioUrl);
            hlsAudioInstance.attachMedia(tvAudio);
            hlsAudioInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                tvAudio.volume = tvPlayer.volume;
                tvAudio.muted = tvPlayer.muted;
                tvAudio.play().catch(() => {});
            });
        }

    } else if (tvPlayer.canPlayType('application/vnd.apple.mpegurl')) {
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
    qualitySelector.style.display = 'none'; 
    
    if (hlsInstance) hlsInstance.destroy();
    if (hlsAudioInstance) hlsAudioInstance.destroy();

    let oldIframe = document.getElementById('dm-iframe');
    if (oldIframe) {
        oldIframe.src = '';
        oldIframe.remove();
    }
    
    // Limpiamos también el reproductor de YouTube al salir
    if (ytPlayer) {
        ytPlayer.destroy();
        ytPlayer = null;
    }
    let oldYtContainer = document.getElementById('yt-sync-player');
    if (oldYtContainer) oldYtContainer.remove();
};

qualitySelector.addEventListener('change', (e) => {
    if (hlsInstance) {
        hlsInstance.currentLevel = parseInt(e.target.value);
    }
});

searchBar.addEventListener('input', (e) => renderChannels(e.target.value));
renderChannels();
