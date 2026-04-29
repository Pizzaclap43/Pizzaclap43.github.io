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
const errorArea = document.getElementById('error-msg');
const inputMsg = document.getElementById('mensaje');

// --- TEMAS ---
const aplicarTema = (t) => {
    if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
};

document.getElementById('theme-selector').onchange = (e) => {
    aplicarTema(e.target.value);
    localStorage.setItem('piz-theme', e.target.value);
};

// Cargar tema inicial
const temaGuardado = localStorage.getItem('piz-theme') || 'system';
document.getElementById('theme-selector').value = temaGuardado;
aplicarTema(temaGuardado);

// --- AUTENTICACIÓN ---
window.restablecerClave = async () => {
    const email = document.getElementById('email').value;
    if (!email) { errorArea.innerText = "Escribe tu correo primero."; return; }
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Correo de restablecimiento enviado.");
    } catch (error) { errorArea.innerText = "Error al enviar correo."; }
};

document.getElementById('btnEntrar').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    try { await signInWithEmailAndPassword(auth, email, pass); } 
    catch (error) { errorArea.innerText = "Error: Credenciales incorrectas."; }
};

document.getElementById('btnRegistro').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const nick = document.getElementById('nickname').value;
    if(!nick) { errorArea.innerText = "Elige un apodo."; return; }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: nick });
        await sendEmailVerification(userCredential.user);
        alert("¡Cuenta creada! Verifica tu correo.");
    } catch (error) { errorArea.innerText = "Error al registrar."; }
};

document.getElementById('btnSalir').onclick = () => signOut(auth);

window.reviarVerificacion = () => {
    auth.currentUser.reload().then(() => { location.reload(); });
};

onAuthStateChanged(auth, (user) => {
    const screen = document.getElementById('login-screen');
    const chatBox = document.getElementById('chat');
    const banner = document.getElementById('verify-banner');
    const inputArea = document.getElementById('input-area');

    if (user) {
        miUsuario = user;
        screen.classList.add('hidden');
        
        if (!user.emailVerified) {
            banner.classList.remove('hidden');
            inputArea.classList.add('hidden');
            chatBox.innerHTML = "<p style='text-align:center;'>Verifica tu cuenta para chatear.</p>";
        } else {
            banner.classList.add('hidden');
            inputArea.classList.remove('hidden');
            chatBox.innerHTML = "";
            
            onChildAdded(chatRef, (snapshot) => {
                const data = snapshot.val();
                const div = document.createElement('div');
                div.className = 'msg';
                const spanAuthor = document.createElement('span');
                spanAuthor.className = 'msg-author';
                spanAuthor.textContent = data.nombre || data.usuario.split('@')[0];
                const spanText = document.createElement('span');
                spanText.className = 'msg-text';
                spanText.textContent = data.texto;
                div.appendChild(spanAuthor);
                div.appendChild(spanText);
                chatBox.appendChild(div);
                chatBox.scrollTop = chatBox.scrollHeight;
            });
        }
    } else {
        miUsuario = null;
        screen.classList.remove('hidden');
        banner.classList.add('hidden');
    }
});

// --- MENSAJERÍA ---
const enviar = () => {
    if (inputMsg.value.trim() && miUsuario && miUsuario.emailVerified) {
        push(chatRef, {
            nombre: miUsuario.displayName || miUsuario.email.split('@')[0],
            usuario: miUsuario.email,
            texto: inputMsg.value,
            timestamp: serverTimestamp()
        });
        inputMsg.value = "";
        inputMsg.style.height = 'auto';
    }
};

document.getElementById('btnEnviar').onclick = enviar;

inputMsg.oninput = function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
};

inputMsg.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviar();
    }
};
