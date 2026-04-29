import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, sendEmailVerification, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configuración de Firebase (Usamos solo Auth y Database)
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
    } else { document.body.classList.remove('dark'); }
};

document.getElementById('theme-selector').onchange = (e) => {
    aplicarTema(e.target.value);
    localStorage.setItem('piz-theme', e.target.value);
};
aplicarTema(localStorage.getItem('piz-theme') || 'system');

// --- AUTENTICACIÓN (Igual que antes) ---
window.restablecerClave = async () => {
    const email = document.getElementById('email').value;
    if (!email) { errorArea.innerText = "Escribe tu correo."; return; }
    try { await sendPasswordResetEmail(auth, email); alert("Correo enviado."); } catch (e) { errorArea.innerText = "Error."; }
};

document.getElementById('btnEntrar').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    try { await signInWithEmailAndPassword(auth, email, pass); } catch (e) { errorArea.innerText = "Error de acceso."; }
};

document.getElementById('btnRegistro').onclick = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const nick = document.getElementById('nickname').value;
    if(!nick) return errorArea.innerText = "Pon un apodo.";
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(res.user, { displayName: nick });
        await sendEmailVerification(res.user);
        alert("¡Cuenta lista! Verifica tu correo.");
    } catch (e) { errorArea.innerText = "Error al registrar."; }
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
            chatBox.innerHTML = "<p style='text-align:center;'>Verifica tu cuenta.</p>";
        } else {
            banner.classList.add('hidden'); inputArea.classList.remove('hidden'); chatBox.innerHTML = "";
            onChildAdded(chatRef, (snap) => {
                const data = snap.val();
                const div = document.createElement('div'); div.className = 'msg';
                const authSpan = document.createElement('span'); authSpan.className = 'msg-author';
                authSpan.textContent = data.nombre || data.usuario.split('@')[0];
                div.appendChild(authSpan);

                if (data.texto && !data.tipo) {
                    const txt = document.createElement('span'); txt.className = 'msg-text';
                    txt.textContent = data.texto; div.appendChild(txt);
                }

                if (data.tipo) {
                    if (data.tipo.startsWith('image/')) {
                        const img = document.createElement('img'); img.src = data.texto; img.className = 'msg-media'; div.appendChild(img);
                    } else if (data.tipo.startsWith('video/')) {
                        const vid = document.createElement('video'); vid.src = data.texto; vid.controls = true; vid.className = 'msg-media'; div.appendChild(vid);
                    } else if (data.tipo.startsWith('audio/')) {
                        const aud = document.createElement('audio'); aud.src = data.texto; aud.controls = true; aud.style.width = "100%"; div.appendChild(aud);
                    } else {
                        const doc = document.createElement('a'); doc.href = data.texto; doc.innerText = `📄 ${data.nArchivo || 'Doc'}`; doc.target = "_blank"; doc.className = 'msg-file'; div.appendChild(doc);
                    }
                }
                chatBox.appendChild(div); chatBox.scrollTop = chatBox.scrollHeight;
            });
        }
    } else { miUsuario = null; screen.classList.remove('hidden'); banner.classList.add('hidden'); }
});

// --- SUBIDA A CATBOX (La parte nueva) ---
document.getElementById('btnAdjuntar').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file || !miUsuario) return;

    errorArea.innerText = "Subiendo a Catbox... 🚀";
    errorArea.style.color = "var(--piz-orange)";

    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', file);

    try {
        // Usamos un proxy para saltar el bloqueo de CORS de la API de Catbox
        const proxyUrl = 'https://corsproxy.io/?';
        const targetUrl = 'https://catbox.moe/user/api.php';
        
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Error en subida');
        
        const fileUrl = await response.text();

        push(chatRef, {
            nombre: miUsuario.displayName || miUsuario.email.split('@')[0],
            usuario: miUsuario.email,
            texto: fileUrl,
            tipo: file.type,
            nArchivo: file.name,
            timestamp: serverTimestamp()
        });
        errorArea.innerText = "";
    } catch (err) {
        errorArea.innerText = "Error al subir archivo.";
        errorArea.style.color = "red";
    }
};

// --- ENVÍO DE TEXTO ---
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
    const isMob = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (e.key === 'Enter' && !isMob && !e.shiftKey) { e.preventDefault(); enviar(); }
};
