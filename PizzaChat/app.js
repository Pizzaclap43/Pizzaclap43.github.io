import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, serverTimestamp, query, limitToLast, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

let currentUser = null;
let activeChatId = null;

// --- Lógica de Seguridad para Mensajes ---
function renderMessage(data) {
    const container = document.getElementById('messages-container');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${data.senderId === auth.currentUser.uid ? 'me' : 'them'}`;

    // Protección contra XSS usando textContent
    const textNode = document.createElement('p');
    textNode.textContent = data.text;
    msgDiv.appendChild(textNode);

    // Detección de archivos por URL
    if (data.text.match(/\.(jpeg|jpg|gif|png)$/) != null) {
        const img = document.createElement('img');
        img.src = data.text;
        img.style.maxWidth = "100%";
        msgDiv.appendChild(img);
    } else if (data.text.match(/\.(mp4|webm)$/) != null) {
        const video = document.createElement('video');
        video.src = data.text;
        video.controls = true;
        video.style.maxWidth = "100%";
        msgDiv.appendChild(video);
    }

    // Check de lectura
    const status = document.createElement('span');
    status.className = "status-tick";
    status.textContent = data.read ? " ✓✓" : " ✓";
    msgDiv.appendChild(status);

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

// --- Manejo de Teclado (Híbrido) ---
const input = document.getElementById('message-input');
input.addEventListener('keydown', (e) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (e.key === 'Enter') {
        if (!isMobile && e.shiftKey) {
            // Shift + Enter en PC: Salto de línea (comportamiento default)
        } else if (!isMobile && !e.shiftKey) {
            // Enter solo en PC: Enviar
            e.preventDefault();
            sendMessage();
        } else if (isMobile) {
            // Enter en Móvil: Enviar
            e.preventDefault();
            sendMessage();
        }
    }
});

async function sendMessage() {
    const text = input.value.trim();
    if (!text || !activeChatId) return;

    const msgRef = ref(db, `messages/${activeChatId}`);
    await push(msgRef, {
        senderId: auth.currentUser.uid,
        text: text,
        timestamp: serverTimestamp(),
        read: false
    });

    input.value = '';
}

// --- Notificaciones ---
function notifyUser(msg) {
    if (document.hidden && Notification.permission === "granted") {
        new Notification("Nuevo mensaje en PizzaChat", { body: msg });
    }
}

if (Notification.permission !== "denied") {
    Notification.requestPermission();
}

// --- Autenticación y Perfil ---
document.getElementById('btn-login').onclick = () => {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(err => alert(err.message));
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        loadUserProfile(user.uid);
    } else {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');
    }
});

function loadUserProfile(uid) {
    onValue(ref(db, `users/${uid}`), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById('my-name').textContent = data.name;
            document.getElementById('my-avatar').src = data.photo || "https://via.placeholder.com/40";
            document.documentElement.setAttribute('data-theme', data.theme || 'system');
        }
    });
}
