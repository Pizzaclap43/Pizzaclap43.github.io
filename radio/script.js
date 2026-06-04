// ===== DATA =====
const stations = [
  {
    id: 1,
    name: "Aragueña",
    freq: "99.5 FM",
    url: "https://cloudstream2036.conectarhosting.com/8060/stream",
    genre: "Regional",
    color: "#ff6b35",
    bg: "linear-gradient(135deg,#ff6b35,#f7c59f)",
    emoji: "🎸",
    logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAaCAMAAACTisy7AAAANlBMVEVHcEzw7+/v7+/v8PDw8PHv8PHw8fLw8fHy8vL28/Lv8PDv8PDv8PDv8PDr6ejx8fHv8PDv8PBrVtp4AAAAEnRSTlMAIzVUu///jWMK1PGvoRVC43jCCJZcAAAAzElEQVR4AWzOBxKDMBBDUbloDe6+/2XjHULnpWo+DTfGGnxznpSAL8ss01dc4wxMuTi8GArpLb5UiqSZTMg+h4abTumAnT+K6XrtQElAkFPGbqWI0Xbh9zhEChpF9RxFcWCThBV6P8aqF/LUfFy1w+qO2GStC5SjBJQ5afCn0e+3HPBzJuyiCLdlWjPQGLHTRRzybZZ7HDrdvtw9Vl6faL1HeK0MdZ2Aco8rKbsAkMSFJS/R3CNMkg1nhCXuRqIojTB4qm2ZLL78RhIAAHm3CCSqsb1HAAAAAElFTkSuQmCC",
    description: "La radio de Venezuela"
  },
  {
    id: 2,
    name: "Positiva",
    freq: "92.7 FM",
    url: "https://stream-153.zeno.fm/zptsvda6fd0uv?zs=yuzabRJlT2KHoJb5IIuB0A&adtonosListenerId=01HG6CKJKK2N4PESGSQR728VHT&aw_0_req_lsid=a73b93b4a361b1b74689f98df91c7c0c&acu-uid=856841341346&an-uid=9072685044421090607&mm-uid=657a6563-879f-4a00-8364-1f46175de940&dot-uid=09d8220400ff6773733290ac&amb-uid=2654924301368664169&dbm-uid=CAESENpW9w2DvDhRMIuRcx8yRQA&cto-uid=2e3d537f-d45f-4fa1-8c77-abe908bae5f0-6563879e-5645&bsw-uid=e4c56c24-32be-47a2-8015-909eed2c0adb&dyn-uid=2940798897331886011&ttd-uid=f23e4a03-2239-4e97-95f9-9ff58a23724c&triton-uid=cookie%3A25a0b549-c8b9-4b1c-8a70-95e9dfab29ef&adt-uid=cuid_9d23eb64-8c85-11ee-94b0-121a6d1d7927&1779752060716",
    genre: "Pop",
    color: "#00d4ff",
    bg: "linear-gradient(135deg,#00d4ff,#090979)",
    emoji: "✨",
    logo: "https://lh3.googleusercontent.com/sitesv/AA5AbUDnRlhgESAW6fq30hJQvyve5_2ZUzet-qONEYYi-3OJcdO_rPGjr_FMJj9Lex-smYtik_q8OzZZ7ETNiBlHmQnKQtVz0Qt2kw1IYbqKfdiDWJ3TkF4lG3L6g6OCnkwu5mRtgL4gPWiYgQBem3D2xnPG_C9ZRtHdVnPFpFVNECTzOE_XJrnzOyR79CA=w16383",
    description: "Música positiva 24/7"
  },
  {
    id: 3,
    name: "La Mega",
    freq: "107.3 FM",
    url: "https://acp4.lorini.net:2050/stream",
    genre: "Urbano",
    color: "#ff2d55",
    bg: "linear-gradient(135deg,#ff2d55,#7928ca)",
    emoji: "🔥",
    logo: "https://proxy.zeno.fm/content/stations/agxzfnplbm8tc3RhdHNyMgsSCkF1dGhDbGllbnQYgICAoKyOmgkMCxIOU3RhdGlvblByb2ZpbGUYgIDwlvalpggMogEEemVubw/image/?u=1660852957000",
    description: "Los mejores hits"
  },
  {
    id: 4,
    name: "Union Radio",
    freq: "90.3 FM",
    url: "https://acp4.lorini.net:2080/stream",
    genre: "Noticias",
    color: "#34c759",
    bg: "linear-gradient(135deg,#34c759,#007aff)",
    emoji: "📡",
    description: "Información al instante"
  },
  {
    id: 5,
    name: "Éxitos",
    freq: "99.9 FM",
    url: "https://acp4.lorini.net:2070/stream",
    genre: "Tropical",
    color: "#ff9f0a",
    bg: "linear-gradient(135deg,#ff9f0a,#ff2d55)",
    emoji: "🎺",
    description: "Los grandes éxitos"
  },
  {
    id: 6,
    name: "Onda",
    freq: "107.9 FM",
    url: "https://acp4.lorini.net:2060/stream",
    genre: "Variada",
    color: "#bf5af2",
    bg: "linear-gradient(135deg,#bf5af2,#5e5ce6)",
    emoji: "🌊",
    description: "La mejor onda"
  },
  {
    id: 7,
    name: "Auténtica",
    freq: "107.5 FM",
    url: "https://server6.globalhostla.com:9324/stream",
    genre: "Folklórica",
    color: "#30d158",
    bg: "linear-gradient(135deg,#30d158,#0a7a3a)",
    emoji: "🪗",
    description: "Lo más auténtico"
  },
  {
    id: 8,
    name: "Radio Alegría",
    freq: "102.7 FM",
    url: "https://streamingned.com:7102/stream?1779753207562",
    genre: "Salsa",
    color: "#ffd60a",
    bg: "linear-gradient(135deg,#ffd60a,#ff6b1a)",
    emoji: "💃",
    description: "Pura alegría musical"
  },
  {
    id: 9,
    name: "Radio Apolo",
    freq: "1320 AM",
    url: "https://server6.globalhostla.com:9210/stream",
    genre: "AM Clásica",
    color: "#64d2ff",
    bg: "linear-gradient(135deg,#1c1c3a,#64d2ff)",
    emoji: "🚀",
    description: "Tradición en el aire"
  },
  {
    id: 10,
    name: "Radio Rumbos",
    freq: "670 AM",
    url: "https://stream-285.zeno.fm/c3q3w8zfe18uv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJjM3Ezdzh6ZmUxOHV2IiwiaG9zdCI6InN0cmVhbS0yODUuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6InVhME1LTmFjUkZ1M3h2ZE1Zalg3UlEiLCJpYXQiOjE3ODA1MDcxNjYsImV4cCI6MTc4MDUwNzIyNn0.QdsKZ8-zo_OUGuSCDTM9OQDR_qkI-5Pj48-JuvftAu4",
    genre: "AM Noticias",
    color: "#ff6b1a",
    bg: "linear-gradient(135deg,#7c2d00,#ff6b1a)",
    emoji: "🥁",
    description: "El ritmo de Venezuela"
  }
];

// ===== STATE =====
let currentStation = null;
let isPlaying = false;
let isMuted = false;
let prevVolume = 80;
let favorites = JSON.parse(localStorage.getItem('rp_favs') || '[]');
let playedSet = new Set();
let startTime = null;
let totalSeconds = 0;
let timeInterval = null;
let animFrame = null;
let audioCtx = null;
let analyser = null;
let srcNode = null;
let currentTab = 'all';
let isRecording = false;
let eqNodes = {};
let sleepTimer = null;
let isShuffle = false;
let sessionSeconds = 0;
let sessionInterval = null;

const audio = document.getElementById('audioEl');
const player = document.getElementById('player');

// ===== INIT =====
function init() {
  renderStations(stations);
  renderFavsSidebar();
  updateStats();
  setupEqualizer();
  startSessionTimer();
  setVolumeUI(80);
}

// ===== RENDER STATIONS =====
function renderStations(list) {
  const grid = document.getElementById('stationsGrid');
  const count = document.getElementById('sectionCount');
  count.textContent = `${list.length} emisora${list.length !== 1 ? 's' : ''}`;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">📻</div>
        <div class="no-results-title">Sin resultados</div>
        <div style="color:var(--text-muted);font-size:14px">Intenta con otro término de búsqueda</div>
      </div>`;
    return;
  }

  grid.innerHTML = list.map((s, i) => {
    const isFav = favorites.includes(s.id);
    const isNowPlaying = currentStation && currentStation.id === s.id && isPlaying;
    return `
    <div class="station-card ${isNowPlaying ? 'playing' : ''}"
      id="card-${s.id}"
      onclick="playStation(${s.id})"
      style="animation-delay:${i * 0.05}s"
    >
      <div class="card-top">
        <div class="station-avatar" style="background:${s.logo ? '#111' : s.bg}">
          ${s.logo
            ? `<img src="${s.logo}" alt="${s.name}" style="width:100%;height:100%;object-fit:cover;border-radius:14px;" onerror="this.parentElement.innerHTML='${s.emoji}';this.parentElement.style.background='${s.bg}';">`
            : s.emoji}
        </div>
        <div class="card-actions">
          <button class="btn-fav ${isFav ? 'active' : ''}"
            onclick="event.stopPropagation(); toggleFav(${s.id})"
            title="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
          >${isFav ? '⭐' : '☆'}</button>
        </div>
      </div>
      <div class="station-name">${s.name}</div>
      <div class="station-freq">${s.freq}</div>
      <div class="play-bar">
        <button class="btn-play-card">
          ${isNowPlaying
            ? `<div class="wave-bars">${[1,2,3,4].map(()=>'<div class="wave-bar"></div>').join('')}</div> EN VIVO`
            : `▶ ESCUCHAR`}
        </button>
        <span style="font-size:11px;color:var(--text-muted);font-family:'Space Mono',monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100px">${s.description}</span>
      </div>
    </div>`;
  }).join('');
}

// ===== PLAY STATION =====
function playStation(id) {
  const s = stations.find(x => x.id === id);
  if (!s) return;

  if (currentStation && currentStation.id === id && isPlaying) {
    togglePlay();
    return;
  }

  currentStation = s;
  isPlaying = false;

  // Setup audio
  audio.src = s.url;
  audio.volume = document.getElementById('volumeSlider').value / 100;

  // Update player UI
  player.classList.add('visible');
  document.getElementById('playerName').textContent = s.name + ' ' + s.freq;
  document.getElementById('playerFreq').textContent = s.description;
  const av = document.getElementById('playerAvatar');
  if (s.logo) {
    av.innerHTML = `<img src="${s.logo}" alt="${s.name}" style="width:100%;height:100%;object-fit:cover;border-radius:14px;" onerror="this.parentElement.innerHTML='${s.emoji}';this.parentElement.style.background='${s.bg}';">`;
    av.style.background = '#111';
  } else {
    av.textContent = s.emoji;
    av.style.background = s.bg;
  }

  // Play
  setStatusLoading();
  audio.play().then(() => {
    isPlaying = true;
    setStatusLive();
    playedSet.add(id);
    startTime = Date.now();
    startTimeCounter();
    setupAnalyser();
    drawViz();
    updateStats();
  }).catch(err => {
    console.error(err);
    setStatusError();
    showToast('❌ No se pudo conectar a la emisora', '#ff3b30');
  });

  updatePlayerBtns();
  updateAllCards();
  updateFavPlayerBtn();
}

// ===== TOGGLE PLAY =====
function togglePlay() {
  if (!currentStation) return;
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    setStatusPaused();
    stopTimeCounter();
  } else {
    setStatusLoading();
    audio.play().then(() => {
      isPlaying = true;
      setStatusLive();
      startTimeCounter();
    });
  }
  updatePlayerBtns();
  updateAllCards();
}

function updatePlayerBtns() {
  const btn = document.getElementById('btnPlayMain');
  const av = document.getElementById('playerAvatar');
  if (isPlaying) {
    btn.textContent = '⏸';
    av.classList.add('spinning');
  } else {
    btn.textContent = '▶';
    av.classList.remove('spinning');
  }
}

// ===== STATUS =====
function setStatusLive() {
  document.getElementById('statusDot').className = 'status-dot live';
  document.getElementById('statusText').textContent = 'EN VIVO';
  document.getElementById('statusText').style.color = 'var(--neon-red)';
}

function setStatusPaused() {
  document.getElementById('statusDot').className = 'status-dot';
  document.getElementById('statusDot').style.background = 'var(--neon-yellow)';
  document.getElementById('statusText').textContent = 'PAUSADO';
  document.getElementById('statusText').style.color = 'var(--neon-yellow)';
}

function setStatusLoading() {
  document.getElementById('statusDot').className = 'status-dot';
  document.getElementById('statusDot').style.background = 'var(--neon-cyan)';
  document.getElementById('statusText').textContent = 'CONECTANDO...';
  document.getElementById('statusText').style.color = 'var(--neon-cyan)';
}

function setStatusError() {
  document.getElementById('statusDot').className = 'status-dot';
  document.getElementById('statusDot').style.background = '#ff9f0a';
  document.getElementById('statusText').textContent = 'ERROR';
  document.getElementById('statusText').style.color = '#ff9f0a';
}

// ===== NAV CONTROLS =====
function getFilteredList() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  return stations.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.freq.toLowerCase().includes(q) ||
    s.genre.toLowerCase().includes(q)
  );
}

function prevStation() {
  if (!currentStation) return;
  const list = getFilteredList();
  const idx = list.findIndex(s => s.id === currentStation.id);
  const prev = list[(idx - 1 + list.length) % list.length];
  playStation(prev.id);
}

function nextStation() {
  if (!currentStation) return;
  const list = getFilteredList();
  const idx = list.findIndex(s => s.id === currentStation.id);
  const next = list[(idx + 1) % list.length];
  playStation(next.id);
}

function shuffleStation() {
  isShuffle = !isShuffle;
  document.getElementById('btnShuffle').classList.toggle('active', isShuffle);
  showToast(isShuffle ? '🔀 Modo aleatorio ON' : '🔀 Modo aleatorio OFF', isShuffle ? 'var(--neon-cyan)' : 'var(--text-muted)');
  if (isShuffle) {
    const list = getFilteredList().filter(s => !currentStation || s.id !== currentStation.id);
    if (list.length > 0) playStation(list[Math.floor(Math.random() * list.length)].id);
  }
}

// ===== VOLUME =====
function setVolume(val) {
  audio.volume = val / 100;
  setVolumeUI(val);
}

function setVolumeUI(val) {
  document.getElementById('volValue').textContent = val;
  const icon = document.getElementById('volIcon');
  if (val == 0) icon.textContent = '🔇';
  else if (val < 40) icon.textContent = '🔉';
  else icon.textContent = '🔊';
  document.getElementById('volumeSlider').style.background =
    `linear-gradient(to right, var(--neon-red) ${val}%, rgba(255,255,255,0.1) ${val}%)`;
}

function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) {
    prevVolume = document.getElementById('volumeSlider').value;
    audio.volume = 0;
    document.getElementById('volumeSlider').value = 0;
    setVolumeUI(0);
  } else {
    audio.volume = prevVolume / 100;
    document.getElementById('volumeSlider').value = prevVolume;
    setVolumeUI(prevVolume);
  }
}

// ===== FAVORITES =====
function toggleFav(id) {
  const idx = favorites.indexOf(id);
  const s = stations.find(x => x.id === id);
  if (idx === -1) {
    favorites.push(id);
    showToast(`⭐ ${s.name} añadida a favoritos`, 'var(--neon-yellow)');
  } else {
    favorites.splice(idx, 1);
    showToast(`☆ ${s.name} quitada de favoritos`, 'var(--text-muted)');
  }
  localStorage.setItem('rp_favs', JSON.stringify(favorites));
  updateStats();
  renderFavsSidebar();
  updateAllCards();
  updateFavPlayerBtn();
  if (currentTab === 'favs') renderCurrentTab();
}

function favCurrentStation() {
  if (!currentStation) return;
  toggleFav(currentStation.id);
}

function updateFavPlayerBtn() {
  if (!currentStation) return;
  const btn = document.getElementById('btnFavPlayer');
  const isFav = favorites.includes(currentStation.id);
  btn.textContent = isFav ? '♥' : '♡';
  btn.classList.toggle('active', isFav);
}

function renderFavsSidebar() {
  const container = document.getElementById('favList');
  const favStations = stations.filter(s => favorites.includes(s.id));
  if (favStations.length === 0) {
    container.innerHTML = `<div class="empty-favs"><div class="empty-favs-icon">🌟</div><div>Aún no tienes favoritos.<br>Toca ★ en una emisora.</div></div>`;
    return;
  }
  container.innerHTML = favStations.map(s => `
    <div class="fav-item" onclick="playStation(${s.id})">
      <div class="fav-avatar" style="background:${s.logo ? '#111' : s.bg}">${s.logo ? `<img src="${s.logo}" alt="${s.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.parentElement.innerHTML='${s.emoji}';this.parentElement.style.background='${s.bg}';">` : s.emoji}</div>
      <div class="fav-info">
        <div class="fav-name">${s.name}</div>
        <div class="fav-freq">${s.freq}</div>
      </div>
      <button class="fav-play-btn" onclick="event.stopPropagation();playStation(${s.id})">▶</button>
    </div>
  `).join('');
}

// ===== SEARCH =====
document.getElementById('searchInput').addEventListener('input', filterStations);

function filterStations() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  let list = stations.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.freq.toLowerCase().includes(q) ||
    s.genre.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q)
  );
  if (currentTab === 'favs') list = list.filter(s => favorites.includes(s.id));
  document.getElementById('searchCount').textContent = q ? `${list.length} resultado${list.length !== 1 ? 's' : ''}` : '';
  renderStations(list);
}

// ===== TABS =====
document.getElementById('tabsBar').addEventListener('click', e => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  currentTab = btn.dataset.tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('sectionTitle').textContent = currentTab === 'favs' ? 'FAVORITOS' : 'EMISORAS';
  renderCurrentTab();
});

function renderCurrentTab() {
  let list = stations;
  if (currentTab === 'favs') list = stations.filter(s => favorites.includes(s.id));
  const q = document.getElementById('searchInput').value.toLowerCase();
  if (q) list = list.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.freq.toLowerCase().includes(q) ||
    s.genre.toLowerCase().includes(q)
  );
  renderStations(list);
}

// ===== STATS =====
function updateStats() {
  document.getElementById('statFavs').textContent = favorites.length;
  document.getElementById('statPlayed').textContent = playedSet.size;
}

// ===== TIMER =====
function startTimeCounter() {
  if (timeInterval) clearInterval(timeInterval);
  startTime = Date.now();
  timeInterval = setInterval(() => {
    const s = Math.floor((Date.now() - startTime) / 1000) + totalSeconds;
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    document.getElementById('timeDisplay').textContent = m + ':' + sec;
  }, 1000);
}

function stopTimeCounter() {
  if (startTime) totalSeconds += Math.floor((Date.now() - startTime) / 1000);
  startTime = null;
  clearInterval(timeInterval);
}

function startSessionTimer() {
  sessionInterval = setInterval(() => {
    if (isPlaying) {
      sessionSeconds++;
      const m = Math.floor(sessionSeconds / 60);
      document.getElementById('statTime').textContent = m < 60 ? m + 'm' : Math.floor(m/60) + 'h';
    }
  }, 1000);
}

// ===== VISUALIZER =====
function setupAnalyser() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (srcNode) srcNode.disconnect();
  srcNode = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  // Reconnect EQ
  let chain = srcNode;
  Object.values(eqNodes).forEach(node => {
    chain.connect(node);
    chain = node;
  });
  chain.connect(analyser);
  analyser.connect(audioCtx.destination);

  if (animFrame) cancelAnimationFrame(animFrame);
  drawViz();
}

function drawViz() {
  const canvas = document.getElementById('vizCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  const W = canvas.offsetWidth, H = canvas.offsetHeight;

  function draw() {
    animFrame = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);

    if (!analyser || !isPlaying) {
      // Idle animation
      const t = Date.now() / 1000;
      ctx.fillStyle = 'rgba(255,45,85,0.15)';
      for (let i = 0; i < 32; i++) {
        const x = (i / 32) * W;
        const h = 4 + Math.sin(t * 2 + i * 0.5) * 4;
        ctx.fillRect(x, (H - h) / 2, (W / 32) - 1, h);
      }
      return;
    }

    const buf = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(buf);
    const bars = 64;
    const bw = W / bars - 1;

    for (let i = 0; i < bars; i++) {
      const val = buf[i] / 255;
      const h = val * H;
      const hue = 0 + val * 40;
      ctx.fillStyle = `hsla(${hue},100%,${50 + val * 20}%,${0.6 + val * 0.4})`;
      ctx.fillRect(i * (bw + 1), H - h, bw, h);

      // Reflection
      ctx.fillStyle = `hsla(${hue},100%,50%,0.1)`;
      ctx.fillRect(i * (bw + 1), H, bw, h * 0.3);
    }
  }
  draw();
}

// Start idle viz immediately
drawViz();

// ===== EQUALIZER =====
function setupEqualizer() {
  const bands = [
    { freq: 60, label: '60' },
    { freq: 250, label: '250' },
    { freq: 1000, label: '1K' },
    { freq: 4000, label: '4K' },
    { freq: 16000, label: '16K' }
  ];

  const container = document.getElementById('eqSliders');
  container.innerHTML = bands.map((b, i) => `
    <div class="eq-band">
      <input type="range" class="eq-slider" min="-12" max="12" value="0"
        oninput="setEQ(${b.freq}, this.value)"
        title="${b.label} Hz"
        style="writing-mode:vertical-lr;direction:rtl;-webkit-appearance:slider-vertical;"
      >
      <span class="eq-freq">${b.label}</span>
    </div>
  `).join('');
}

function setEQ(freq, gain) {
  if (!audioCtx) return;
  if (!eqNodes[freq]) {
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = freq;
    filter.Q.value = 1;
    eqNodes[freq] = filter;
  }
  eqNodes[freq].gain.value = parseFloat(gain);
}

// ===== RECORD =====
function toggleRecord() {
  isRecording = !isRecording;
  const btn = document.getElementById('btnRecord');
  btn.classList.toggle('active', isRecording);
  btn.style.color = isRecording ? '#ff3b30' : '';
  showToast(isRecording ? '⏺ Grabación iniciada (simulada)' : '⏹ Grabación detenida', isRecording ? '#ff3b30' : 'var(--text-muted)');
}

// ===== SLEEP TIMER =====
let sleepSeconds = 0;
const sleepOptions = [0, 15, 30, 60];
let sleepIdx = 0;

function toggleSleep() {
  sleepIdx = (sleepIdx + 1) % sleepOptions.length;
  const mins = sleepOptions[sleepIdx];
  if (sleepTimer) clearTimeout(sleepTimer);

  const btn = document.getElementById('btnSleep');
  if (mins === 0) {
    btn.classList.remove('active');
    btn.title = 'Temporizador';
    showToast('😴 Temporizador desactivado', 'var(--text-muted)');
  } else {
    btn.classList.add('active');
    btn.title = `Apagar en ${mins}min`;
    showToast(`😴 Apagando en ${mins} minutos`, 'var(--neon-cyan)');
    sleepTimer = setTimeout(() => {
      audio.pause();
      isPlaying = false;
      updatePlayerBtns();
      setStatusPaused();
      updateAllCards();
      showToast('😴 Radio apagada automáticamente', 'var(--neon-yellow)');
    }, mins * 60 * 1000);
  }
}

// ===== SHARE =====
function shareStation() {
  if (!currentStation) {
    showToast('Selecciona una emisora primero', 'var(--text-muted)');
    return;
  }
  const text = `🍕 Escuchando ${currentStation.name} ${currentStation.freq} en Radio Pizza!`;
  if (navigator.share) {
    navigator.share({ title: 'Radio Pizza', text });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Copiado al portapapeles', 'var(--neon-cyan)');
    });
  }
}

// ===== UPDATE ALL CARDS =====
function updateAllCards() {
  stations.forEach(s => {
    const card = document.getElementById('card-' + s.id);
    if (!card) return;
    const isNow = currentStation && currentStation.id === s.id && isPlaying;
    card.classList.toggle('playing', isNow);
    const btn = card.querySelector('.btn-play-card');
    if (btn) {
      btn.innerHTML = isNow
        ? `<div class="wave-bars">${[1,2,3,4].map(()=>'<div class="wave-bar"></div>').join('')}</div> EN VIVO`
        : `▶ ESCUCHAR`;
    }
  });
}

// ===== TOAST =====
function showToast(msg, color = 'var(--text-primary)') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast';
  el.style.borderColor = color === 'var(--text-primary)' ? 'var(--border)' : color + '44';
  el.innerHTML = `<span style="color:${color}">${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3100);
}

// ===== AUDIO EVENTS =====
audio.addEventListener('error', () => {
  isPlaying = false;
  setStatusError();
  updatePlayerBtns();
  updateAllCards();
  showToast('⚠️ Error al reproducir. Verifica tu conexión.', '#ff9f0a');
});

audio.addEventListener('waiting', () => {
  setStatusLoading();
});

audio.addEventListener('playing', () => {
  setStatusLive();
});

// ===== START =====
init();
