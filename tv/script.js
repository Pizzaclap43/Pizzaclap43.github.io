// Lista de canales
const PROXY_URL = 'https://pizza-proxy.adibabouakar.workers.dev/?url=';

const channels = [
    { id: 'vtv', name: 'VTV', url: 'https://live.eu-north-1b.cf.dmcdn.net/sec2(yNatH3KJwxePubIbqUTQtGUN8vgbuuJjWdd7WKa1S7sbeh7euRVazXXxk5tn8Di5SXaosqYr935pOlCheir9R5oBIkfr8TpzXSx6fIMLsmjyBceIL9g3V636yxKRg6tB)/dm/3/x930kre/d/live-720@60.m3u8#cell=lcf-eu-north-1b' },
    { id: 'venevision', name: 'Venevisión', url: 'https://venevision-blocked-cdn.encoders.immergo.tv/3/streamPlaylist.m3u8' },
    { id: 'televen', name: 'Televen', url: 'https://mediablocks-ve.global.ssl.fastly.net/10255/live/hls/televen/index.m3u8?hdnts=data%3Dip%3D190.6.8.48%2Cid%3DTLV-GUEST%2Cpid%3D255%2Cdid%3DN%2FA%2Csid%3DWBS%7Eacl%3D%2F10255%2Flive%2Fhls%2Fteleven%2F*%7Eexp%3D1780862671%7Ehmac%3D97401261657a8057f8f18e19bd754ad26f8fe2b6cf98b75f35f8d6b5d645de6e&AV_CATEGORY=IAB1-7&AV_WIDTH=1536&AV_HEIGHT=459&AV_DOMAIN=https%3A%2F%2Fapp.televen.com%2F&AV_URL=https%3A%2F%2Fapp.televen.com%2F&AV_RANDOM=56d50c1f-0e04-49a3-864c-3c42d4014481&AV_DNT=0&AV_IDFA=2d3fd2da-666f-442f-a777-a466cba5c985&AV_IFA_TYPE=sessionid&AV_APPNAME=TELEVEN&AV_APPPKGNAME=&AV_APPSTOREURL=&AV_APPVERS=1.29.8&AV_CONTENT_ID=20000841&AV_CONTENT_TITLE=Televen+HD&AV_LANGUAGE=es&AV_GDPR=0&AV_CONTENT_TYPE=LIVE&AV_CHANNEL_NAME=Televen+HD&AV_CCPA=1YYY&AVC_DATE=2026-06-07&AV_MAKE=&AV_MODEL=&AV_OS=1&AV_VIDEOURL=https%3A%2F%2Fmediablocks-ve.global.ssl.fastly.net%2F10255%2Flive%2Fhls%2Fteleven%2Findex.m3u8%3FAV_CATEGORY%3DIAB1-7%26AV_WIDTH%3D%255BSTPLX_PLAYER_W%255D%26AV_HEIGHT%3D%255BSTPLX_PLAYER_H%255D%26AV_DOMAIN%3Dhttps%253A%252F%252Fapp.televen.com%252F%26AV_URL%3Dhttps%253A%252F%252Fapp.televen.com%252F%26AV_RANDOM%3D%255BSTPLX_SESSION_CONTENT_UUID%255D%26AV_DNT%3D0%26AV_IDFA%3D%255BSTPLX_AD_ID%255D%26AV_IFA_TYPE%3D%255BSTPLX_AD_TYPE%255D%26AV_APPNAME%3D%255BSTPLX_APP_NAME%255D%26AV_APPPKGNAME%3D%255BSTPLX_BUNDLE_ID%255D%26AV_APPSTOREURL%3D%255BSTPLX_APP_STORE_URL%255D%26AV_APPVERS%3D%255BSTPLX_APP_VERSION%255D%26AV_CONTENT_ID%3D20000841%26AV_CONTENT_TITLE%3DTeleven%252BHD%26AV_LANGUAGE%3Des%26AV_GDPR%3D0%26AV_CONTENT_TYPE%3DLIVE%26AV_CHANNEL_NAME%3DTeleven%252BHD%26AV_CCPA%3D1YYY%26AVC_DATE%3D%255BSTPLX_SYSTEM_DATE%255D%26AV_MAKE%3D%255BSTPLX_DEVICE_MANUFACTURER%255D%26AV_MODEL%3D%255BSTPLX_DEVICE_MODEL%255D%26AV_OS%3D%255BSTPLX_OS%255D%26AV_VIDEOURL%3Dhttps%253A%252F%252Fmediablocks-ve.global.ssl.fastly.net%252F10255%252Flive%252Fhls%252Fteleven%252Findex.m3u8%26hdnts%3Ddata%253Dip%253D190.6.8.48%252Cid%253DTLV-GUEST%252Cpid%253D255%252Cdid%253DN%252FA%252Csid%253DWBS%7Eacl%253D%252F10255%252Flive%252Fhls%252Fteleven%252F%252A%7Eexp%253D1780862671%7Ehmac%253D97401261657a8057f8f18e19bd754ad26f8fe2b6cf98b75f35f8d6b5d645de6e#1780851870519' },
    { id: 'canali', name: 'Canal I', url: 'https://streaming.canal-i.com/canal-i/live/primary/1080.m3u8' },
    { id: 'lateletuya', name: 'La Tele Tuya', url: 'https://live2.eu-north-1a.cf.dmcdn.net/sec2(mGyFSoVlB4J9HsK84d_eYKlhDQW_2a-2kP3oUKmffHC4nHBoAV_AM7XGqVwe4h3wzkP8cMkpksMEVFWprchKY7HjFAaiQAgUiqChHRmRaPhn0310D-SXMGqADwMO6O-I)/cloud/3/x8z1lwk/s/live-1080@60.m3u8#cell=lcf2-eu-north-1a' },
    { id: 'tvs', name: 'TVS Maracay', url: 'https://vcp10.myplaytv.com/tvs/tvs/chunklist_w188594279.m3u8' },
    { id: 'telearagua', name: 'Telearagua', url: 'http://45.173.198.59:8080/hls/nginx3.m3u8' },
    { id: 'trv', name: 'TRV Maracay', url: 'https://streaming5.globalhostla.com/rtplive/trvnetve/chunklist_w1585023675.m3u8' }
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
