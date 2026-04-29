import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, sendEmailVerification, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

// --- DETECTORES DE CONTENIDO ---
const esImagen = (url) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(url.split('?')[0]);
const obtenerIdYoutube = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Función para convertir URLs de texto en enlaces cliqueables
const linkify = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
};

// --- LÓGICA DE TEMAS ---
const aplicarTema = (t) => {
    if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark');
    } else { document.body.classList.remove('dark'); }
};
document.getElementById('theme-selector').onchange = (e) => {
    aplicarTema(e.target.value);
    localStorage.setItem('piz-theme', e.target.value);
};
aplicarTema(localStorage.getItem('piz-theme') || 'system');

// --- AUTENTICACIÓN ---
document.getElementById('btnEntrar').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    try { await signInWithEmailAndPassword(auth, email, pass); } catch (e) { alert("Error al entrar."); }
};
document.getElementById('btnRegistro').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const nick = document.getElementById('nickname').value;
    if(!nick) return alert("Pon un apodo.");
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(res.user, { displayName: nick });
        await sendEmailVerification(res.user);
        alert("¡Cuenta creada! Verifica tu correo.");
    } catch (e) { alert("Error al registrar."); }
};
document.getElementById('btnSalir').onclick = () => signOut(auth);
window.reviarVerificacion = () => auth.currentUser.reload().then(() => location.reload());

onAuthStateChanged(auth, (user) => {
    const screen = document.getElementById('login-screen'), chatBox = document.getElementById('chat');
    const banner = document.getElementById('verify-banner'), inputArea = document.getElementById('input-area');
    if (user) {
        miUsuario = user; screen.classList.add('hidden');
        if (!user.emailVerified) {
            banner.classList.remove('hidden'); inputArea.classList.add('hidden');
        } else {
            banner.classList.add('hidden'); inputArea.classList.remove('hidden'); chatBox.innerHTML = "";
            onChildAdded(chatRef, (snap) => {
                const data = snap.val();
                const div = document.createElement('div'); div.className = 'msg';
                const authSpan = document.createElement('span'); authSpan.className = 'msg-author';
                authSpan.textContent = data.nombre || data.usuario.split('@')[0];
                div.appendChild(authSpan);

                const txtSpan = document.createElement('span');
                txtSpan.className = 'msg-text';
                txtSpan.innerHTML = linkify(data.texto);
                div.appendChild(txtSpan);

                // --- DETECCION MULTIMEDIA ---
                const contenido = data.texto.trim();
                const ytId = obtenerIdYoutube(contenido);

                if (esImagen(contenido)) {
                    const img = document.createElement('img'); img.src = contenido; img.className = 'preview-media'; div.appendChild(img);
                } else if (ytId) {
                    const container = document.createElement('div'); container.className = 'yt-container';
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${ytId}`;
                    iframe.allowFullscreen = true;
                    container.appendChild(iframe); div.appendChild(container);
                }

                chatBox.appendChild(div);
                chatBox.scrollTop = chatBox.scrollHeight;
            });
        }
    } else { miUsuario = null; screen.classList.remove('hidden'); }
});

// --- ENVÍO ---
const enviar = () => {
    if (inputMsg.value.trim() && miUsuario?.emailVerified) {
        push(chatRef, {
            nombre: miUsuario.displayName || miUsuario.email.split('@')[0],
            usuario: miUsuario.email,
            texto: inputMsg.value,
            timestamp: serverTimestamp()
        });
        inputMsg.value = ""; inputMsg.style.height = 'auto';
    }
};
document.getElementById('btnEnviar').onclick = enviar;
inputMsg.oninput = function() { this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'; };
inputMsg.onkeydown = (e) => {
    if (e.key === 'Enter' && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && !e.shiftKey) {
        e.preventDefault(); enviar();
    }
};
