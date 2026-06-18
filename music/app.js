import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tu Configuración de Pizza Music Cloud
const firebaseConfig = {
  apiKey: "AIzaSyCWx8kKQYe11_urooRTCfvBcC20xlIfMes",
  authDomain: "pizza-music-eab88.firebaseapp.com",
  projectId: "pizza-music-eab88",
  storageBucket: "pizza-music-eab88.firebasestorage.app",
  messagingSenderId: "678682489891",
  appId: "1:678682489891:web:e9b3ede88d2acd7ff3ed96",
  measurementId: "G-T72Y6QRH6L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Estado Global
let allSongs = [];
let currentPlaylist = [];
let currentSongIndex = -1;
let isSignUpMode = false;
let currentArtistName = "";

// Estado Compartido Estilo Radio Pizza
let favorites = JSON.parse(localStorage.getItem('radioPizzaFavs')) || [];
let isMuted = false;
let previousVolume = 0.8;

// Web Audio API Context (Para el Ecualizador Profesional de 5 Bandas)
let audioCtx, source;
let eqBands = [];
let isAudioSetup = false;

// Componentes del DOM
const mainAudio = document.getElementById('mainAudio');
const globalPlayer = document.getElementById('globalPlayer');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const btnPlayPause = document.getElementById('btnPlayPause');
const btnStop = document.getElementById('btnStop');
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const playerFavBtn = document.getElementById('playerFavBtn');
const progressBar = document.getElementById('progressBar');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');
const volBar = document.getElementById('volBar');
const muteIcon = document.getElementById('muteIcon');
const btnEqToggle = document.getElementById('btnEqToggle');
const eqPanel = document.getElementById('eqPanel');

// Contenedores Visuales
const vinyl = document.getElementById('vinyl');
const visualizer = document.getElementById('visualizer');
const toastContainer = document.getElementById('toast-container');
const searchInput = document.getElementById('searchInput');
const songsGrid = document.getElementById('songsGrid'); // Música
const podcastsGrid = document.getElementById('podcastsGrid'); // Podcasts

// --- SISTEMA DE NOTIFICACIONES (TOASTS DE RADIO PIZZA) ---
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

// --- WIDGETS DE ENTORNO EN VIVO (RELOJ, FECHA Y CLIMA) ---
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = `🕒 ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}`;
    
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    let dateStr = now.toLocaleDateString('es-ES', options);
    document.getElementById('date').textContent = `📅 ${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}`;
}
setInterval(updateClock, 1000);
updateClock();

function getWeatherCodeDesc(code) {
    if (code === 0) return "Despejado ☀️";
    if (code <= 3) return "Parcialmente Nublado ⛅";
    if (code >= 51 && code <= 67) return "Lluvia 🌧️";
    if (code === 95) return "Tormenta ⛈️";
    return "Nublado ☁️";
}

function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m,weather_code`)
                .then(res => res.json())
                .then(data => {
                    const temp = Math.round(data.current.temperature_2m);
                    const desc = getWeatherCodeDesc(data.current.weather_code);
                    document.getElementById('weather').textContent = `🌡️ ${temp}°C | ${desc}`;
                }).catch(() => { document.getElementById('weather').textContent = "🌡️ --°C"; });
        }, () => { document.getElementById('weather').textContent = "📍 Sin Ubicación"; });
    }
}
getWeather();
setInterval(getWeather, 15 * 60 * 1000);


// --- CONFIGURACIÓN DE AUDIO CON ECUALIZADOR (5 BANDAS PRO) ---
function setupAudioContext() {
    if (isAudioSetup) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    source = audioCtx.createMediaElementSource(mainAudio);

    const frequencies = [60, 230, 910, 3600, 14000];
    const types = ['lowshelf', 'peaking', 'peaking', 'peaking', 'highshelf'];

    eqBands = frequencies.map((freq, index) => {
        let filter = audioCtx.createBiquadFilter();
        filter.type = types[index];
        filter.frequency.value = freq;
        filter.Q.value = 1.2;
        filter.gain.value = 0;
        return filter;
    });

    source.connect(eqBands[0]);
    for (let i = 0; i < eqBands.length - 1; i++) {
        eqBands[i].connect(eqBands[i + 1]);
    }
    eqBands[eqBands.length - 1].connect(audioCtx.destination);
    
    isAudioSetup = true;
}


// --- MOTOR DEL REPRODUCTOR FUSIONADO ---
function loadAndPlaySong(song) {
    if (!song) return;
    setupAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    globalPlayer.classList.add('active');
    playerTitle.innerText = song.titulo;
    playerArtist.innerText = song.nombreArtista;
    mainAudio.src = song.urlCatbox;

    mainAudio.play()
        .then(() => {
            updatePlayStatus(true);
            updateFavIconState();
            showToast(`Sintonizando: ${song.titulo}`);
        })
        .catch(() => {
            showToast("Error cargando el streaming del archivo");
            updatePlayStatus(false);
        });
}

function updatePlayStatus(playing) {
    if (playing) {
        btnPlayPause.innerHTML = '<i class="fas fa-pause-circle"></i>';
        vinyl.classList.add('playing');
        visualizer.classList.add('active');
    } else {
        btnPlayPause.innerHTML = '<i class="fas fa-play-circle"></i>';
        vinyl.classList.remove('playing');
        visualizer.classList.remove('active');
    }
}

// Botones e Interacciones
btnPlayPause.addEventListener('click', () => {
    if (!mainAudio.src) return;
    if (mainAudio.paused) {
        setupAudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        mainAudio.play();
        updatePlayStatus(true);
    } else {
        mainAudio.pause();
        updatePlayStatus(false);
    }
});

btnStop.addEventListener('click', () => {
    mainAudio.pause();
    mainAudio.currentTime = 0;
    updatePlayStatus(false);
    showToast("Reproducción detenida");
});

btnNext.addEventListener('click', () => {
    if (currentPlaylist.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    loadAndPlaySong(currentPlaylist[currentSongIndex]);
});

btnPrev.addEventListener('click', () => {
    if (currentPlaylist.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    loadAndPlaySong(currentPlaylist[currentSongIndex]);
});

mainAudio.addEventListener('ended', () => btnNext.click());

// Barra de Progreso y Tiempo
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

mainAudio.addEventListener('timeupdate', () => {
    timeCurrent.innerText = formatTime(mainAudio.currentTime);
    if (mainAudio.duration) {
        timeTotal.innerText = formatTime(mainAudio.duration);
        progressBar.value = (mainAudio.currentTime / mainAudio.duration) * 100;
    }
});

progressBar.addEventListener('input', () => {
    if (mainAudio.duration) {
        mainAudio.currentTime = (progressBar.value / 100) * mainAudio.duration;
    }
});

// Control de Volumen y Mute Avanzado
muteIcon.addEventListener('click', () => {
    if (isMuted) {
        mainAudio.volume = previousVolume > 0 ? previousVolume : 0.8;
        volBar.value = mainAudio.volume;
        isMuted = false;
    } else {
        previousVolume = mainAudio.volume;
        mainAudio.volume = 0;
        volBar.value = 0;
        isMuted = true;
    }
    updateMuteUI();
});

function updateMuteUI() {
    if (mainAudio.volume === 0) {
        muteIcon.className = "fas fa-volume-mute";
        muteIcon.style.color = "var(--pizza-red)";
    } else {
        muteIcon.className = "fas fa-volume-down";
        muteIcon.style.color = "white";
    }
}

volBar.addEventListener('input', (e) => {
    mainAudio.volume = e.target.value;
    isMuted = e.target.value == 0;
    updateMuteUI();
});

// Gestión de Favoritos LocalStorage
playerFavBtn.addEventListener('click', () => {
    if (currentSongIndex === -1 || !currentPlaylist[currentSongIndex]) return;
    const track = currentPlaylist[currentSongIndex];
    
    if (favorites.includes(track.id)) {
        favorites = favorites.filter(id => id !== track.id);
        showToast("Removido de favoritos");
    } else {
        favorites.push(track.id);
        showToast("¡Agregado a tus favoritos! ❤️");
    }
    localStorage.setItem('radioPizzaFavs', JSON.stringify(favorites));
    updateFavIconState();
});

function updateFavIconState() {
    if (currentSongIndex === -1 || !currentPlaylist[currentSongIndex]) return;
    const isFav = favorites.includes(currentPlaylist[currentSongIndex].id);
    playerFavBtn.innerHTML = `<i class="${isFav ? 'fas' : 'far'} fa-heart" style="color: ${isFav ? 'var(--pizza-red)' : 'inherit'}"></i>`;
}

// Control de los Deslizadores Verticales (Faders) del Ecualizador
btnEqToggle.addEventListener('click', () => {
    eqPanel.classList.toggle('show');
    btnEqToggle.classList.toggle('active');
});

const faders = [
    { el: document.getElementById('eq60'), val: document.getElementById('val60') },
    { el: document.getElementById('eq230'), val: document.getElementById('val230') },
    { el: document.getElementById('eq910'), val: document.getElementById('val910') },
    { el: document.getElementById('eq3k'), val: document.getElementById('val3k') },
    { el: document.getElementById('eq14k'), val: document.getElementById('val14k') }
];

faders.forEach((band, index) => {
    band.el.addEventListener('input', (e) => {
        const value = e.target.value;
        band.val.innerText = `${value > 0 ? '+' : ''}${value} dB`;
        if (eqBands[index]) eqBands[index].gain.value = value;
    });
});

document.getElementById('btnEqReset').addEventListener('click', () => {
    faders.forEach((band, index) => {
        band.el.value = 0;
        band.val.innerText = "0 dB";
        if (eqBands[index]) eqBands[index].gain.value = 0; 
    });
    showToast("Ecualizador reiniciado a 0 dB");
});


// --- RENDERS MULTIPLES (MÚSICA Y PODCASTS) ---
function renderTracks(tracksList, container) {
    container.innerHTML = "";
    if (tracksList.length === 0) {
        container.innerHTML = "<p style='color: var(--text-muted);'>No hay nada por aquí...</p>";
        return;
    }
    tracksList.forEach((s, index) => {
        const div = document.createElement('div');
        div.className = 'song-card';
        
        // Verifica si tiene imagen, si no, usa el icono según sea música o podcast
        const iconClass = s.tipo === 'podcast' ? 'fa-microphone' : 'fa-music';
        const coverHtml = s.portadaUrl 
            ? `<img src="${s.portadaUrl}" class="cover-img" alt="Portada">` 
            : `<i class="fa-solid ${iconClass}" style="font-size:40px; color:#222;"></i>`;

        div.innerHTML = `
            <div class="cover-placeholder">
                ${coverHtml}
            </div>
            <h4>${s.titulo}</h4>
            <p>${s.nombreArtista}</p>
        `;
        
        div.onclick = () => {
            currentPlaylist = tracksList; // Si pincha un podcast, la lista se vuelve de puros podcasts
            currentSongIndex = index;
            loadAndPlaySong(currentPlaylist[currentSongIndex]);
        };
        container.appendChild(div);
    });
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    // Filtrar música
    const filteredMusic = allSongs.filter(s => s.tipo !== 'podcast' && 
        (s.titulo.toLowerCase().includes(term) || s.nombreArtista.toLowerCase().includes(term))
    );
    // Filtrar podcasts
    const filteredPodcasts = allSongs.filter(s => s.tipo === 'podcast' && 
        (s.titulo.toLowerCase().includes(term) || s.nombreArtista.toLowerCase().includes(term))
    );
    
    renderTracks(filteredMusic, songsGrid);
    renderTracks(filteredPodcasts, podcastsGrid);
});

const q = query(collection(db, "canciones"), orderBy("fecha", "desc"));
onSnapshot(q, (snapshot) => {
    allSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Los datos viejos en la DB que no tienen "tipo" se asumen como "musica" por defecto
    allSongs.forEach(s => { if(!s.tipo) s.tipo = 'musica'; });

    if(searchInput.value === "") {
        const musicList = allSongs.filter(s => s.tipo === 'musica');
        const podcastList = allSongs.filter(s => s.tipo === 'podcast');
        
        renderTracks(musicList, songsGrid);
        renderTracks(podcastList, podcastsGrid);
    }
});


// --- FLUJO DE AUTENTICACIÓN Y SUBIDA DE TRACKS ---
const authPanel = document.getElementById('authPanel');
const uploadPanel = document.getElementById('uploadPanel');
const authForm = document.getElementById('authForm');
const uploadForm = document.getElementById('uploadForm');
const authTitle = document.getElementById('authTitle');
const nameField = document.getElementById('nameField');
const btnAuthSubmit = document.getElementById('btnAuthSubmit');
const toggleAuthMode = document.getElementById('toggleAuthMode');
const userStatusText = document.getElementById('userStatusText');
const btnLogout = document.getElementById('btnLogout');

toggleAuthMode.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    if (isSignUpMode) {
        authTitle.innerText = "Crea tu Perfil";
        nameField.style.display = "block";
        document.getElementById('artistName').setAttribute('required', 'true');
        btnAuthSubmit.innerText = "Crear Cuenta";
        toggleAuthMode.innerText = "Inicia sesión";
    } else {
        authTitle.innerText = "Studio Access";
        nameField.style.display = "none";
        document.getElementById('artistName').removeAttribute('required');
        btnAuthSubmit.innerText = "Ingresar al Studio";
        toggleAuthMode.innerText = "Crea tu cuenta";
    }
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        if (isSignUpMode) {
            const artistName = document.getElementById('artistName').value;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: artistName });
            showToast(`¡Registro brutal! Bienvenido, ${artistName}`);
        } else {
            await signInWithEmailAndPassword(auth, email, password);
            showToast("¡Sesión iniciada en el Studio!");
        }
        authForm.reset();
    } catch (error) {
        showToast("Hubo un rollo: " + error.message);
    }
});

btnLogout.addEventListener('click', () => {
    signOut(auth);
    showToast("Has salido del Studio");
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentArtistName = user.displayName || "Artista";
        userStatusText.innerText = currentArtistName;
        authPanel.style.display = "none";
        uploadPanel.style.display = "block";
    } else {
        currentArtistName = "";
        userStatusText.innerText = "Invitado";
        authPanel.style.display = "block";
        uploadPanel.style.display = "none";
    }
});

// NUEVA FUNCIÓN DE SUBIDA (GUARDA TIPO DE TRACK)
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('trackType').value;
    const title = document.getElementById('songTitle').value;
    const url = document.getElementById('catboxUrl').value;
    const cover = document.getElementById('coverUrl').value;
    
    try {
        await addDoc(collection(db, "canciones"), {
            tipo: type, // <--- Guardamos si es música o podcast
            titulo: title,
            urlCatbox: url,
            portadaUrl: cover,
            artistaId: auth.currentUser.uid,
            nombreArtista: currentArtistName,
            fecha: new Date()
        });
        showToast("¡Lanzamiento en el aire!");
        uploadForm.reset();
    } catch (error) {
        showToast("No se pudo subir: " + error.message);
    }
});
