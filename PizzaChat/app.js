import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, serverTimestamp, query, limitToLast } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_o9hukEo6Pol4NcncYmP_9M5ltGfFHqQ",
    authDomain: "pizzachat-f44a8.firebaseapp.com",
    databaseURL: "https://pizzachat-f44a8-default-rtdb.firebaseio.com",
    projectId: "pizzachat-f44a8",
    storageBucket: "pizzachat-f44a8.firebasestorage.app",
    messagingSenderId: "744384846729",
    appId: "1:744384846729:web:02d5072be2e0b4cb885f58",
    measurementId: "G-XSLQ7MRW2P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- UTILIDADES ---
const safeText = (text) => {
    const span = document.createElement('span');
    span.textContent = text;
    return span.innerHTML;
};

// Detectar si es móvil
const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

// --- MANEJO DE MENSAJES ---
function renderMessage(data, isMe) {
    const container = document.getElementById('messages-container');
    const div = document.createElement('div');
    div.className = `message ${isMe ? 'me' : 'them'}`;
    
    // Texto seguro
    const textNode = document.createTextNode(data.text);
    div.appendChild(textNode);

    // Detección de multimedia simple (URLs)
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const matches = data.text.match(urlPattern);
    
    if(matches) {
        matches.forEach(url => {
            if(url.match(/\.(jpeg|jpg|gif|png)$/)) {
                const img = document.createElement('img');
                img.src = url;
                img.className = "media-content";
                div.appendChild(img);
            } else if(url.match(/\.(mp4|webm)$/)) {
                const vid = document.createElement('video');
                vid.src = url;
                vid.controls = true;
                vid.className = "media-content";
                div.appendChild(vid);
            }
        });
    }

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// --- LOGICA DE ENTRADA ---
document.getElementById('message-input').addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        if (!isMobile() && e.shiftKey) {
            // Salto de línea en PC con Shift+Enter
            return;
        } else if (!isMobile() && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        } else if (isMobile()) {
            // En móvil, Enter normal envía (o puedes ajustarlo)
            sendMessage();
        }
    }
});

function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (!text || !auth.currentUser) return;

    const chatRef = ref(db, `messages/global_chat`); // Ejemplo simple de canal global
    push(chatRef, {
        uid: auth.currentUser.uid,
        text: text, // Para cifrado real, usa una librería como CryptoJS aquí
        timestamp: serverTimestamp(),
        read: false
    });

    input.value = "";
}

// --- AUTENTICACIÓN ---
document.getElementById('login-btn').onclick = () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, e, p).catch(err => alert(err.message));
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
        loadMessages();
    } else {
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('main-screen').classList.add('hidden');
    }
});

function loadMessages() {
    const messagesRef = query(ref(db, `messages/global_chat`), limitToLast(50));
    onValue(messagesRef, (snapshot) => {
        const container = document.getElementById('messages-container');
        container.innerHTML = ""; // Limpiar para recargar (puedes optimizar con child_added)
        snapshot.forEach((child) => {
            const data = child.val();
            renderMessage(data, data.uid === auth.currentUser.uid);
        });
    });
}

// --- TEMAS ---
const setTheme = (theme) => {
    if (theme === 'system') {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
};
setTheme('system'); // Por defecto
