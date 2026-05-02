import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, serverTimestamp, query, limitToLast, orderByKey, get, endBefore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
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
let oldestKey = null;
let cargandoAnteriores = false;
const inputMsg = document.getElementById('mensaje');

// --- DETECTORES DE CONTENIDO ---
const esImagen = (url) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(url.split('?')[0]);
const esAudio = (url) => /\.(mp3|wav|ogg)$/i.test(url.split('?')[0]);
const obtenerIdYoutube = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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

// --- CONSTRUCTOR DE MENSAJES ---
const crearDivMensaje = (data, key) => {
    const div = document.createElement('div'); 
    div.className = 'msg';
    div.setAttribute('data-key', key);
    
    const authSpan = document.createElement('span'); 
    authSpan.className = 'msg-author';
    authSpan.textContent = data.nombre || data.usuario.split('@')[0];
    div.appendChild(authSpan);

    const txtSpan = document.createElement('span'); 
    txtSpan.className = 'msg-text';
    
    data.texto.split(' ').forEach((palabra, i, arr) => {
        if (palabra.startsWith('http')) {
            const link = document.createElement('a');
            link.href = palabra; link.textContent = palabra;
            link.target = "_blank"; link.rel = "noopener";
            link.style.color = "#3498db";
            txtSpan.appendChild(link);
        } else {
            txtSpan.appendChild(document.createTextNode(palabra));
        }
        if (i < arr.length - 1) txtSpan.appendChild(document.createTextNode(' '));
    });
    div.appendChild(txtSpan);

    const contenido = data.texto.trim();
    const ytId = obtenerIdYoutube(contenido);

    if (esImagen(contenido)) {
        const img = document.createElement('img'); img.src = contenido;
        img.className = 'preview-media'; div.appendChild(img);
    } else if (esAudio(contenido)) {
        const aud = document.createElement('audio'); aud.src = contenido;
        aud.controls = true; aud.style.width = "100%"; div.appendChild(aud);
    } else if (ytId) {
        const con = document.createElement('div'); con.className = 'yt-container';
        con.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}" allowfullscreen></iframe>`;
        div.appendChild(con);
    }
    return div;
};

// --- PAGINACIÓN (CARGAR MENSAJES ANTERIORES) ---
const cargarMensajesAnteriores = async () => {
    if (cargandoAnteriores || !oldestKey) return;
    cargandoAnteriores = true;
    const loadBtn = document.getElementById('load-more');
    loadBtn.classList.remove('hidden');

    const q = query(chatRef, orderByKey(), endBefore(oldestKey), limitToLast(15));
    const snapshot = await get(q);
    const chatBox = document.getElementById('chat');

    const mensajesNuevos = [];
    snapshot.forEach(child => { 
        mensajesNuevos.push({ key: child.key, data: child.val() }); 
    });

    if (mensajesNuevos.length > 0) {
        oldestKey = mensajesNuevos[0].key;
        const alturaPrevia = chatBox.scrollHeight;
        
        mensajesNuevos.reverse().forEach(item => {
            const div = crearDivMensaje(item.data, item.key);
            loadBtn.after(div);
        });
        chatBox.scrollTop = chatBox.scrollHeight - alturaPrevia;
    }
    loadBtn.classList.add('hidden');
    cargandoAnteriores = false;
};

// --- GESTIÓN DE ESTADO ---
onAuthStateChanged(auth, (user) => {
    const splash = document.getElementById('splash-screen');
    const screen = document.getElementById('login-screen');
    const chatBox = document.getElementById('chat');
    const banner = document.getElementById('verify-banner'), inputArea = document.getElementById('input-area');

    setTimeout(() => { 
        splash.style.opacity = '0'; 
        setTimeout(() => splash.classList.add('hidden'), 500); 
    }, 1500);

    if (user) {
        miUsuario = user; screen.classList.add('hidden');
        if (!user.emailVerified) {
            banner.classList.remove('hidden'); inputArea.classList.add('hidden');
        } else {
            banner.classList.add('hidden'); inputArea.classList.remove('hidden');
            
            // Carga inicial
            const qInicial = query(chatRef, limitToLast(20));
            get(qInicial).then(snap => {
                chatBox.innerHTML = '<div id="load-more" class="hidden">Cargando...</div>';
                const iniciales = [];
                snap.forEach(child => iniciales.push({ key: child.key, data: child.val() }));
                
                if(iniciales.length > 0) {
                    oldestKey = iniciales[0].key;
                    iniciales.forEach(m => chatBox.appendChild(crearDivMensaje(m.data, m.key)));
                    chatBox.scrollTop = chatBox.scrollHeight;
                }
                
                // Escuchar nuevos
                onChildAdded(chatRef, (newSnap) => {
                    if (document.querySelector(`[data-key="${newSnap.key}"]`)) return;
                    chatBox.appendChild(crearDivMensaje(newSnap.val(), newSnap.key));
                    chatBox.scrollTop = chatBox.scrollHeight;
                });
            });
        }
    } else { miUsuario = null; screen.classList.remove('hidden'); }
});

// Detectar Scroll arriba
document.getElementById('chat').onscroll = function() {
    if (this.scrollTop === 0) cargarMensajesAnteriores();
};

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

window.restablecerClave = async () => {
    const email = document.getElementById('email').value;
    if (!email) return alert("Escribe tu correo primero.");
    try { await sendPasswordResetEmail(auth, email); alert("Enlace enviado."); } catch { alert("Error."); }
};

document.getElementById('btnEntrar').onclick = async () => {
    const e = document.getElementById('email').value, p = document.getElementById('pass').value;
    try { await signInWithEmailAndPassword(auth, e, p); } catch { alert("Error al entrar."); }
};

document.getElementById('btnRegistro').onclick = async () => {
    const e = document.getElementById('email').value, p = document.getElementById('pass').value, n = document.getElementById('nickname').value;
    if(!n) return alert("Pon un apodo.");
    try {
        const res = await createUserWithEmailAndPassword(auth, e, p);
        await updateProfile(res.user, { displayName: n });
        await sendEmailVerification(res.user);
        alert("Verifica tu correo.");
    } catch { alert("Error al registrar."); }
};

// Ajuste automático de textarea
inputMsg.oninput = function() { this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'; };
inputMsg.onkeydown = (e) => { if (e.key === 'Enter' && !/Android|iPhone/i.test(navigator.userAgent) && !e.shiftKey) { e.preventDefault(); enviar(); } };
