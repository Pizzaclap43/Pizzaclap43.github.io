import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_o9hukEo6Pol4NcncYmP_9M5ltGfFHqQ",
    authDomain: "pizzachat-f44a8.firebaseapp.com",
    databaseURL: "https://pizzachat-f44a8-default-rtdb.firebaseio.com",
    projectId: "pizzachat-f44a8",
    storageBucket: "pizzachat-f44a8.firebasestorage.app",
    messagingSenderId: "744384846729",
    appId: "1:744384846729:web:02d5072be2e0b4cb885f58"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const chatRef = ref(db, 'mensajes');

let miUsuario = null;
const inputMsg = document.getElementById('mensaje');
const chatBox = document.getElementById('chat');

const linkify = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
};

// --- AUTENTICACIÓN ---
document.getElementById('btnEntrar').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    try { await signInWithEmailAndPassword(auth, email, pass); } catch (e) { alert("Credenciales incorrectas"); }
};

document.getElementById('btnRegistro').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const nick = document.getElementById('nickname').value;
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(res.user, { displayName: nick });
        await sendEmailVerification(res.user);
        alert("Cuenta creada. Revisa tu correo para verificar.");
    } catch (e) { alert("Error al registrar: " + e.message); }
};

document.getElementById('btnSalir').onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    const login = document.getElementById('login-screen');
    const inputArea = document.getElementById('input-area');
    if (user) {
        miUsuario = user;
        login.classList.add('hidden');
        inputArea.classList.remove('hidden');
        chatBox.innerHTML = ""; // Limpiar antes de cargar
        
        onChildAdded(chatRef, (snap) => {
            const data = snap.val();
            const div = document.createElement('div');
            div.className = 'msg';
            div.innerHTML = `<span class="msg-author">${data.nombre}</span><span class="msg-text">${linkify(data.texto)}</span>`;
            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll al final
        });
    } else {
        miUsuario = null;
        login.classList.remove('hidden');
        inputArea.classList.add('hidden');
    }
});

// --- ENVIAR ---
const enviar = () => {
    const txt = inputMsg.value.trim();
    if (txt && miUsuario) {
        push(chatRef, {
            nombre: miUsuario.displayName || "Anónimo",
            texto: txt,
            timestamp: serverTimestamp()
        });
        inputMsg.value = "";
    }
};

document.getElementById('btnEnviar').onclick = enviar;
inputMsg.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } };

// Temas
document.getElementById('theme-selector').onchange = (e) => {
    document.body.className = e.target.value;
};
