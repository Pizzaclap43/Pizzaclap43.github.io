// --- 1. DATOS DE LAS EMISORAS ---
const stationsData = [
    // --- NUESTRA RADIO SIMULADA ---
    { id: 999, name: "Radio Pizza 24/7 (AutoDJ)", url: "#", isSimulated: true },
    // --- RESTO DE LAS EMISORAS (Intactas) ---
    { id: 55, name: "Radio Pizza Acer Aspire One", url: "https://pizza-proxy.adibabouakar.workers.dev/http://s49.myradiostream.com:8150/" },
    { id: 1, name: "Aragueña 99.5 FM", url: "https://cloudstream2036.conectarhosting.com/8060/stream" },
    { id: 2, name: "Positiva 92.7 FM", url: "https://stream-176.zeno.fm/zptsvda6fd0uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJ6cHRzdmRhNmZkMHV2IiwiaG9zdCI6InN0cmVhbS0xNzYuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IjVXdTRybEhVVDBXUktVYnlhY3Z2bUEiLCJpYXQiOjE3ODA4NTQ0NzIsImV4cCI6MTactive8NTUzMn0.9JdBaAuZxxvhE57kpjST6WH_hHdy2-Wl_Q2Gg3vufnA&adtonosListenerId=01HG6CKJKK2N4PESGSQR728VHT&aw_0_req_lsid=a73b93b4a361b1b74689f98df91c7c0c&acu-uid=856841341346&an-uid=9072685044421090607&mm-uid=657a6563-879f-4a00-8364-1f46175de940&dot-uid=09d8220400ff6773733290ac&amb-uid=2654924301368664169&dbm-uid=CAESENpW9w2DvDhRMIuRcx8yRQA&cto-uid=2e3d537f-d45f-4fa1-8c77-abe908bae5f0-6563879e-5645&bsw-uid=e4c56c24-32be-47a2-8015-909eed2c0adb&dyn-uid=2940798897331886011&ttd-uid=f23e4a03-2239-4e97-95f9-9ff58a23724c&triton-uid=cookie%3A25a0b549-c8b9-4b1c-8a70-95e9dfab29ef&adt-uid=cuid_9d23eb64-8c85-11ee-94b0-121a6d1d7927&1779752060716" },
    { id: 3, name: "La Mega 107.3 FM", url: "https://acp4.lorini.net:2050/stream" },
    { id: 4, name: "Union Radio 90.3 FM", url: "https://acp4.lorini.net:2080/stream" },
    { id: 5, name: "Exitos 99.9 FM", url: "https://acp4.lorini.net:2070/stream" },
    { id: 6, name: "Onda 107.9 FM", url: "https://acp4.lorini.net:2060/stream" },
    { id: 7, name: "Autentica 107.5 FM", url: "https://server6.globalhostla.com:9324/stream" },
    { id: 8, name: "Radio Apolo 1320 AM", url: "https://server6.globalhostla.com:9210/stream" },
    { id: 9, name: "Radio Rumbos 670 AM", url: "https://stream-285.zeno.fm/c3q3w8zfe18uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJjM3Ezdzh6ZmUxOHV2IiwiaG9zdCI6InN0cmVhbS0yODUuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6ImxmQ2lkekYyVFQ2QldlNmdFSlhBV1EiLCJpYXQiOjE3ODA4NTQ3NDMsImV4cCI6MTactiveactiveNTgwM30.Zu3EEko5icuknBL_pEtNubt9XTfev2cNqVX_rKfW7pE" },
    { id: 10, name: "La Mega (Maracay) 96.5 FM", url: "https://acp4.lorini.net:15010/stream" },
    { id: 11, name: "Exitos (Maracay) 93.1 FM", url: "https://acp4.lorini.net:15012/stream" },
    { id: 12, name: "Radio Alegria 102.7 FM", url: "https://streamingned.com:7102/stream?1781374331297" },
    { id: 13, name: "RQ 910 AM", url: "https://acp2.lorini.net:58500//stream" },
    { id: 14, name: "La Romantica 88.9 FM", url: "https://acp2.lorini.net:58100/stream" },
    { id: 15, name: "Fiesta 106.5 FM", url: "https://acp2.lorini.net:58200/stream" },
    { id: 16, name: "Candela Pura 91.9 FM", url: "https://acp2.lorini.net:58400/stream" },
    { id: 17, name: "Hot 94.1 FM", url: "https://acp2.lorini.net:58300/stream" },
    { id: 18, name: "Rumbera Network (Barquisimeto) 106.7 FM", url: "https://stream-178.surfernetwork.com/9sakldmmzc7vv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiI5c2FrbGRtbXpjN3Z2IiwiaG9zdCI6InN0cmVhbS0xNzguc3VyZmVybmV0d29yay5jb20iLCJydHRsIjo1LCJqdGkiOiJyOUozWFZlSVJJT3BJNzA3bmNsN2xRIiwiaWF0IjoxNzgxNTY3NjE2LCJleHAiOjE3ODE1Njc2NzZ9.74y8wNdJ5GUCqEcEGzCLk8HOB1pG-Udtic0YqTRcnQM" },
    { id: 19, name: "Rumbera Network (Barcelona) 94.5 FM", url: "https://server6.globalhostla.com:8012/stream" },
    { id: 20, name: "Rumbera Network (Maturin) 89.5 FM", url: "https://streaming.rumberamaturin.com/;" },
    { id: 21, name: "Rumbera Network (Maracaibo) 98.7 FM", url: "https://stream-286.surfernetwork.com/85y72q4wzdfuv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiI4NXk3MnE0d3pkZnV2IiwiaG9zdCI6InN0cmVhbS0yODYuc3VyZmVybmV0d29yay5jb20iLCJydHRsIjo1LCJqdGkiOiIzbk9LY3NzYVFrLTRMZ0xLaGQtblhRIiwiaWF0IjoxNzgxNTcwOTAzLCJleHAiOjE3ODE1NzA5NjN9.ZyOnZL5TtLNdNHJPeqWkEqFLgdCk80XGBUTU9AwSd3w" },
    { id: 22, name: "La Mega (Barcelona) 100.9 FM", url: "https://acp4.lorini.net:10008/stream" },
    { id: 23, name: "Exitos (Barcelona) 95.3 FM", url: "https://acp4.lorini.net:10004/stream" },
    { id: 24, name: "Onda (Barcelona) 91.5 FM", url: "https://acp4.lorini.net:10006/stream" },
    { id: 25, name: "Union Radio (Barcelona) 93.7 FM", url: "https://acp4.lorini.net:10002/stream" },
    { id: 26, name: "La Mega (Valencia) 95.7 FM", url: "https://acp4.lorini.net:15004/stream" },
    { id: 27, name: "Exitos (Valencia) 99.1 FM", url: "https://acp4.lorini.net:15002/stream" },
    { id: 28, name: "La Mega (Barquisimeto) 103.3 FM", url: "https://acp4.lorini.net:35000/stream" },
    { id: 29, name: "Exitos (Barquisimeto) 98.1 FM", url: "https://acp4.lorini.net:2070/stream" },
    { id: 30, name: "Onda (Barquisimeto) 104.5 FM", url: "https://acp4.lorini.net:35002/stream" },
    { id: 31, name: "Union Radio (Barquisimeto) 102.3 FM", url: "https://acp4.lorini.net:2080/stream" },
    { id: 32, name: "Union Radio (Barquisimeto) 870 AM", url: "https://acp4.lorini.net:35004/stream" },
    { id: 33, name: "La Mega (Margarita) 91.9 FM", url: "https://acp4.lorini.net:25004/stream" },
    { id: 34, name: "Exitos (Margarita) 99.7 FM", url: "https://acp4.lorini.net:25006/stream" },
    { id: 35, name: "Onda (Margarita) 105.1 FM", url: "https://acp4.lorini.net:25002/stream" },
    { id: 36, name: "Union Radio (Margarita) 94.9 FM", url: "https://acp4.lorini.net:25008/stream" },
    { id: 37, name: "La Mega (Maracaibo) 99.7 FM", url: "https://acp4.lorini.net:30002/stream" },
    { id: 38, name: "Exitos (Maracaibo) 89.7 FM", url: "https://acp4.lorini.net:30000/stream" },
    { id: 39, name: "Onda (Maracaibo) 107.3 FM", url: "https://acp4.lorini.net:30004/stream" },
    { id: 40, name: "La Mega (Puerto Ordaz) 88.9 FM", url: "https://acp4.lorini.net:10115/stream" },
    { id: 41, name: "Exitos (Puerto Ordaz) 90.5 FM", url: "https://acp4.lorini.net:10109/stream" },
    { id: 42, name: "Onda (Puerto Ordaz) 88.1 FM", url: "https://acp4.lorini.net:10111/stream" },
    { id: 43, name: "Union Radio 1090 AM", url: "https://acp4.lorini.net:2090/stream" },
    { id: 44, name: "YVKE Mundial Radio 550 AM/94.5 FM", url: "https://radiomundial.com.ve/streaming/" },
    { id: 45, name: "RNV (Radio Nacional de Venezuela) 91.1 FM", url: "https://guri.tepuyserver.net/8048/stream" },
    { id: 46, name: "Fundaclove", url: "https://stream-175.surfernetwork.com/qyc9h29ce2zuv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJxeWM5aDI5Y2UyenV2IiwiaG9zdCI6InN0cmVhbS0xNzUuc3VyZmVybmV0d29yay5jb20iLCJydHRsIjo1LCJqdGkiOiI4QnJjdlFZU1RQS1hXQnUxMjdCbFFnIiwiaWF0IjoxNzgzODc0NTk0LCJleHAiOjE3ODM4NzQ2NTR9.Vp4OD7vLYHwv32smQNjzLZ2CbJt7rfX2UxDeoEs0lXo" },
    { id: 47, name: "Magic Radio 92.5 FM", url: "https://streaming.supermezclashosting.com/8500/;" },
    { id: 48, name: "Radio Show 106.7 FM", url: "https://server6.globalhostla.com:9476/stream" },
    { id: 49, name: "Magnetica 90.1 FM", url: "https://stream-282.surfernetwork.com/f7akwszagywuv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJmN2Frd3N6YWd5d3V2IiwiaG9zdCI6InN0cmVhbS0yODIuc3VyZmVybmV0d29yay5jb20iLCJydHRsIjo1LCJqdGkiOiJVRnRMQkhSWVF0aWpSTXBzbGRaVFVRIiwiaWF0IjoxNzg0MDgzMjA4LCJleHAiOjE3ODQwODMyNjh9.CAGfeTOnXjgDJGtOdAy6j42mQSY-QRt6DeVSn5m-Xpo" },
    { id: 50, name: "Victoria 103.9 FM", url: "https://guri.tepuyserver.net/8140/stream" },
    { id: 51, name: "Caliente 103.3 FM", url: "https://stream-179.surfernetwork.com/yc81fn5wgm8uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJ5YzgxZm41d2dtOHV2IiwiaG9zdCI6InN0cmVhbS0xNzkuc3VyZmVybmV0d29yay5jb20iLCJydHRsIjo1LCJqdGkiOiJhUnJ6MUlwMlFXV2FwNnZ4Ni1MZnJRIiwiaWF0IjoxNzg0MDgzNTA1LCJleHAiOjE3ODQwODM1NjV9.qIor6GBMGJOtp0WptFDI85zdTxn-B6Xo_n1ogoYCAnI" },
    { id: 52, name: "Costa de Oro 90.7 FM", url: "https://stream-177.surfernetwork.com/a07x8r77cm8uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJhMDd4OHI3N2NtOHV2IiwiaG9zdCI6InN0cmVhbS0xNzcuc3VyZmVybmV0d29yay5jb20iLCJydHRsIjo1LCJqdGkiOiJnQkVmbmlWaFJ3S2JRWmFielR3X0ZnIiwiaWF0IjoxNzg0MDgzNjMyLCJleHAiOjE3ODQwODM2OTJ9.8WS5cj29IAg_Qwtv5w_b28FiHru83LR7Vz5oS7zj6hY" },
    { id: 53, name: "ShowVen Radio 92.9 FM", url: "https://acp2.lorini.net:29004/stream" },
    { id: 54, name: "Radio Miraflores 95.9", url: "https://stream-283.surfernetwork.com/prcs4h7d9k8uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJwcmNzNGg3ZDlrOHV2IiwiaG9zdCI6InN0cmVhbS0yODMuc3VyZmVybmV0d29yay5jb20iLCJ0bSI6ZmFsc2UsInJ0dGwiOjUsImp0aSI6Ims5LTJKOF9tUXJPalNXQWZwMXZJQ3ciLCJpYXQiOjE3ODQyNDgyMjUsImV4cCI6MTc4NDI0ODI4NX0.6l8Z7utvwZCniSAg0dNIR0a7B4JhZ1ZHKR2qGHn350c" }
];

// --- 1.5 DATOS DE LA RADIO SIMULADA (AHORA CON IDs DE YOUTUBE) ---
// Extraje algunos IDs basándome en los nombres que tenías, puedes cambiarlos a gusto
const simuladaPlaylist = [
    { ytId: "usyDbeY-2_w", duration: 266 }, // Himno Nacional de la República Bolivariana de Venezuela
    { ytId: "U7zuGB_ZuWM", duration: 157 }, // Voltario - ElmichiYT
    { ytId: "0k8pxGfKIM8", duration: 193 }, // The smiler of darkness - Cat_smiler
    { ytId: "9hijZCTu4xk", duration: 257 }, // Undertale AU CatTale: Scratches and destruction - Cat_smiler
    { ytId: "-EsDu3_Pi20", duration: 222 }, // CatTale: The Dark Test Theme - Cat_smiler
    { ytId: "4fqrFm-TZxc", duration: 392 }, // Baldi's Basics Plus 0.3.9 [OST MIX] - Cat_smiler
    { ytId: "qIMPCtLNhis", duration: 316 }, // CatTale The Death Of The Hacker [suffering and torment]-[phase 2]
    { ytId: "r0olhXjiohw", duration: 341 } //  TERREMOTO Lo que el gobierno no te dice de Venezuela y la tragedia 💔🇻🇪  - energiapersonal
];
const totalDurationSimulada = simuladaPlaylist.reduce((acc, song) => acc + song.duration, 0);

// --- 1.6 INICIALIZACIÓN DE API DE YOUTUBE ---
let ytPlayer;
let ytReady = false;

// Inyectar el script de YouTube en el HTML
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Crear el contenedor invisible para YouTube si no existe en el HTML
if(!document.getElementById('youtube-audio')) {
    const ytDiv = document.createElement('div');
    ytDiv.id = 'youtube-audio';
    document.body.appendChild(ytDiv);
}

// Función global que llama YouTube cuando carga
window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('youtube-audio', {
        height: '0',
        width: '0',
        playerVars: { 'playsinline': 1, 'controls': 0, 'disablekb': 1 },
        events: {
            'onReady': () => { ytReady = true; },
            'onStateChange': onYTStateChange
        }
    });
};

function onYTStateChange(event) {
    if (event.data === YT.PlayerState.ENDED && currentStation && currentStation.isSimulated) {
        sintonizarRadioSimulada(); // Calcula la siguiente según el tiempo real
    }
    
    if (event.data === YT.PlayerState.PLAYING) {
        visualizer.classList.add('active');
    }
}

// --- RESTO DE TUS VARIABLES ---
let favorites = JSON.parse(localStorage.getItem('radioPizzaFavs')) || [];
let currentTab = 'all'; 
let currentStation = null;
let currentPlaylist = []; 
let isPlaying = false;
let isMuted = false;
let previousVolume = 0.8;

const stationListEl = document.getElementById('station-list');
const searchInput = document.getElementById('searchInput');
const audio = document.getElementById('audioElement');
const playerUI = document.getElementById('playerUI');
const currentStationNameEl = document.getElementById('currentStationName');
const playPauseBtn = document.getElementById('playPauseBtn');
const playerFavBtn = document.getElementById('playerFavBtn');
const vinyl = document.getElementById('vinyl');
const visualizer = document.getElementById('visualizer');
const volumeSlider = document.getElementById('volumeSlider');
const muteIcon = document.getElementById('muteIcon');
const toastContainer = document.getElementById('toast-container');

audio.volume = 0.8;

// --- FUNCIONES DE NOTIFICACIÓN ---
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

// --- FECHA, RELOJ Y CLIMA ---
function updateClock() {
    const now = new Date();
    const horaFormateada = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'});
    document.getElementById('clock').textContent = `🕒 ${horaFormateada}`;
    const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    let fechaFormateada = now.toLocaleDateString('es-ES', opcionesFecha);
    fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    document.getElementById('date').textContent = `📅 ${fechaFormateada}`;
}
setInterval(updateClock, 1000);
updateClock();

function getWeatherDescription(code) {
    if (code === 0) return "Despejado ☀️";
    if (code === 1) return "Mayormente despejado 🌤️";
    if (code === 2) return "Parcialmente nublado ⛅";
    if (code === 3) return "Nublado ☁️";
    if (code === 45 || code === 48) return "Niebla 🌫️";
    if (code >= 51 && code <= 57) return "Llovizna 🌧️";
    if (code >= 61 && code <= 67) return "Lluvia 🌧️";
    if (code >= 71 && code <= 77) return "Nieve ❄️";
    if (code >= 80 && code <= 82) return "Chubascos 🌦️";
    if (code >= 85 && code <= 86) return "Chubascos de nieve 🌨️";
    if (code === 95) return "Tormenta ⛈️";
    if (code === 96 || code === 99) return "Tormenta con granizo ⛈️🧊";
    return "";
}

function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`)
                .then(res => res.json())
                .then(data => {
                    const temp = Math.round(data.current.temperature_2m);
                    const desc = getWeatherDescription(data.current.weather_code);
                    document.getElementById('weather').textContent = `🌡️ ${temp}°C | ${desc}`;
                })
                .catch(() => {
                    document.getElementById('weather').textContent = "🌡️ --°C";
                    showToast("No se pudo actualizar el clima");
                });
        }, () => {
            document.getElementById('weather').textContent = "📍 Ubicación bloqueada";
            showToast("Activa tu ubicación para ver el clima");
        });
    }
}
getWeather();
setInterval(getWeather, 30 * 60 * 1000);

// --- INTERFAZ ---
searchInput.addEventListener('input', () => renderStations());

function setTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderStations();
}

function renderStations() {
    const query = searchInput.value.toLowerCase();
    stationListEl.innerHTML = '';
    let filtered = stationsData.filter(station => station.name.toLowerCase().includes(query));
    if (currentTab === 'fav') filtered = filtered.filter(station => favorites.includes(station.id));
    currentPlaylist = filtered; 

    if (filtered.length === 0) {
        stationListEl.innerHTML = `<div class="empty-message">No se encontraron emisoras 😔</div>`;
        return;
    }

    filtered.forEach(station => {
        const isFav = favorites.includes(station.id);
        const card = document.createElement('div');
        card.className = 'station-card';
        card.onclick = () => selectStation(station);
        card.innerHTML = `
            <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, ${station.id})">
                <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <div class="station-icon"><i class="fas fa-broadcast-tower"></i></div>
            <div class="station-name">${station.name}</div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">${station.name.includes('AM') ? 'AM Radio' : (station.isSimulated ? '24/7 Web Radio' : 'FM Radio')}</div>
        `;
        stationListEl.appendChild(card);
    });
}

// --- LOGICA DE RADIO SIMULADA CON YOUTUBE ---
function sintonizarRadioSimulada() {
    if (simuladaPlaylist.length === 0 || !ytReady) return;
    
    // Detiene el audio FM/AM si estaba sonando
    audio.pause();
    
    const epochFija = new Date("2026-07-17T10:45:00-04:00").getTime();
    const ahora = Date.now();
    
    const segundosTranscurridos = Math.floor((ahora - epochFija) / 1000);
    
    let segundoActualEnBucle = segundosTranscurridos % totalDurationSimulada;
    if (segundoActualEnBucle < 0) {
        segundoActualEnBucle += totalDurationSimulada;
    }
    
    let tiempoAcumulado = 0;
    let cancionActual = null;
    let segundoDeInicio = 0;
    
    for (let cancion of simuladaPlaylist) {
        if (segundoActualEnBucle >= tiempoAcumulado && segundoActualEnBucle < (tiempoAcumulado + cancion.duration)) {
            cancionActual = cancion;
            segundoDeInicio = segundoActualEnBucle - tiempoAcumulado;
            break;
        }
        tiempoAcumulado += cancion.duration;
    }
    
    if (cancionActual) {
        ytPlayer.loadVideoById({
            videoId: cancionActual.ytId,
            startSeconds: segundoDeInicio
        });
        
        isPlaying = true;
        updatePlayPauseIcon();
        vinyl.classList.add('playing');
        visualizer.classList.add('active');
    }
}

// --- REPRODUCTOR ---
function selectStation(station) {
    currentStation = station;
    currentStationNameEl.textContent = station.name;
    document.title = station.name + " - Radio Pizza 🍕";
    
    playerUI.classList.add('show');
    updatePlayerFavIcon();

    if (station.isSimulated) {
        sintonizarRadioSimulada();
    } else {
        if(ytReady) ytPlayer.stopVideo(); // Detiene YT si pasas a FM
        audio.src = station.url;
        playAudio();
    }
}

function nextStation() {
    if (!currentStation || currentPlaylist.length === 0) return;
    let currentIndex = currentPlaylist.findIndex(s => s.id === currentStation.id);
    let nextIndex = (currentIndex + 1 >= currentPlaylist.length) ? 0 : currentIndex + 1;
    selectStation(currentPlaylist[nextIndex]);
}

function prevStation() {
    if (!currentStation || currentPlaylist.length === 0) return;
    let currentIndex = currentPlaylist.findIndex(s => s.id === currentStation.id);
    let prevIndex = (currentIndex - 1 < 0) ? currentPlaylist.length - 1 : currentIndex - 1;
    selectStation(currentPlaylist[prevIndex]);
}

function playAudio() {
    audio.play().then(() => {
        isPlaying = true;
        updatePlayPauseIcon();
        vinyl.classList.add('playing');
        visualizer.classList.add('active');
    }).catch(error => {
        console.error("Error:", error);
        showToast("Error de conexión: No se pudo reproducir la emisora");
        stopAudio();
    });
}

function pauseAudio() {
    if (currentStation && currentStation.isSimulated && ytReady) {
        ytPlayer.pauseVideo();
    } else {
        audio.pause();
    }
    isPlaying = false;
    updatePlayPauseIcon();
    vinyl.classList.remove('playing');
    visualizer.classList.remove('active');
}

function togglePlayPause() {
    if (!currentStation) return;
    if (isPlaying) {
        pauseAudio();
    } else {
        if (currentStation.isSimulated) {
            sintonizarRadioSimulada(); // Resincroniza YT
        } else {
            playAudio(); // Reproduce FM
        }
    }
}

function stopAudio() {
    pauseAudio();
    if(ytReady) ytPlayer.stopVideo();
    audio.src = "";
    playerUI.classList.remove('show');
    currentStation = null;
    document.title = "Radio Pizza 🍕";
}

function updatePlayPauseIcon() {
    playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause-circle"></i>' : '<i class="fas fa-play-circle"></i>';
}

function setVolume(val) {
    audio.volume = val;
    if(ytReady) ytPlayer.setVolume(val * 100); // YT usa escala 0-100
    
    isMuted = val == 0;
    updateMuteIcon();
}

function toggleMute() {
    if (isMuted) {
        audio.volume = previousVolume > 0 ? previousVolume : 0.8;
        if(ytReady) ytPlayer.setVolume(audio.volume * 100);
        volumeSlider.value = audio.volume;
        isMuted = false;
    } else {
        previousVolume = audio.volume;
        audio.volume = 0;
        if(ytReady) ytPlayer.setVolume(0);
        volumeSlider.value = 0;
        isMuted = true;
    }
    updateMuteIcon();
}

function updateMuteIcon() {
    muteIcon.className = (audio.volume === 0) ? "fas fa-volume-mute" : "fas fa-volume-down";
    muteIcon.style.color = (audio.volume === 0) ? "var(--primary)" : "var(--text-light)";
}

// --- FAVORITOS ---
function toggleFavorite(event, stationId) {
    event.stopPropagation();
    if (favorites.includes(stationId)) {
        favorites = favorites.filter(id => id !== stationId);
    } else {
        favorites.push(stationId);
    }
    localStorage.setItem('radioPizzaFavs', JSON.stringify(favorites));
    renderStations();
    if (currentStation && currentStation.id === stationId) updatePlayerFavIcon();
}

function toggleFavoriteFromPlayer() {
    if (!currentStation) return;
    if (favorites.includes(currentStation.id)) {
        favorites = favorites.filter(id => id !== currentStation.id);
    } else {
        favorites.push(currentStation.id);
    }
    localStorage.setItem('radioPizzaFavs', JSON.stringify(favorites));
    updatePlayerFavIcon();
    renderStations();
}

function updatePlayerFavIcon() {
    if (!currentStation) return;
    const isFav = favorites.includes(currentStation.id);
    playerFavBtn.innerHTML = `<i class="${isFav ? 'fas' : 'far'} fa-heart" style="color: ${isFav ? 'var(--primary)' : 'var(--text-light)'}"></i>`;
}

// Eventos de audio estándar
audio.addEventListener('waiting', () => visualizer.classList.remove('active'));
audio.addEventListener('playing', () => visualizer.classList.add('active'));
renderStations();

// --- REGISTRO DEL SERVICE WORKER (PWA) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado con éxito.', reg))
            .catch(err => console.warn('Error al registrar Service Worker.', err));
    });
}
