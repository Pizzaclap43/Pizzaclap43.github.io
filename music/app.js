import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Estado de Playlists de la Nube
let cloudPlaylists = [];
let unsubscribePlaylists = null;

// Estado Favoritos Locales
let favorites = JSON.parse(localStorage.getItem('radioPizzaFavs')) || [];
let isMuted = false;
let previousVolume = 0.8;

// Web Audio API Context
let audioCtx, source;
let eqBands = [];
let isAudioSetup = false;

// Componentes del DOM (Reproductor)
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

// Contenedores Estructurales
const feedsArea = document.getElementById('feedsArea');
const dashboardArea = document.getElementById('dashboardArea');
const btnDashboardToggle = document.getElementById('btnDashboardToggle');

// Contenedores de Feeds
const mixedFeedTitle = document.getElementById('mixedFeedTitle');
const mixedGrid = document.getElementById('mixedGrid');    
const songsGrid = document.getElementById('songsGrid');    
const podcastsGrid = document.getElementById('podcastsGrid'); 

// --- SISTEMA DE NOTIFICACIONES ---
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

// --- LÓGICA DEL PANEL DE CONTROL (DASHBOARD TOGGLE) ---
let inDashboard = false;
btnDashboardToggle.addEventListener('click', () => {
    inDashboard = !inDashboard;
    if (inDashboard) {
        feedsArea.style.display = "none";
        dashboardArea.style.display = "block";
        btnDashboardToggle.innerText = "Volver a Inicio";
    } else {
        feedsArea.style.display = "block";
        dashboardArea.style.display = "none";
        btnDashboardToggle.innerText = "🎛️ Panel de Control";
    }
});


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
            updatePlaylistDropdown(); // Actualiza el check si está en la playlist
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

// Favoritos Locales
playerFavBtn.addEventListener('click', () => {
    if (currentSongIndex === -1 || !currentPlaylist[currentSongIndex]) return;
    const track = currentPlaylist[currentSongIndex];
    if (favorites.includes(track.id)) {
        favorites = favorites.filter(id => id !== track.id);
        showToast("Removido de favoritos locales");
    } else {
        favorites.push(track.id);
        showToast("¡Agregado a tus favoritos locales! ❤️");
    }
    localStorage.setItem('radioPizzaFavs', JSON.stringify(favorites));
    updateFavIconState();
});

function updateFavIconState() {
    if (currentSongIndex === -1 || !currentPlaylist[currentSongIndex]) return;
    const isFav = favorites.includes(currentPlaylist[currentSongIndex].id);
    playerFavBtn.innerHTML = `<i class="${isFav ? 'fas' : 'far'} fa-heart" style="color: ${isFav ? 'var(--pizza-red)' : 'inherit'}"></i>`;
}

// Control EQ
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


// --- RENDERS MULTIPLES (MÚSICA, PODCASTS Y MIXTO) ---
function renderTracks(tracksList, container) {
    container.innerHTML = "";
    if (tracksList.length === 0) {
        container.innerHTML = "<p style='color: var(--text-muted);'>No hay nada por aquí...</p>";
        return;
    }
    tracksList.forEach((s, index) => {
        const div = document.createElement('div');
        div.className = 'song-card';
        
        const iconClass = s.tipo === 'podcast' ? 'fa-microphone' : 'fa-music';
        const coverHtml = s.portadaUrl 
            ? `<img src="${s.portadaUrl}" class="cover-img" alt="Portada">` 
            : `<i class="fa-solid ${iconClass}" style="font-size:40px; color:#222;"></i>`;

        const albumName = s.album || "Sencillo";

        div.innerHTML = `
            <div class="cover-placeholder">
                ${coverHtml}
            </div>
            <span class="album-tag"><i class="fas fa-compact-disc"></i> ${albumName}</span>
            <h4>${s.titulo}</h4>
            <p>${s.nombreArtista}</p>
        `;
        
        div.onclick = () => {
            currentPlaylist = tracksList; 
            currentSongIndex = index;
            loadAndPlaySong(currentPlaylist[currentSongIndex]);
        };
        container.appendChild(div);
    });
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    const filteredMixed = allSongs.filter(s => 
        (s.titulo.toLowerCase().includes(term) || s.nombreArtista.toLowerCase().includes(term) || (s.album && s.album.toLowerCase().includes(term)))
    );
    const filteredMusic = allSongs.filter(s => s.tipo !== 'podcast' && 
        (s.titulo.toLowerCase().includes(term) || s.nombreArtista.toLowerCase().includes(term) || (s.album && s.album.toLowerCase().includes(term)))
    );
    const filteredPodcasts = allSongs.filter(s => s.tipo === 'podcast' && 
        (s.titulo.toLowerCase().includes(term) || s.nombreArtista.toLowerCase().includes(term) || (s.album && s.album.toLowerCase().includes(term)))
    );
    
    mixedFeedTitle.innerHTML = "🔥 Resultados de Búsqueda";
    renderTracks(filteredMixed, mixedGrid);
    renderTracks(filteredMusic, songsGrid);
    renderTracks(filteredPodcasts, podcastsGrid);
});

// Listener Global de Canciones
const q = query(collection(db, "canciones"), orderBy("fecha", "desc"));
onSnapshot(q, (snapshot) => {
    allSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    allSongs.forEach(s => { if(!s.tipo) s.tipo = 'musica'; });

    if(searchInput.value === "") {
        mixedFeedTitle.innerHTML = "🔥 Novedades (Descubre)";
        const musicList = allSongs.filter(s => s.tipo === 'musica');
        const podcastList = allSongs.filter(s => s.tipo === 'podcast');
        renderTracks(allSongs, mixedGrid); 
        renderTracks(musicList, songsGrid);
        renderTracks(podcastList, podcastsGrid);
    }
});


// --- FLUJO DE AUTENTICACIÓN Y PANELES ---
const authPanel = document.getElementById('authPanel');
const playlistsPanel = document.getElementById('playlistsPanel');
const profilePanel = document.getElementById('profilePanel');
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
            showToast("¡Sesión iniciada!");
        }
        authForm.reset();
    } catch (error) {
        showToast("Hubo un rollo: " + error.message);
    }
});

btnLogout.addEventListener('click', () => {
    signOut(auth);
    showToast("Has cerrado sesión");
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentArtistName = user.displayName || "Artista";
        userStatusText.innerText = currentArtistName;
        
        authPanel.style.display = "none";
        playlistsPanel.style.display = "block";
        profilePanel.style.display = "block";
        btnDashboardToggle.style.display = "block";

        // Suscribirse a las playlists del usuario
        const pq = query(collection(db, "playlists"), where("creadorId", "==", user.uid));
        unsubscribePlaylists = onSnapshot(pq, (snapshot) => {
            cloudPlaylists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderCloudPlaylistsUI();
        });

    } else {
        currentArtistName = "";
        userStatusText.innerText = "Invitado";
        
        authPanel.style.display = "block";
        playlistsPanel.style.display = "none";
        profilePanel.style.display = "none";
        btnDashboardToggle.style.display = "none";
        
        // Resetear vista al inicio si cerró sesión
        inDashboard = false;
        feedsArea.style.display = "block";
        dashboardArea.style.display = "none";
        btnDashboardToggle.innerText = "🎛️ Panel de Control";

        if (unsubscribePlaylists) unsubscribePlaylists();
        cloudPlaylists = [];
        renderCloudPlaylistsUI();
    }
});

// SUBIDA DE AUDIO (DASHBOARD)
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('trackType').value;
    const albumName = document.getElementById('albumTitle').value;
    const title = document.getElementById('songTitle').value;
    const url = document.getElementById('catboxUrl').value;
    const cover = document.getElementById('coverUrl').value;
    
    try {
        await addDoc(collection(db, "canciones"), {
            tipo: type,
            album: albumName || "Sencillo", 
            titulo: title,
            urlCatbox: url,
            portadaUrl: cover,
            artistaId: auth.currentUser.uid,
            nombreArtista: currentArtistName,
            fecha: new Date()
        });
        showToast("¡Lanzamiento en el aire!");
        uploadForm.reset();
        
        // Auto volver al feed principal al publicar
        btnDashboardToggle.click(); 
    } catch (error) {
        showToast("No se pudo subir: " + error.message);
    }
});

// --- LÓGICA DE PLAYLISTS DE LA NUBE ---

// Crear nueva Playlist
document.getElementById('btnCreatePlaylist').addEventListener('click', async () => {
    const inputName = document.getElementById('newPlaylistName');
    const pname = inputName.value.trim();
    if(!pname) return;
    try {
        await addDoc(collection(db, "playlists"), {
            nombre: pname,
            creadorId: auth.currentUser.uid,
            canciones: [], // Array vacío de IDs
            fechaCreacion: new Date()
        });
        showToast(`Playlist "${pname}" creada`);
        inputName.value = "";
    } catch(e) {
        showToast("Error al crear: " + e.message);
    }
});

// Renderizar Playlists en la barra lateral
function renderCloudPlaylistsUI() {
    const listEl = document.getElementById('userPlaylistsList');
    listEl.innerHTML = "";

    if (cloudPlaylists.length === 0) {
        listEl.innerHTML = "<p style='color:var(--text-muted); font-size:12px;'>Aún no tienes listas.</p>";
    } else {
        cloudPlaylists.forEach(p => {
            const div = document.createElement('div');
            div.className = 'playlist-item';
            
            div.innerHTML = `
                <div class="playlist-info" style="flex-grow: 1; cursor: pointer;">
                    <span><i class="fas fa-list"></i> ${p.nombre}</span> 
                    <span style="color:var(--pizza-red); font-size: 11px; margin-left: 8px;">${p.canciones.length} tracks</span>
                </div>
                <button class="btn-delete-playlist" title="Eliminar Playlist"><i class="fas fa-trash"></i></button>
            `;
            
            // Clic en la info reproduce
            div.querySelector('.playlist-info').onclick = () => playCloudPlaylist(p);
            
            // Clic en la papelera elimina
            div.querySelector('.btn-delete-playlist').onclick = (e) => {
                e.stopPropagation();
                deleteCloudPlaylist(p.id, p.nombre);
            };
            
            listEl.appendChild(div);
        });
    }

    // Actualizamos el dropdown del reproductor también
    updatePlaylistDropdown();
}

// Actualizar Dropdown del reproductor según la canción actual
function updatePlaylistDropdown() {
    const dropEl = document.getElementById('playlistDropdown');
    dropEl.innerHTML = "";

    if (cloudPlaylists.length === 0) {
        dropEl.innerHTML = "<div class='playlist-dropdown-item'>No tienes playlists</div>";
        return;
    }

    let currentTrackId = null;
    if (currentSongIndex !== -1 && currentPlaylist[currentSongIndex]) {
        currentTrackId = currentPlaylist[currentSongIndex].id;
    }

    cloudPlaylists.forEach(p => {
        const dropItem = document.createElement('div');
        dropItem.className = 'playlist-dropdown-item';
        
        // Si el track actual ya está en la lista, mostrar opción para quitarlo
        if (currentTrackId && p.canciones.includes(currentTrackId)) {
            dropItem.innerHTML = `<i class="fas fa-check" style="color:var(--pizza-red)"></i> ${p.nombre}`;
            dropItem.onclick = (e) => {
                e.stopPropagation();
                removeCurrentSongFromCloudPlaylist(p.id, p.nombre);
                dropEl.classList.remove('show');
            };
        } else {
            // Si no está, mostrar opción para agregarlo
            dropItem.innerHTML = `+ ${p.nombre}`;
            dropItem.onclick = (e) => {
                e.stopPropagation();
                addCurrentSongToCloudPlaylist(p.id, p.nombre);
                dropEl.classList.remove('show');
            };
        }
        dropEl.appendChild(dropItem);
    });
}

// Reproducir una playlist
function playCloudPlaylist(playlist) {
    if (playlist.canciones.length === 0) {
        showToast("Esa playlist está vacía chamo 🤷‍♂️");
        return;
    }
    // Mapeamos los IDs de la playlist a los objetos reales de canciones
    const tracksToPlay = playlist.canciones.map(id => allSongs.find(s => s.id === id)).filter(Boolean);
    
    // Cambiamos la vista principal a la playlist seleccionada
    mixedFeedTitle.innerHTML = `🎧 Playlist: ${playlist.nombre}`;
    renderTracks(tracksToPlay, mixedGrid);
    
    // Auto-Play del primer track de la lista
    currentPlaylist = tracksToPlay;
    currentSongIndex = 0;
    loadAndPlaySong(currentPlaylist[currentSongIndex]);
    
    // Scrollear hacia arriba para que el usuario vea la playlist
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Borrar Playlist completa de Firebase
async function deleteCloudPlaylist(playlistId, playlistName) {
    if (confirm(`¿Seguro que quieres borrar la playlist "${playlistName}" pa' siempre?`)) {
        try {
            await deleteDoc(doc(db, "playlists", playlistId));
            showToast(`Playlist "${playlistName}" borrada`);
        } catch(e) {
            showToast("Error al borrar: " + e.message);
        }
    }
}

// Lógica del botón + en el reproductor
const btnAddToPlaylist = document.getElementById('btnAddToPlaylist');
const playlistDropdown = document.getElementById('playlistDropdown');

btnAddToPlaylist.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!auth.currentUser) {
        showToast("Debes iniciar sesión para usar playlists");
        return;
    }
    if (currentSongIndex === -1 || !currentPlaylist[currentSongIndex]) {
        showToast("Reproduce un track primero");
        return;
    }
    playlistDropdown.classList.toggle('show');
});

// Cerrar dropdown al hacer click afuera
window.addEventListener('click', () => {
    playlistDropdown.classList.remove('show');
});

// Agregar a Firebase
async function addCurrentSongToCloudPlaylist(playlistId, playlistName) {
    if (currentSongIndex === -1 || !currentPlaylist[currentSongIndex]) return;
    const trackId = currentPlaylist[currentSongIndex].id;
    
    try {
        const playlistRef = doc(db, "playlists", playlistId);
        await updateDoc(playlistRef, {
            canciones: arrayUnion(trackId) // arrayUnion asegura que no se duplique
        });
        showToast(`Guardado en "${playlistName}"`);
    } catch(e) {
        showToast("Error al guardar: " + e.message);
    }
}

// Quitar de Firebase
async function removeCurrentSongFromCloudPlaylist(playlistId, playlistName) {
    if (currentSongIndex === -1 || !currentPlaylist[currentSongIndex]) return;
    const trackId = currentPlaylist[currentSongIndex].id;
    
    try {
        const playlistRef = doc(db, "playlists", playlistId);
        await updateDoc(playlistRef, {
            canciones: arrayRemove(trackId) // arrayRemove saca ese ID del arreglo
        });
        showToast(`Eliminado de "${playlistName}"`);
    } catch(e) {
        showToast("Error al quitar: " + e.message);
    }
}
