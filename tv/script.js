// Lista de canales
const PROXY_URL = 'https://pizza-proxy.adibabouakar.workers.dev/?url=';

const channels = [
    { id: 'vtv', name: 'VTV', url: 'https://cdndirector.dailymotion.com/cdn/live/video/x930kre.m3u8?sec=v7UYF8IKU4nDAc5Drhl-tuLdoxTnFFnGO8MqWaVUaRltyYmHVeDFUJcepoQ957JqPl3rt8f22s0t6FKTataXe4YCAEC_WKgCCTaoMfX1oDreukP0nemfrhVqeqbzpFZi&dmTs=977015&dmV1st=C028908A369AC194938E5DA83F8DF9F7' },
    { id: 'venevision', name: 'Venevisión', url: 'https://venevision-blocked-cdn.encoders.immergo.tv/3/streamPlaylist.m3u8' },
    { id: 'televen', name: 'Televen', url: 'https://mediablocks-ve.global.ssl.fastly.net/10255/live/hls/televen/index.m3u8?hdnts=data%3Dip%3D190.6.8.48%2Cid%3DTLV-GUEST%2Cpid%3D255%2Cdid%3DN%2FA%2Csid%3DWBS%7Eacl%3D%2F10255%2Flive%2Fhls%2Fteleven%2F*%7Eexp%3D1780862671%7Ehmac%3D97401261657a8057f8f18e19bd754ad26f8fe2b6cf98b75f35f8d6b5d645de6e&AV_CATEGORY=IAB1-7&AV_WIDTH=1536&AV_HEIGHT=459&AV_DOMAIN=https%3A%2F%2Fapp.televen.com%2F&AV_URL=https%3A%2F%2Fapp.televen.com%2F&AV_RANDOM=56d50c1f-0e04-49a3-864c-3c42d4014481&AV_DNT=0&AV_IDFA=2d3fd2da-666f-442f-a777-a466cba5c985&AV_IFA_TYPE=sessionid&AV_APPNAME=TELEVEN&AV_APPPKGNAME=&AV_APPSTOREURL=&AV_APPVERS=1.29.8&AV_CONTENT_ID=20000841&AV_CONTENT_TITLE=Televen+HD&AV_LANGUAGE=es&AV_GDPR=0&AV_CONTENT_TYPE=LIVE&AV_CHANNEL_NAME=Televen+HD&AV_CCPA=1YYY&AVC_DATE=2026-06-07&AV_MAKE=&AV_MODEL=&AV_OS=1&AV_VIDEOURL=https%3A%2F%2Fmediablocks-ve.global.ssl.fastly.net%2F10255%2Flive%2Fhls%2Fteleven%2Findex.m3u8%3FAV_CATEGORY%3DIAB1-7%26AV_WIDTH%3D%255BSTPLX_PLAYER_W%255D%26AV_HEIGHT%3D%255BSTPLX_PLAYER_H%255D%26AV_DOMAIN%3Dhttps%253A%252F%252Fapp.televen.com%252F%26AV_URL%3Dhttps%253A%252F%252Fapp.televen.com%252F%26AV_RANDOM%3D%255BSTPLX_SESSION_CONTENT_UUID%255D%26AV_DNT%3D0%26AV_IDFA%3D%255BSTPLX_AD_ID%255D%26AV_IFA_TYPE%3D%255BSTPLX_AD_TYPE%255D%26AV_APPNAME%3D%255BSTPLX_APP_NAME%255D%26AV_APPPKGNAME%3D%255BSTPLX_BUNDLE_ID%255D%26AV_APPSTOREURL%3D%255BSTPLX_APP_STORE_URL%255D%26AV_APPVERS%3D%255BSTPLX_APP_VERSION%255D%26AV_CONTENT_ID%3D20000841%26AV_CONTENT_TITLE%3DTeleven%252BHD%26AV_LANGUAGE%3Des%26AV_GDPR%3D0%26AV_CONTENT_TYPE%3DLIVE%26AV_CHANNEL_NAME%3DTeleven%252BHD%26AV_CCPA%3D1YYY%26AVC_DATE%3D%255BSTPLX_SYSTEM_DATE%255D%26AV_MAKE%3D%255BSTPLX_DEVICE_MANUFACTURER%255D%26AV_MODEL%3D%255BSTPLX_DEVICE_MODEL%255D%26AV_OS%3D%255BSTPLX_OS%255D%26AV_VIDEOURL%3Dhttps%253A%252F%252Fmediablocks-ve.global.ssl.fastly.net%252F10255%252Flive%252Fhls%252Fteleven%252Findex.m3u8%26hdnts%3Ddata%253Dip%253D190.6.8.48%252Cid%253DTLV-GUEST%252Cpid%253D255%252Cdid%253DN%252FA%252Csid%253DWBS%7Eacl%253D%252F10255%252Flive%252Fhls%252Fteleven%252F%252A%7Eexp%253D1780862671%7Ehmac%253D97401261657a8057f8f18e19bd754ad26f8fe2b6cf98b75f35f8d6b5d645de6e#1780851870519' },
    { id: 'canali', name: 'Canal I', url: 'https://streaming.canal-i.com/canal-i/live/primary/1080.m3u8', audioUrl: 'https://streaming.canal-i.com/canal-i/live/primary/audio.m3u8' },
    { id: 'lateletuya', name: 'La Tele Tuya', url: 'https://live2.eu-north-1a.cf.dmcdn.net/sec2(mGyFSoVlB4J9HsK84d_eYKlhDQW_2a-2kP3oUKmffHC4nHBoAV_AM7XGqVwe4h3wzkP8cMkpksMEVFWprchKY7HjFAaiQAgUiqChHRmRaPhn0310D-SXMGqADwMO6O-I)/cloud/3/x8z1lwk/s/live-1080@60.m3u8#cell=lcf2-eu-north-1a' },
    { id: 'tvs', name: 'TVS Maracay', url: 'https://vcp10.myplaytv.com/tvs/tvs/chunklist_w188594279.m3u8' },
    { id: 'telearagua', name: 'Telearagua', url: 'http://45.173.198.59:8080/hls/nginx3.m3u8' },
    { id: 'trv', name: 'TRV Maracay', url: 'https://streaming5.globalhostla.com/rtplive/trvnetve/chunklist_w1585023675.m3u8' },
    { id: 'meridiano', name: 'Meridiano TV', url: 'https://live.eu-north-1a.cf.dmcdn.net/sec2(YxMRgx-4I1QkMV0b2BK6ABGJ1Rtv-yMLzZk8sfWhQkN-4DmExYSJFTrApnHK0b1xtuHfU5DQVhU_X6S2prNO3zCFa2ugxwAbNkPWoSBBw_PsEF2g_W0UMKhoizkict7g)/dm/3/x9sxu9y/d/live-720.m3u8#cell=lcf-eu-north-1a' },
    { id: 'latina', name: 'Latina', url: 'https://dai.google.com/linear/hls/pa/event/oYQGDqEGTmGdHE_fz9oLlg/stream/c5abb342-ae3c-49e5-8c14-8c264e3e2eb4:DLS/master.m3u8' },
    { id: 'latinanoticias', name: 'Latina Noticias', url: 'https://redirector.rudo.video/hls-video/567ffde3fa319fadf3419efda25619456231dfea/latinanoticias/latinanoticias.smil/playlist.m3u8?did=r1us539206592f9464dfc502f675a1611d0374450d96c&ndvc=0' },
    { id: 'nmasforo', name: 'N+ Foro', url: 'https://channel02dai-notusa.akamaized.net/linear/hls/pa/event/02DzjYAJRCeAE9uB8o3ivg/stream/702217f3-7b28-405c-8ed5-d4219251e768:TUL/variant/ea6e216659b50f4032de9a13dc877b7f/bandwidth/14180324.m3u8?hdntl=exp=1781375761~acl=*~id=d259990c-efbd-4548-943a-bde934717c28~data=hdntl~hmac=af14265855b08ff1974a946017ab152899462528a2911a04fe1d2f08916035db&' },
    { id: 'nmas', name: 'N+', url: 'https://channel07dai.akamaized.net/linear/hls/pa/event/F1h_jGT-SiyoB_fWQlz4YA/stream/dc27a0ab-5c76-434d-8712-050e26a4379a:CHS/variant/b4062b809f135dcebc4d1600fb9b1662/bandwidth/11542961.m3u8?hdntl=exp=1781375956~acl=*~id=e488e8bd-25c2-492d-8921-33a4eae207d1~data=hdntl~hmac=9d8bba325ec023deb58a05ed6b05d70fa6f23506e12b718ccaf96fe3ac560fd4&' },
    { id: 'nmasguadalajara', name: 'N+ Guadalajara', url: 'https://channel08dai-notusa.akamaized.net/linear/hls/pa/event/g-TsMfsDShmihnjxg05-LQ/stream/b4d4c92f-6605-4e06-82d9-ced6c8cd55e7:TUL/variant/86fbdc5332d82e4ad9530c71ee16ec54/bandwidth/14180324.m3u8?hdntl=exp=1781376102~acl=*~id=78038045-1d24-4ded-9033-9b210f26c572~data=hdntl~hmac=67e5ea26caf6d5a19b3ad42de1985e566636e4252f1974c8a7d30897864ece56&' },
    { id: 'nmasmonterrey', name: 'N+ Monterrey', url: 'https://channel09dai-notusa.akamaized.net/linear/hls/pa/event/HIvz3eobRmm2yIUHWJssIQ/stream/0d35297b-be93-4f4e-81ff-bb8ee4bfa645:ATL/variant/495b98f3df59b988ea88cc7857667920/bandwidth/14180324.m3u8?hdntl=exp=1781376178~acl=*~id=de25fbab-75ae-4ba6-a958-947dff1e2d77~data=hdntl~hmac=9c2a849e9d3e0429fddffa0beee1bc27ade030babfac568515b0a0cf8cfaa017&' },
    { id: 'fiazteca', name: 'FIA Azteca', url: 'https://us-b4-p-e-nq15.cdn.mdstrm.com/live-stream-gdai/685c57312e388c0e9cacb4d8/linear/hls/pa/event/msyVvVGhRpGFz0uwDdACsQ/stream/ab6117ea-b8ae-4fac-8b02-fd82f97060de:MRN2/variant/a5f1a51aa550e3bfbc61db1146a1bb08/bandwidth/2787400.m3u8?aid=5fea09a071a9945deebf5f7c&dnt=true&access_token=geTuuDosMbcUGHI3kSbVbLDVgCcku0gqGRlZ2nyLFhQsRm6Gg86yMM77mAZmuh6EbM4wexGT3wH&uid=OJOyjcRWKdiMxHz43KtqTH9PlNyfsBLh&sid=nHZWAlLTLOK2YIfKuYPNpcfJKInvhFsX&pid=BhzsPUpPRsikgaPXQK6gj0149Ep4Skpm&ref=envivo.tvazteca.com&ext_pb=0&adInsertionGoogleStreamId=ab6117ea-b8ae-4fac-8b02-fd82f97060de%3AMRN2&CMCD=cid%3D%22685c57312e388c0e9cacb4d8%22%2Cmtp%3D62100%2Cot%3Dm%2Csf%3Dh%2Csid%3D%22BhzsPUpPRsikgaPXQK6gj0149Ep4Skpm%22&es=us-b4-p-e-nq15.cdn.mdstrm.com&ote=1781376653446&ot=Uv5MbXfNkIlPNFNmhT8kKQ&proto=https&pz=us' },
    { id: 'aztecadeportes', name: 'Azteca Deportes', url: 'https://us-b4-p-e-mg17.cdn.mdstrm.com/live-stream-gdai/6994be4d5caab0723aaab37c/linear/hls/pa/event/G1QYxOZDQK2wQGNKczvXgQ/stream/1a5f487b-3750-47c8-bb77-75aae590a96f:ATL/variant/5da3fe024d16040c410599f974ef7032/bandwidth/2822600.m3u8?aid=5fea09a071a9945deebf5f7c&dnt=true&access_token=iVsxocIEhhmYcA8V7rvfwssfSYbzAgoO1tsVyzMQNilrhWhiusUAOWapPHOhGagrZ8629zHWRqi&uid=OJOyjcRWKdiMxHz43KtqTH9PlNyfsBLh&sid=nHZWAlLTLOK2YIfKuYPNpcfJKInvhFsX&pid=409EyqrqADs7WuXKUxZgHg5w27lPQxih&ref=envivo.tvazteca.com&ext_pb=0&adInsertionGoogleStreamId=1a5f487b-3750-47c8-bb77-75aae590a96f%3AATL&CMCD=cid%3D%226994be4d5caab0723aaab37c%22%2Cmtp%3D67700%2Cot%3Dm%2Csf%3Dh%2Csid%3D%22409EyqrqADs7WuXKUxZgHg5w27lPQxih%22&es=us-b4-p-e-mg17.cdn.mdstrm.com&ote=1781376792228&ot=u5nP3aDV3YLXnUw4r2sEXA&proto=https&pz=us' }
];

let favorites = JSON.parse(localStorage.getItem('pizzatv_favs')) || [];
let hlsInstance;
let hlsAudioInstance; 
const tvAudio = new Audio(); 

// Bandera para saber si el canal actual requiere sincronización de audio
lethasSeparateAudio = false;

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

    const finalUrl = (channel.id === 'vtv') ? PROXY_URL + encodeURIComponent(channel.url) : channel.url;

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
