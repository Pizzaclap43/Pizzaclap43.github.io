import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuración de Pizza Music con tus credenciales
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
let isSignUpMode = false;
let currentArtistName = "";

// Referencias del DOM
const songsGrid = document.getElementById('songsGrid');
const searchInput = document.getElementById('searchInput');
const mainAudio = document.getElementById('mainAudio');
const globalPlayer = document.getElementById('globalPlayer');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');

// Referencias del DOM para Autenticación
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


// --- 1. LÓGICA DEL BUSCADOR ---
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allSongs.filter(s => 
        s.titulo.toLowerCase().includes(term) || 
        s.nombreArtista.toLowerCase().includes(term)
    );
    renderSongs(filtered);
});


// --- 2. LÓGICA DEL REPRODUCTOR GLOBAL ---
window.playSong = function(url, title, artist) {
    globalPlayer.style.display = "flex"; // Mostramos la barra
    playerTitle.innerText = title;
    playerArtist.innerText = artist;
    mainAudio.src = url;
    mainAudio.play().catch(err => console.log("Esperando interacción del usuario para reproducir"));
}


// --- 3. RENDERIZADO DE CANCIONES ---
function renderSongs(songs) {
    songsGrid.innerHTML = ""; // Limpiar el grid

    if (songs.length === 0) {
        songsGrid.innerHTML = "<p class='status-msg'>No encontramos esa porción de música...</p>";
        return;
    }

    songs.forEach(s => {
        const div = document.createElement('div');
        div.className = 'song-card';
        div.innerHTML = `
            <div class="cover-placeholder">
                <i class="fa-solid fa-music" style="font-size:40px; color:#444;"></i>
            </div>
            <h4>${s.titulo}</h4>
            <p>${s.nombreArtista}</p>
        `;
        // Al hacer clic, enviamos los datos al reproductor global
        div.onclick = () => playSong(s.urlCatbox, s.titulo, s.nombreArtista);
        songsGrid.appendChild(div);
    });
}


// --- 4. TRAER MÚSICA DE FIRESTORE EN TIEMPO REAL ---
const q = query(collection(db, "canciones"), orderBy("fecha", "desc"));
onSnapshot(q, (snapshot) => {
    // Mapeamos los datos y los guardamos en la variable global allSongs
    allSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Si no hay texto en el buscador, mostramos todas
    if(searchInput.value === "") {
        renderSongs(allSongs);
    }
});


// --- 5. LÓGICA DE AUTENTICACIÓN ---

// Alternar entre Iniciar Sesión y Registro
toggleAuthMode.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    if (isSignUpMode) {
        authTitle.innerText = "Registrarse como Artista";
        nameField.style.display = "block";
        document.getElementById('artistName').setAttribute('required', 'true');
        btnAuthSubmit.innerText = "Crear Cuenta";
        toggleAuthMode.innerText = "Inicia sesión aquí";
    } else {
        authTitle.innerText = "Zona de Artistas";
        nameField.style.display = "none";
        document.getElementById('artistName').removeAttribute('required');
        btnAuthSubmit.innerText = "Entrar";
        toggleAuthMode.innerText = "Regístrate";
    }
});

// Enviar formulario de Auth
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        if (isSignUpMode) {
            const artistName = document.getElementById('artistName').value;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: artistName });
            alert(`¡Registro brutal, chamo! Bienvenido a Pizza Music, ${artistName}`);
        } else {
            await signInWithEmailAndPassword(auth, email, password);
            alert("¡De vuelta al ruedo! Sesión iniciada.");
        }
        authForm.reset();
    } catch (error) {
        console.error("Error:", error);
        alert("Epa, hubo un rollo: " + error.message);
    }
});

// Cerrar sesión
btnLogout.addEventListener('click', () => {
    signOut(auth).then(() => {
        alert("Saliste de la cuenta. ¡Nos pillamos luego!");
    });
});

// Escuchar cambios de estado (Login/Logout)
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentArtistName = user.displayName || "Artista Anónimo";
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


// --- 6. SUBIR CANCIONES ---
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
        
        alert("¡Tema montado con éxito! Ya está sonando en la página principal.");
        uploadForm.reset();
    } catch (error) {
        console.error("Error al subir:", error);
        alert("Chamo, no se pudo subir la canción: " + error.message);
    }
});
