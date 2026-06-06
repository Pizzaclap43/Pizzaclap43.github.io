// Lista de canales con los enlaces suministrados
const channels = [
    { id: 'vtv', name: 'VTV', url: 'https://live.eu-north-1b.cf.dmcdn.net/sec2(f0NCr7KrgYI-jowdeCumI4QncII8VdeqMsFcBH86Fju9KmCPF5-2MzJ9hjQY7Fk0yKMjmcNvPEhdbcwMneerGmAF8SDnEy5WoyJiLz_SMX7jLNUA2Bn7cjHRUSMg9HqX)/dm/3/x930kre/d/live-720@60.m3u8#cell=lcf-eu-north-1b' },
    { id: 'venevision', name: 'Venevisión', url: 'https://venevision-blocked-cdn.encoders.immergo.tv/3/streamPlaylist.m3u8' },
    { id: 'televen', name: 'Televen', url: 'https://mediablocks-ve.global.ssl.fastly.net/10255/live/hls/televen/index.m3u8?hdnts=data%3Dip%3D190.6.33.224%2Cid%3DTLV-GUEST%2Cpid%3D255%2Cdid%3DN%2FA%2Csid%3DWBS%7Eacl%3D%2F10255%2Flive%2Fhls%2Fteleven%2F*%7Eexp%3D1780790615%7Ehmac%3D36ebbbe345a4c75352acfc46ac58337de6bf7524317b75f73514908fdf79ea60' },
    { id: 'canali', name: 'Canal I', url: 'https://streaming.canal-i.com/canal-i/live/primary/1080.m3u8' },
    { id: 'lateletuya', name: 'La Tele Tuya', url: 'https://live2.eu-north-1a.cf.dmcdn.net/sec2(fw8eQKdQErRuVA3Wh2QB1jnIBqHn3jaHzh8SA5iP5kYTtbxbRiB4tNWWhosxSDTrZdFR6fEWqAIAhxlobLEV2LvCaAgkxPPU4mF7GxqJpT89d_lirGNGULRAD6iMInit)/cloud/3/x8z1lwk/s/live-1080@60.m3u8#cell=lcf2-eu-north-1a' },
    { id: 'tvs', name: 'TVS Maracay', url: 'https://vcp10.myplaytv.com/tvs/tvs/chunklist_w188594279.m3u8' }
];

// Cargar favoritos guardados en el navegador
let favorites = JSON.parse(localStorage.getItem('pizzatv_favs')) || [];
let hlsInstance; // Variable para controlar el reproductor

// Elementos del DOM
const mainView = document.getElementById('main-view');
const playerView = document.getElementById('player-view');
const channelsGrid = document.getElementById('channels-grid');
const favoritesGrid = document.getElementById('favorites-grid');
const favoritesSection = document.getElementById('favorites-section');
const searchBar = document.getElementById('search-bar');
const tvPlayer = document.getElementById('tv-player');
const nowPlaying = document.getElementById('now-playing');
const backBtn = document.getElementById('back-btn');

// Función para renderizar las tarjetas
function renderChannels(filterText = '') {
    channelsGrid.innerHTML = '';
    favoritesGrid.innerHTML = '';
    let hasFavs = false;

    channels.forEach(channel => {
        // Filtrado de búsqueda
        if (channel.name.toLowerCase().includes(filterText.toLowerCase())) {
            const isFav = favorites.includes(channel.id);
            const cardHTML = `
                <div class="channel-card">
                    <div class="channel-name" onclick="playChannel('${channel.id}')">${channel.name}</div>
                    <button class="fav-btn" onclick="toggleFavorite('${channel.id}', event)">
                        ${isFav ? '★' : '☆'}
                    </button>
                </div>
            `;

            // Si es favorito y no estamos buscando, lo metemos en la sección superior también
            if (isFav && filterText === '') {
                hasFavs = true;
                favoritesGrid.insertAdjacentHTML('beforeend', cardHTML);
            }
            // Agregamos a la lista general
            channelsGrid.insertAdjacentHTML('beforeend', cardHTML);
        }
    });

    favoritesSection.style.display = (hasFavs && filterText === '') ? 'block' : 'none';
}

// Lógica de Favoritos
window.toggleFavorite = function(id, event) {
    event.stopPropagation(); // Evita que se abra el reproductor al tocar la estrella
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('pizzatv_favs', JSON.stringify(favorites));
    renderChannels(searchBar.value);
};

// Lógica del Reproductor
window.playChannel = function(id) {
    const channel = channels.find(c => c.id === id);
    
    // Cambiar vista
    mainView.style.display = 'none';
    playerView.style.display = 'flex';
    nowPlaying.innerText = `📺 ${channel.name}`;

    // Configurar HLS
    if (Hls.isSupported()) {
        if (hlsInstance) {
            hlsInstance.destroy(); // Limpiar canal anterior
        }
        hlsInstance = new Hls();
        hlsInstance.loadSource(channel.url);
        hlsInstance.attachMedia(tvPlayer);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function() {
            tvPlayer.play();
        });
    } 
    // Alternativa nativa para navegadores como Safari
    else if (tvPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        tvPlayer.src = channel.url;
        tvPlayer.addEventListener('loadedmetadata', function() {
            tvPlayer.play();
        });
    }
};

// Botón de Regresar
backBtn.onclick = () => {
    playerView.style.display = 'none';
    mainView.style.display = 'block';
    tvPlayer.pause();
    if (hlsInstance) {
        hlsInstance.destroy(); // Detiene la descarga de video al regresar al menú
    }
};

// Escuchador de búsqueda
searchBar.addEventListener('input', (e) => {
    renderChannels(e.target.value);
});

// Inicializar la interfaz al cargar
renderChannels();
