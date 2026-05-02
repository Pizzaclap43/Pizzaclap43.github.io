import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, serverTimestamp, query, limitToLast, orderByKey, get, endBefore, startAfter } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
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
let oldestKey = null; // Para historial hacia atrás
let latestKey = null; // Para evitar duplicados en tiempo real
let cargandoAnteriores = false;
const inputMsg = document.getElementById('mensaje');

// --- UTILIDADES ---
const esImagen = (url) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(url.split('?')[0]);
const esAudio = (url) => /\.(mp3|wav|ogg)$/i.test(url.split('?')[0]);
const obtenerIdYoutube = (url) => {
    const reg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const m = url.match(reg); return (m && m[2].length === 11) ? m[2] : null;
};

// Crear elemento visual del mensaje
const crearDivMensaje = (data, key) => {
    const div = document.createElement('div');
    div.className = 'msg';
    div.setAttribute('data-key', key);
    
    const authSpan = document.createElement('span');
    authSpan.className = 'msg-author';
    authSpan.textContent = data.nombre || data.usuario.split('@')[0];
    
    const txtSpan = document.createElement('span');
    txtSpan.className = 'msg-text';
    
    data.texto.split(' ').forEach((palabra, i, arr) => {
        if (palabra.startsWith('http')) {
            const link = document.createElement('a');
            link.href = palabra; link.textContent = palabra;
            link.target = "_blank"; link.style.color = "#3498db";
            txtSpan.appendChild(link);
        } else {
            txtSpan.appendChild(document.createTextNode(palabra));
        }
        if (i < arr.length - 1) txtSpan.appendChild(document.createTextNode(' '));
    });

    div.append(authSpan, txtSpan);

    const txt = data.texto.trim();
    const ytId = obtenerIdYoutube(txt);
    if (esImagen(txt)) {
        const img = document.createElement('img'); img.src = txt; img.className = 'preview-media';
        div.appendChild(img);
    } else if (esAudio(txt)) {
        const aud = document.createElement('audio'); aud.src = txt; aud.controls = true; aud.style.width="100%";
        div.appendChild(aud);
    } else if (ytId) {
        const c = document.createElement('div'); c.className = 'yt-container';
        c.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}" allowfullscreen></iframe>`;
        div.appendChild(c);
    }
    return div;
};

// --- PAGINACIÓN ---
const cargarMensajesAnteriores = async () => {
    if (cargandoAnteriores || !oldestKey) return;
    cargandoAnteriores = true;
    const loadBtn = document.getElementById('load-more');
    loadBtn.classList.remove('hidden');

    const q = query(chatRef, orderByKey(), endBefore(oldestKey), limitToLast(15));
    const snap = await get(q);
    const chatBox = document.getElementById('chat');

    const anteriores = [];
    snap.forEach(child => anteriores.push({ key: child.key, data: child.val() }));

    if (anteriores.length > 0) {
        oldestKey = anteriores[0].key;
        const hPrev = chatBox.scrollHeight;
        anteriores.reverse().forEach(m => loadBtn.after(crearDivMensaje(m.data, m.key)));
        chatBox.scrollTop = chatBox.scrollHeight - hPrev;
    }
    loadBtn.classList.add('hidden');
    cargandoAnteriores = false;
};

// --- FLUJO DE USUARIO ---
onAuthStateChanged(auth, (user) => {
    const splash = document.getElementById('splash-screen');
    const login = document.getElementById('login-screen');
    const chatBox = document.getElementById('chat');
    const banner = document.getElementById('verify-banner'), inputArea = document.getElementById('input-area');

    setTimeout(() => { if(splash) { splash.style.opacity='0'; setTimeout(()=>splash.remove(), 400); } }, 1000);

    if (user) {
        miUsuario = user; login.classList.add('hidden');
        if (!user.emailVerified) {
            banner.classList.remove('hidden'); inputArea.classList.add('hidden');
        } else {
            banner.classList.add('hidden'); inputArea.classList.remove('hidden');
            
            // Carga inicial de los últimos 20
            const qInit = query(chatRef, limitToLast(20));
            get(qInit).then(snap => {
                chatBox.innerHTML = '<div id="load-more" class="hidden">Cargando...</div>';
                const msgs = [];
                snap.forEach(c => msgs.push({ key: c.key, data: c.val() }));
                
                if (msgs.length > 0) {
                    oldestKey = msgs[0].key;
                    latestKey = msgs[msgs.length - 1].key;
                    msgs.forEach(m => chatBox.appendChild(crearDivMensaje(m.data, m.key)));
                    chatBox.scrollTop = chatBox.scrollHeight;
                }

                // Escuchar solo lo que viene DESPUÉS de lo cargado
                const qNext = latestKey ? query(chatRef, orderByKey(), startAfter(latestKey)) : chatRef;
                onChildAdded(qNext, (s) => {
                    if (document.querySelector(`[data-key="${s.key}"]`)) return;
                    chatBox.appendChild(crearDivMensaje(s.val(), s.key));
                    chatBox.scrollTop = chatBox.scrollHeight;
                    latestKey = s.key;
                });
            });
        }
    } else { miUsuario = null; login.classList.remove('hidden'); }
});

// --- ACCIONES ---
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
document.getElementById('btnVerificado').onclick = () => location.reload();
document.getElementById('btnSalir').onclick = () => signOut(auth).then(() => location.reload());
document.getElementById('chat').onscroll = function() { if (this.scrollTop === 0) cargarMensajesAnteriores(); };

// Auth Forms
document.getElementById('btnEntrar').onclick = async () => {
    const e = document.getElementById('email').value, p = document.getElementById('pass').value;
    try { await signInWithEmailAndPassword(auth, e, p); } catch { alert("Error de acceso."); }
};

document.getElementById('btnRegistro').onclick = async () => {
    const e = document.getElementById('email').value, p = document.getElementById('pass').value, n = document.getElementById('nickname').value;
    if(!n) return alert("Escribe un apodo.");
    try {
        const r = await createUserWithEmailAndPassword(auth, e, p);
        await updateProfile(r.user, { displayName: n });
        await sendEmailVerification(r.user);
        alert("Verifica tu correo electrónico.");
    } catch { alert("Error al registrar."); }
};

window.restablecerClave = async () => {
    const e = document.getElementById('email').value;
    if(!e) return alert("Escribe tu correo.");
    try { await sendPasswordResetEmail(auth, e); alert("Enlace enviado."); } catch { alert("Error."); }
};

// Temas y UI
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

inputMsg.oninput = function() { this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'; };
inputMsg.onkeydown = (e) => { if (e.key === 'Enter' && !/Android|iPhone/i.test(navigator.userAgent) && !e.shiftKey) { e.preventDefault(); enviar(); } };
