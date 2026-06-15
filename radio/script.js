// --- 1. DATOS DE LAS EMISORAS ---
const stationsData = [
    { id: 1, name: "Aragueña 99.5 FM", url: "https://cloudstream2036.conectarhosting.com/8060/stream" },
    { id: 2, name: "Positiva 92.7 FM", url: "https://stream-176.zeno.fm/zptsvda6fd0uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJ6cHRzdmRhNmZkMHV2IiwiaG9zdCI6InN0cmVhbS0xNzYuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IjVXdTRybEhVVDBXUktVYnlhY3Z2bUEiLCJpYXQiOjE3ODA4NTQ0NzIsImV4cCI6MTc4MDg1NDUzMn0.9JdBaAuZxxvhE57kpjST6WH_hHdy2-Wl_Q2Gg3vufnA&adtonosListenerId=01HG6CKJKK2N4PESGSQR728VHT&aw_0_req_lsid=a73b93b4a361b1b74689f98df91c7c0c&acu-uid=856841341346&an-uid=9072685044421090607&mm-uid=657a6563-879f-4a00-8364-1f46175de940&dot-uid=09d8220400ff6773733290ac&amb-uid=2654924301368664169&dbm-uid=CAESENpW9w2DvDhRMIuRcx8yRQA&cto-uid=2e3d537f-d45f-4fa1-8c77-abe908bae5f0-6563879e-5645&bsw-uid=e4c56c24-32be-47a2-8015-909eed2c0adb&dyn-uid=2940798897331886011&ttd-uid=f23e4a03-2239-4e97-95f9-9ff58a23724c&triton-uid=cookie%3A25a0b549-c8b9-4b1c-8a70-95e9dfab29ef&adt-uid=cuid_9d23eb64-8c85-11ee-94b0-121a6d1d7927&1779752060716" },
    { id: 3, name: "La Mega 107.3 FM", url: "https://acp4.lorini.net:2050/stream" },
    { id: 4, name: "Union Radio 90.3 FM", url: "https://acp4.lorini.net:2080/stream" },
    { id: 5, name: "Exitos 99.9 FM", url: "https://acp4.lorini.net:2070/stream" },
    { id: 6, name: "Onda 107.9 FM", url: "https://acp4.lorini.net:2060/stream" },
    { id: 7, name: "Autentica 107.5 FM", url: "https://server6.globalhostla.com:9324/stream" },
    { id: 8, name: "Radio Apolo 1320 AM", url: "https://server6.globalhostla.com:9210/stream" },
    { id: 9, name: "Radio Rumbos 670 AM", url: "https://stream-285.zeno.fm/c3q3w8zfe18uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJjM3Ezdzh6ZmUxOHV2IiwiaG9zdCI6InN0cmVhbS0yODUuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6ImxmQ2lkekYyVFQ2QldlNmdFSlhBV1EiLCJpYXQiOjE3ODA4NTQ3NDMsImV4cCI6MTc4MDg1NDgwM30.Zu3EEko5icuknBL_pEtNubt9XTfev2cNqVX_rKfW7pE" },
    { id: 10, name: "La Mega (Maracay) 96.5 FM", url: "https://acp4.lorini.net:15010/stream" },
    { id: 11, name: "Exitos (Maracay) 93.1 FM", url: "https://acp4.lorini.net:15012/stream" },
    { id: 12, name: "Radio Alegria 102.7 FM", url: "https://streamingned.com:7102/stream?1781374331297" },
    { id: 13, name: "RQ 910 AM", url: "https://acp2.lorini.net:58500//stream" },
    { id: 14, name: "La Romantica 88.9 FM", url: "https://acp2.lorini.net:58100/stream" },
    { id: 15, name: "Fiesta 106.5 FM", url: "https://acp2.lorini.net:58200/stream" },
    { id: 16, name: "Candela Pura 91.9 FM", url: "https://acp2.lorini.net:58400/stream" },
    { id: 17, name: "Hot 94.1 FM", url: "https://acp2.lorini.net:58300/stream" }
];

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

// --- RELOJ Y CLIMA ---
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`)
                .then(res => res.json())
                .then(data => {
                    document.getElementById('weather').textContent = `🌡️ ${Math.round(data.current.temperature_2m)}°C`;
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
            <div style="color: var(--text-muted); font-size: 0.9rem;">${station.name.includes('AM') ? 'AM Radio' : 'FM Radio'}</div>
        `;
        stationListEl.appendChild(card);
    });
}

// --- REPRODUCTOR ---
function selectStation(station) {
    currentStation = station;
    currentStationNameEl.textContent = station.name;
    playerUI.classList.add('show');
    updatePlayerFavIcon();
    audio.src = station.url;
    playAudio();
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
    audio.pause();
    isPlaying = false;
    updatePlayPauseIcon();
    vinyl.classList.remove('playing');
    visualizer.classList.remove('active');
}

function togglePlayPause() {
    if (!currentStation) return;
    isPlaying ? pauseAudio() : playAudio();
}

function stopAudio() {
    pauseAudio();
    audio.src = "";
    playerUI.classList.remove('show');
    currentStation = null;
}

function updatePlayPauseIcon() {
    playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause-circle"></i>' : '<i class="fas fa-play-circle"></i>';
}

function setVolume(val) {
    audio.volume = val;
    isMuted = val == 0;
    updateMuteIcon();
}

function toggleMute() {
    if (isMuted) {
        audio.volume = previousVolume > 0 ? previousVolume : 0.8;
        volumeSlider.value = audio.volume;
        isMuted = false;
    } else {
        previousVolume = audio.volume;
        audio.volume = 0;
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

audio.addEventListener('waiting', () => visualizer.classList.remove('active'));
audio.addEventListener('playing', () => visualizer.classList.add('active'));
renderStations();
