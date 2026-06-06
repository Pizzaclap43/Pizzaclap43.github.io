// Lista de canales
const PROXY_URL = 'https://pizza-proxy.adibabouakar.workers.dev/?url=';

const channels = [
    { id: 'vtv', name: 'VTV', url: 'https://live.eu-north-1b.cf.dmcdn.net/sec2(yNatH3KJwxePubIbqUTQtGUN8vgbuuJjWdd7WKa1S7sbeh7euRVazXXxk5tn8Di5SXaosqYr935pOlCheir9R5oBIkfr8TpzXSx6fIMLsmjyBceIL9g3V636yxKRg6tB)/dm/3/x930kre/d/live-720@60.m3u8#cell=lcf-eu-north-1b' },
    { id: 'venevision', name: 'Venevisión', url: 'https://venevision-blocked-cdn.encoders.immergo.tv/3/streamPlaylist.m3u8' },
    { id: 'televen', name: 'Televen', url: 'https://mediablocks-ve.global.ssl.fastly.net/10255/live/hls/televen/index.m3u8?hdnts=data%3Dip%3D190.6.33.224%2Cid%3DTLV-GUEST%2Cpid%3D255%2Cdid%3DN%2FA%2Csid%3DWBS%7Eacl%3D%2F10255%2Flive%2Fhls%2Fteleven%2F*%7Eexp%3D1780790615%7Ehmac%3D36ebbbe345a4c75352acfc46ac58337de6bf7524317b75f73514908fdf79ea60' },
    { id: 'canali', name: 'Canal I', url: 'https://streaming.canal-i.com/canal-i/live/primary/1080.m3u8' },
    { id: 'lateletuya', name: 'La Tele Tuya', url: 'https://live2.eu-north-1a.cf.dmcdn.net/sec2(fw8eQKdQErRuVA3Wh2QB1jnIBqHn3jaHzh8SA5iP5kYTtbxbRiB4tNWWhosxSDTrZdFR6fEWqAIAhxlobLEV2LvCaAgkxPPU4mF7GxqJpT89d_lirGNGULRAD6iMInit)/cloud/3/x8z1lwk/s/live-1080@60.m3u8#cell=lcf2-eu-north-1a' },
    { id: 'tvs', name: 'TVS Maracay', url: 'https://vcp10.myplaytv.com/tvs/tvs/chunklist_w188594279.m3u8' }
];

let favorites = JSON.parse(localStorage.getItem('pizzatv_favs')) || [];
let hlsInstance;

const mainView = document.getElementById('main-view');
const playerView = document.getElementById('player-view');
const channelsGrid = document.getElementById('channels-grid');
const favoritesGrid = document.getElementById('favorites-grid');
const favoritesSection = document.getElementById('favorites-section');
const searchBar = document.getElementById('search-bar');
const tvPlayer = document.getElementById('tv-player');
const nowPlaying = document.getElementById('now-playing');
const backBtn = document.getElementById('back-btn');

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

    // Si es VTV, forzamos el uso del proxy
    const finalUrl = (channel.id === 'vtv') ? PROXY_URL + encodeURIComponent(channel.url) : channel.url;

    if (Hls.isSupported()) {
        if (hlsInstance) hlsInstance.destroy();
        hlsInstance = new Hls();
        hlsInstance.loadSource(finalUrl);
        hlsInstance.attachMedia(tvPlayer);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => tvPlayer.play());
    } else if (tvPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        tvPlayer.src = finalUrl;
        tvPlayer.addEventListener('loadedmetadata', () => tvPlayer.play());
    }
};

backBtn.onclick = () => {
    playerView.style.display = 'none';
    mainView.style.display = 'block';
    tvPlayer.pause();
    if (hlsInstance) hlsInstance.destroy();
};

searchBar.addEventListener('input', (e) => renderChannels(e.target.value));
renderChannels();
