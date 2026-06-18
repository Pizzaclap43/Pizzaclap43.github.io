// Importamos los módulos oficiales de Firebase directamente desde la CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuración de tu proyecto Pizza Music
const firebaseConfig = {
  apiKey: "AIzaSyCWx8kKQYe11_urooRTCfvBcC20xlIfMes",
  authDomain: "pizza-music-eab88.firebaseapp.com",
  projectId: "pizza-music-eab88",
  storageBucket: "pizza-music-eab88.firebasestorage.app",
  messagingSenderId: "678682489891",
  appId: "1:678682489891:web:e9b3ede88d2acd7ff3ed96",
  measurementId: "G-T72Y6QRH6L"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Variables de estado local
let isSignUpMode = false;
let currentArtistName = "";

// Elementos del DOM
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
const songsGrid = document.getElementById('songsGrid');

// --- 1. GESTIÓN DE USUARIOS (AUTHENTICATION) ---

// Cambiar entre modo Iniciar Sesión y Registro
toggleAuthMode.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    if (isSignUpMode) {
        authTitle.innerText = "Registrarse como Artista";
        nameField.style.display = "block";
        document.getElementById('artistName').setAttribute('required', 'true');
        btnAuthSubmit.innerText = "Crear Cuenta";
        toggleAuthMode.innerText = "Inicia sesión aquí";
    } else {
        authTitle.innerText = "Iniciar Sesión";
        nameField.style.display = "none";
        document.getElementById('artistName').removeAttribute('required');
        btnAuthSubmit.innerText = "Entrar";
        toggleAuthMode.innerText = "Regístrate como artista";
    }
});

// Manejar el submit del Formulario de Autenticación
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        if (isSignUpMode) {
            const artistName = document.getElementById('artistName').value;
            // Registrar usuario
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Guardar el nombre artístico en el perfil de Firebase Auth
            await updateProfile(userCredential.user, { displayName: artistName });
            alert(`¡Registro exitoso, pana! Bienvenido, ${artistName}`);
        } else {
            // Iniciar sesión
            await signInWithEmailAndPassword(auth, email, password);
            alert("¡De vuelta al juego! Sesión iniciada.");
        }
        authForm.reset();
    } catch (error) {
        console.error("Error en autenticación:", error);
        alert("Epa, ocurrió un error: " + error.message);
    }
});

// Cerrar sesión
btnLogout.addEventListener('click', () => {
    signOut(auth).then(() => {
        alert("Sesión cerrada correctamente.");
    });
});

// Escuchar los cambios del estado del usuario (Si entra o sale)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario logueado
        currentArtistName = user.displayName || "Artista Anónimo";
        userStatusText.innerText = `Artista: ${currentArtistName}`;
        authPanel.style.display = "none";
        uploadPanel.style.display = "block";
    } else {
        // Usuario deslogueado
        currentArtistName = "";
        userStatusText.innerText = "Invitado";
        authPanel.style.display = "block";
        uploadPanel.style.display = "none";
    }
});


// --- 2. GESTIÓN DE MÚSICA (FIRESTORE REALTIME) ---

// Subir una canción a Firestore usando el link de Catbox
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
            fecha: new Date() // Para ordenar los temas cronológicamente
        });
        
        alert("¡Tema publicado con éxito, chamo! Ya se puede escuchar en el feed.");
        uploadForm.reset();
    } catch (error) {
        console.error("Error al subir el tema:", error);
        alert("No se pudo publicar la canción: " + error.message);
    }
});

// Escuchar los datos de Firestore en tiempo real para renderizar las canciones
const q = query(collection(db, "canciones"), orderBy("fecha", "desc"));

onSnapshot(q, (querySnapshot) => {
    songsGrid.innerHTML = ""; // Limpiamos la rejilla
    
    if (querySnapshot.empty) {
        songsGrid.innerHTML = `<p class="loading-text">No hay canciones publicadas todavía. ¡Sé el primero!</p>`;
        return;
    }
    
    querySnapshot.forEach((doc) => {
        const cancion = doc.data();
        
        // Estructura HTML de cada tarjeta de canción
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        songCard.innerHTML = `
            <div class="song-info">
                <h4>${cancion.titulo}</h4>
                <p>Por: ${cancion.nombreArtista}</p>
            </div>
            <audio controls preload="none">
                <source src="${cancion.urlCatbox}" type="audio/mpeg">
                Tu navegador no soporta el reproductor de audio.
            </audio>
        `;
        songsGrid.appendChild(songCard);
    });
});
