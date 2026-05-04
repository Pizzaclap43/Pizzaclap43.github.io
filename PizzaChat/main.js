const firebaseConfig = {
    apiKey: "AIzaSyD_o9hukEo6Pol4NcncYmP_9M5ltGfFHqQ",
    authDomain: "pizzachat-f44a8.firebaseapp.com",
    databaseURL: "https://pizzachat-f44a8-default-rtdb.firebaseio.com",
    projectId: "pizzachat-f44a8",
    storageBucket: "pizzachat-f44a8.firebasestorage.app",
    messagingSenderId: "744384846729",
    appId: "1:744384846729:web:02d5072be2e0b4cb885f58"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;
let activeChat = null;

// --- AUTENTICACIÓN ---
function register() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    auth.createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            userCredential.user.sendEmailVerification();
            alert("Verifica tu correo electrónico.");
            db.ref('users/' + userCredential.user.uid).set({
                name: email.split('@')[0],
                bio: "¡Hola! Estoy usando PizzaChat",
                pic: "https://via.placeholder.com/150",
                status: "online"
            });
        }).catch(err => alert(err.message));
}

function login() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    auth.signInWithEmailAndPassword(email, pass).catch(err => alert(err.message));
}

auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        loadMyProfile();
        loadContacts();
        updatePresence();
    } else {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');
    }
});

// --- MENSAJERÍA Y SEGURIDAD ---
function sendMessage() {
    const text = document.getElementById('msg-input').value.trim();
    if (!text || !activeChat) return;

    const msgData = {
        sender: currentUser.uid,
        text: text,
        timestamp: Date.now(),
        seen: false
    };

    db.ref('messages').push(msgData);
    document.getElementById('msg-input').value = '';
}

// Escuchar mensajes con Seguridad
function loadMessages() {
    const display = document.getElementById('messages-display');
    db.ref('messages').limitToLast(50).on('child_added', (snapshot) => {
        const m = snapshot.val();
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${m.sender === currentUser.uid ? 'sent' : 'received'}`;
        
        // Uso de createTextNode para evitar inyección HTML
        const textNode = document.createTextNode(m.text);
        msgDiv.appendChild(textNode);

        // Detectar si es URL multimedia
        if (m.text.match(/\.(jpeg|jpg|gif|png)$/) != null) {
            const img = document.createElement('img');
            img.src = m.text; img.className = "media-content";
            msgDiv.appendChild(img);
        } else if (m.text.match(/\.(mp4|webm)$/) != null) {
            const vid = document.createElement('video');
            vid.src = m.text; vid.controls = true; vid.className = "media-content";
            msgDiv.appendChild(vid);
        }

        display.appendChild(msgDiv);
        display.scrollTop = display.scrollHeight;
        
        if (m.sender !== currentUser.uid && !document.hasFocus()) {
            new Audio('https://pizzachat-f44a8.web.app/notify.mp3').play().catch(()=>{});
        }
    });
}

// --- CONFIGURACIÓN DE TECLADO ---
document.getElementById('msg-input').addEventListener('keydown', (e) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (e.key === 'Enter') {
        if (!isMobile && e.shiftKey) {
            // Shift + Enter en PC: Salto de línea normal
            return;
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

// --- TEMAS ---
function changeTheme(theme) {
    if (theme === 'system') {
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        document.body.setAttribute('data-theme', darkQuery.matches ? 'dark' : 'light');
    } else {
        document.body.setAttribute('data-theme', theme);
    }
}

// Iniciar cargado de mensajes
loadMessages();
