import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log("SW error", err));
    });
}

const firebaseConfig = {
    apiKey: "AIzaSyBmEI9UPEs3ST7vJVaqzq_PzWUMo1WaYzA",
    authDomain: "neon-dash-fac14.firebaseapp.com",
    projectId: "neon-dash-fac14",
    storageBucket: "neon-dash-fac14.firebasestorage.app",
    messagingSenderId: "1046802669155",
    appId: "1:1046802669155:web:b82655117ea092232c2256",
    measurementId: "G-YT2N2SET2N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

window.handleAuth = async (type) => {
    const email = document.getElementById('player-email').value;
    const password = document.getElementById('player-password').value;
    const name = document.getElementById('player-name-settings').value;
    const status = document.getElementById('auth-status');
    if(!email || !password) { status.innerText = "FALTAN DATOS"; return; }
    try {
        if (type === 'register') {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name || "Jugador" });
            status.innerText = "¡CUENTA CREADA!";
        } else {
            await signInWithEmailAndPassword(auth, email, password);
            status.innerText = "SESIÓN INICIADA";
        }
    } catch (error) { status.innerText = "ERROR: " + error.code.replace('auth/', ''); }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        localStorage.setItem("neonDashPlayerName", user.displayName || "Jugador");
        document.getElementById('player-name-settings').value = user.displayName || "";
        document.getElementById('auth-status').innerText = "CONECTADO: " + user.displayName;
    }
});

window.autoSaveScore = async () => {
    const user = auth.currentUser;
    let name = user ? user.displayName : (localStorage.getItem("neonDashPlayerName") || "Invitado");
    if (!name || name.trim() === "") { name = "Pizzaclap43_Player"; }
    const status = document.getElementById('status-msg');
    const userId = user ? user.uid : "guest_" + name.toLowerCase().replace(/\s+/g, '_');
    try {
        status.innerText = "REVISANDO RÉCORD...";
        const docRef = doc(db, "leaderboard", userId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || score > docSnap.data().score) {
            await setDoc(docRef, { name: name, score: score, date: new Date() });
            status.innerText = "¡NUEVO RÉCORD GLOBAL!";
        } else { status.innerText = "PUNTUACIÓN SUBIDA"; }
    } catch (e) { status.innerText = "ERROR AL SUBIR"; }
};

window.loadScores = () => {
    const q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(5));
    const container = document.getElementById('leaderboard-content');
    onSnapshot(q, (snapshot) => {
        container.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            container.innerHTML += `<div class="leaderboard-row"><span>${data.name}</span><span style="color:#00ffff">${data.score}</span></div>`;
        });
    });
};

const themes = {
    neon: { bg: "#0d0221", player: "#ff00ff", enemy: "#00ffff", point: "#ffff00", shadow: "#ff00ff", title: "NEON DASH", bgList: ["#0d0221", "#2e004d", "#002b36", "#330000", "#1a1a1a"], uiColor: "#ff00ff" },
    frutiger: { bg: "#4facfe", player: "#7cfc00", enemy: "#ffffff", point: "#00eeff", shadow: "#ffffff", title: "Aero Dash", bgList: ["#4facfe", "#00f2fe", "#38f9d7", "#a18cd1", "#84fab0"], uiColor: "#ffffff" }
};

let currentThemeKey = localStorage.getItem("neonDashTheme") || "neon";
let savedVol = localStorage.getItem("neonDashVolume");
let initialVol = savedVol !== null ? parseFloat(savedVol) : 0.5;
let gameSettings = { volume: initialVol, effectsEnabled: localStorage.getItem("neonDashEffects") !== "false" };

const coinSound = new Audio('./coin.wav');
const hitSound = new Audio('./hit.wav');
const deathSound = new Audio('./death.wav');
const bgMusic = new Audio('./verisimilitude.mp3'); // MÚSICA DE FONDO (Reemplaza './music.mp3' con la ruta de tu archivo de música real)
bgMusic.loop = true;

function applyAudioVolumes(val) { 
    coinSound.volume = val; 
    hitSound.volume = val; 
    deathSound.volume = val;
    bgMusic.volume = val * 0.5; // La música de fondo se ajusta proporcionalmente al volumen general del slider (50% de la configuración)
}

applyAudioVolumes(gameSettings.volume);
document.getElementById("volume-control").value = gameSettings.volume;

window.setTheme = (key) => {
    currentThemeKey = key;
    localStorage.setItem("neonDashTheme", key);
    const theme = themes[key];
    document.body.style.backgroundColor = theme.bg;
    document.getElementById("game-title").innerText = theme.title;
    document.getElementById("main-title").innerText = (key === 'frutiger') ? "Aero Dash" : "NEON DASH";
    document.getElementById("ui-panel").style.color = theme.uiColor;
    const titles = [document.getElementById("game-title"), document.getElementById("main-title")];
    titles.forEach(t => {
        if(key === 'frutiger') t.classList.add('frutiger-title');
        else t.classList.remove('frutiger-title');
    });
    updateEffectsUI();
    if(gameActive) toggleMenu('themes-menu', false);
};

window.updateVolume = (val) => { 
    gameSettings.volume = parseFloat(val); 
    applyAudioVolumes(gameSettings.volume); 
    localStorage.setItem("neonDashVolume", val); 
};

window.toggleEffects = () => { gameSettings.effectsEnabled = !gameSettings.effectsEnabled; localStorage.setItem("neonDashEffects", gameSettings.effectsEnabled); updateEffectsUI(); };

function updateEffectsUI() {
    const btn = document.getElementById("effects-toggle");
    btn.innerText = gameSettings.effectsEnabled ? "ACTIVADOS" : "DESACTIVADOS";
    const uiPanel = document.getElementById("ui-panel");
    if (gameSettings.effectsEnabled) {
        const shadowCol = themes[currentThemeKey].shadow;
        uiPanel.style.textShadow = `0 0 10px ${shadowCol}, 0 0 20px ${shadowCol}`;
    } else { uiPanel.style.textShadow = "none"; }
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameWrapper = document.getElementById("game-wrapper");
let animationId;

window.startGame = () => {
    if(animationId) cancelAnimationFrame(animationId);
    
    coinSound.play().then(() => { coinSound.pause(); coinSound.currentTime = 0; });
    
    // REPRODUCE LA MÚSICA DESDE EL PRINCIPIO A 50% DE VOLUMEN TOTAL (basado en el valor inicial o el slider)
    bgMusic.currentTime = 0;
    bgMusic.play().catch(err => console.log("Interacción de usuario requerida para reproducir audio", err));

    const allMenus = document.querySelectorAll('.menu-layer');
    allMenus.forEach(menu => {
        menu.classList.remove('active');
        menu.style.display = 'none';
    });
    
    gameWrapper.style.display = "flex";
    score = 0;
    lives = 3;
    items = [];
    currentLevel = 0;
    gameActive = true;
    invincible = false;
    player.x = (canvas.width/2)-15;
    
    updateLivesUI();
    document.getElementById("score-val").innerText = "0";
    initAeroEffects();
    draw();
};

window.score = 0; let lives = 3, gameActive = false, currentLevel = 0;
let aeroBubbles = [], aeroGlints = [];

function initAeroEffects() {
    aeroBubbles = []; 
    aeroGlints = [];   
    for(let i=0; i<10; i++) aeroBubbles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: 4+Math.random()*12, speed: 0.4+Math.random() });
    for(let i=0; i<4; i++) aeroGlints.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, op: 0, state: 'in' });
}

const player = { x: (canvas.width/2)-15, y: 435, size: 30 };
let items = [], keys = {};

canvas.addEventListener("touchmove", (e) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    let newX = e.touches[0].clientX - rect.left - 15;
    player.x = Math.max(15, Math.min(canvas.width - player.size - 15, newX));
    e.preventDefault();
}, { passive: false });

document.addEventListener("keydown", (e) => keys[e.code] = true);
document.addEventListener("keyup", (e) => keys[e.code] = false);

let invincible = false;

function update() {
    if (!gameActive) return;
    if (keys["ArrowLeft"] && player.x > 15) player.x -= 8;
    if (keys["ArrowRight"] && player.x < canvas.width - player.size) player.x += 8;
    if(currentThemeKey === 'frutiger') {
        aeroBubbles.forEach(b => { b.y -= b.speed; if(b.y < -20) b.y = canvas.height + 20; });
        aeroGlints.forEach(g => {
            if(g.state === 'in') { g.op += 0.01; if(g.op >= 0.5) g.state = 'out'; }
            else { g.op -= 0.01; if(g.op <= 0) { g.x = Math.random()*canvas.width; g.y = Math.random()*canvas.height; g.state = 'in'; } }
        });
    }

    let toRemove = [];
    items.forEach((item, index) => {
        item.y += item.speed;
        const hit = player.x < item.x + item.size &&
                    player.x + player.size > item.x &&
                    player.y < item.y + item.size &&
                    player.y + player.size > item.y;
        if (hit) {
            if (item.type === "enemy") {
                if (!invincible) {
                    toRemove.push(index);
                    lives--;
                    if (lives <= 0) {
                        gameActive = false;
                        deathSound.play();
                        showGameOver();
                    } else {
                        hitSound.play();
                        updateLivesUI();
                        invincible = true;
                        setTimeout(() => { invincible = false; }, 800);
                    }
                }
            } else {
                toRemove.push(index);
                coinSound.currentTime = 0; coinSound.play();
                score += 10; document.getElementById("score-val").innerText = score;
                if(Math.floor(score/100) > currentLevel) {
                    currentLevel++;
                    if(gameSettings.effectsEnabled) document.body.style.backgroundColor = themes[currentThemeKey].bgList[currentLevel % 5];
                }
            }
        }
        if (item.y > canvas.height) toRemove.push(index);
    });
    items = items.filter((_, i) => !toRemove.includes(i));

    if (Math.random() < 0.05) {
        const isP = Math.random() > 0.4;
        items.push({ x: 15+Math.random()*(canvas.width-50), y: -30, size: 20, type: isP?"point":"enemy", color: isP?themes[currentThemeKey].point:themes[currentThemeKey].enemy, speed: 3.5+(score/200) });
    }
}

function showGameOver() {
    // DETIENE Y RESETEA LA MÚSICA CUANDO EL JUGADOR SE QUEDA SIN VIDAS
    bgMusic.pause();
    bgMusic.currentTime = 0;

    let record = parseInt(localStorage.getItem("neonDashHighScore")) || 0;
    if (score > record) localStorage.setItem("neonDashHighScore", score);
    document.getElementById("final-score-val").innerText = score;
    document.getElementById("high-score-val").innerText = Math.max(score, record);
    autoSaveScore();
    toggleMenu('game-over-menu', true);
}

function updateLivesUI() { document.getElementById("lives").innerText = "❤️".repeat(lives); }

function draw() {
    if (!gameActive) return;
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(currentThemeKey === 'frutiger' && gameSettings.effectsEnabled) {
        aeroBubbles.forEach(b => { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2); ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.stroke(); });
        aeroGlints.forEach(g => { ctx.fillStyle = `rgba(255,255,255,${g.op})`; ctx.beginPath(); ctx.arc(g.x, g.y, 2, 0, Math.PI*2); ctx.fill(); });
    }
    ctx.shadowBlur = gameSettings.effectsEnabled ? 15 : 0;
    ctx.shadowColor = themes[currentThemeKey].shadow;
    ctx.fillStyle = themes[currentThemeKey].player;
    ctx.fillRect(player.x, player.y, player.size, player.size);
    items.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.shadowColor = item.color;
        if(item.type === "point") { ctx.beginPath(); ctx.arc(item.x+10, item.y+10, 10, 0, Math.PI*2); ctx.fill(); }
        else ctx.fillRect(item.x, item.y, 20, 20);
    });
    animationId = requestAnimationFrame(draw);
}

window.toggleMenu = (id, show) => {
    const menus = document.querySelectorAll('.menu-layer');
    menus.forEach(m => { m.style.display = 'none'; m.classList.remove('active'); });
    
    if (show) { 
        const t = document.getElementById(id); 
        t.classList.add('active'); 
        t.style.display = 'flex'; 
    } else { 
        gameActive = false;
        if(animationId) cancelAnimationFrame(animationId);
        gameWrapper.style.display = "none";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const start = document.getElementById('start-menu');
        start.style.display = 'flex'; 
        start.classList.add('active'); 
    }
};

setTheme(currentThemeKey);
