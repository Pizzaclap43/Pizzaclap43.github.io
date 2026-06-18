import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tu Configuración de Pizza Music
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

// Web Audio API (Para el Ecualizador)
let audioCtx, source, bassFilter, midFilter, trebleFilter;
let isAudioSetup = false;

// Referencias del DOM
const songsGrid = document.getElementById('songsGrid');
const searchInput = document.getElementById('searchInput');

// DOM del Reproductor
const mainAudio = document.getElementById('mainAudio');
const globalPlayer = document.getElementById('globalPlayer');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const btnPlayPause = document.getElementById('btnPlayPause');
const btnStop = document.getElementById('btnStop');
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const progressBar = document.getElementById('progressBar');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');
const volBar = document.getElementById('volBar');
const btnEqToggle = document.getElementById('btnEqToggle');
const eqPanel = document.getElementById('eqPanel');

// --- 1. RENDERIZADO Y BÚSQUEDA ---
function renderSongs(songs) {
    songsGrid.innerHTML = "";
    if (songs.length === 0) {
        songsGrid.innerHTML = "<p style='color: #a1a1aa;'>No encontramos ese track...</p>";
        return;
    }
    songs.forEach((s, index) => {
        const div = document.createElement('div');
        div.className = 'song-card';
        div.innerHTML = `
            <div class="cover-placeholder">
                <i class="fa-solid fa-music" style="font-size:50px; color:#333;"></i>
            </div>
            <h4>${s.titulo}</h4>
            <p>${s.nombreArtista}</p>
        `;
        div.onclick = () => {
            currentPlaylist = songs; // La lista actual se basa en la búsqueda
            currentSongIndex = index;
            loadAndPlaySong(currentPlaylist[currentSongIndex]);
        };
        songsGrid.appendChild(div);
    });
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allSongs.filter(s => 
        s.titulo.toLowerCase().includes(term) || 
        s.nombreArtista.toLowerCase().includes(term)
    );
    renderSongs(filtered);
});

// Traer música de Firestore
const q = query(collection(db, "canciones"), orderBy("fecha", "desc"));
onSnapshot(q, (snapshot) => {
    allSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if(searchInput.value === "") {
        currentPlaylist = allSongs;
        renderSongs(allSongs);
    }
});


// --- 2. MOTOR DEL REPRODUCTOR AVANZADO ---

// Configurar Web Audio API (Se ejecuta en la primera interacción)
function setupAudioContext() {
    if (isAudioSetup) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    source = audioCtx.createMediaElementSource(mainAudio);

    // Filtros del EQ
    bassFilter = audioCtx.createBiquadFilter();
    bassFilter.type = "lowshelf";
    bassFilter.frequency.value = 250;

    midFilter = audioCtx.createBiquadFilter();
    midFilter.type = "peaking";
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 1;

    trebleFilter = audioCtx.createBiquadFilter();
    trebleFilter.type = "highshelf";
    trebleFilter.frequency.value = 4000;

    // Conectar nodos: Audio -> Bajo -> Medio -> Brillo -> Salida
    source.connect(bassFilter);
    bassFilter.connect(midFilter);
    midFilter.connect(trebleFilter);
    trebleFilter.connect(audioCtx.destination);
    
    isAudioSetup = true;
}

function loadAndPlaySong(song) {
    if (!song) return;
    setupAudioContext(); // Activamos el EQ si es la primera vez
    if (audioCtx.state === 'suspended') audioCtx.resume();

    globalPlayer.classList.add('active'); // Mostrar panel
    playerTitle.innerText = song.titulo;
    playerArtist.innerText = song.nombreArtista;
    mainAudio.src = song.urlCatbox;
    
    mainAudio.play()
        .then(() => updatePlayBtn(true))
        .catch(err => console.log("Esperando interacción para autoplay"));
}

function updatePlayBtn(isPlaying) {
    btnPlayPause.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
}

// Botones de Control
btnPlayPause.addEventListener('click', () => {
    if (mainAudio.src) {
        if (mainAudio.paused) {
            setupAudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            mainAudio.play();
            updatePlayBtn(true);
        } else {
            mainAudio.pause();
            updatePlayBtn(false);
        }
    }
});

btnStop.addEventListener('click', () => {
    mainAudio.pause();
    mainAudio.currentTime = 0;
    updatePlayBtn(false);
});

btnNext.addEventListener('click', () => {
    if (currentSongIndex < currentPlaylist.length - 1) {
        currentSongIndex++;
        loadAndPlaySong(currentPlaylist[currentSongIndex]);
    } else {
        currentSongIndex = 0; // Vuelve al inicio
        loadAndPlaySong(currentPlaylist[currentSongIndex]);
    }
});

btnPrev.addEventListener('click', () => {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        loadAndPlaySong(currentPlaylist[currentSongIndex]);
    }
});

// Auto-Next cuando termina la canción
mainAudio.addEventListener('ended', () => btnNext.click());

// Formatear Tiempo
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Progreso de la canción
mainAudio.addEventListener('timeupdate', () => {
    const current = mainAudio.currentTime;
    const duration = mainAudio.duration;
    
    timeCurrent.innerText = formatTime(current);
    if (duration) {
        timeTotal.innerText = formatTime(duration);
        progressBar.value = (current / duration) * 100;
    }
});

// Adelantar/Atrasar canción
progressBar.addEventListener('input', () => {
    const duration = mainAudio.duration;
    if (duration) {
        mainAudio.currentTime = (progressBar.value / 100) * duration;
    }
});

// Control de Volumen
volBar.addEventListener('input', (e) => {
    mainAudio.volume = e.target.value;
});

// Controles de Ecualizador (EQ)
btnEqToggle.addEventListener('click', () => {
    eqPanel.classList.toggle('show');
    btnEqToggle.classList.toggle('active');
});

document.getElementById('eqBass').addEventListener('input', (e) => {
    if (bassFilter) bassFilter.gain.value = e.target.value;
});
document.getElementById('eqMid').addEventListener('input', (e) => {
    if (midFilter) midFilter.gain.value = e.target.value;
});
document.getElementById('eqTreble').addEventListener('input', (e) => {
    if (trebleFilter) trebleFilter.gain.value = e.target.value;
});


// --- 3. AUTENTICACIÓN Y SUBIDA (INTACTO) ---
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
            alert(`¡Registro brutal! Bienvenido a Pizza Music, ${artistName}`);
        } else {
            await signInWithEmailAndPassword(auth, email, password);
            alert("¡Adentro del Studio! Sesión iniciada.");
        }
        authForm.reset();
    } catch (error) {
        alert("Hubo un rollo: " + error.message);
    }
});

btnLogout.addEventListener('click', () => signOut(auth));

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

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('songTitle').value;
    const url = document.getElementById('catboxUrl').value;
    
    try {
        await addDoc(collection(db, "canciones"), {
            titulo: title,
            urlCatbox: url,
            artistaId: auth.currentUser.uid,
            nombreArtista: currentArtistName,
            fecha: new Date()
        });
        alert("¡Track montado! Ya está sonando en Pizza Music.");
        uploadForm.reset();
    } catch (error) {
        alert("No se pudo subir: " + error.message);
    }
});
