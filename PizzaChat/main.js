/* ============================================
   PizzaChat - app.js (solo correo/contraseña)
   Firebase Realtime Database + Auth
   ============================================ */

// ──────────────────────────────────────────
// 1. FIREBASE CONFIG & INIT
// ──────────────────────────────────────────
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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.database();

// ──────────────────────────────────────────
// 2. STATE
// ──────────────────────────────────────────
let currentUser        = null;
let currentChatId      = null;
let currentContactId   = null;
let currentContactData = null;
let messagesListener   = null;
let contactsListener   = null;
let typingTimeout      = null;
let lastLoadedMsgKey   = null;
const PAGE_SIZE        = 25;
const unreadCounts     = {};
let allContacts        = {};

let notifPermission  = false;
let docTitleInterval = null;
const originalTitle  = 'PizzaChat 🍕';

// ──────────────────────────────────────────
// 3. THEME
// ──────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('pizzachat-theme') || 'system';
  document.body.setAttribute('data-theme', saved);
  const icons = { light: '☀️', dark: '🌙', system: '🌗' };
  document.getElementById('btn-theme').textContent = icons[saved] || '🌗';
})();

function cycleTheme() {
  const themes = ['light', 'dark', 'system'];
  const cur  = document.body.getAttribute('data-theme') || 'system';
  const next = themes[(themes.indexOf(cur) + 1) % themes.length];
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('pizzachat-theme', next);
  const icons = { light: '☀️', dark: '🌙', system: '🌗' };
  document.getElementById('btn-theme').textContent = icons[next];
}

// ──────────────────────────────────────────
// 4. HELPERS
// ──────────────────────────────────────────
function sanitizeText(str) {
  return String(str || '');
}

function chatId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDay(ts) {
  if (!ts) return '';
  const d         = new Date(ts);
  const today     = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString())     return 'Hoy';
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer';
  return d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
}

function isUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}

function getMediaType(url) {
  try {
    const u = url.toLowerCase().split('?')[0];
    if (/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/.test(u)) return 'image';
    if (/\.(mp4|webm|ogg|mov)$/.test(u))               return 'video';
    if (/\.(mp3|wav|ogg|aac|flac|m4a)$/.test(u))       return 'audio';
    return 'link';
  } catch { return 'link'; }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function openModal(id)  { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function showAuthMsg(type, text) {
  const el = document.getElementById('auth-message');
  el.className = 'auth-message ' + type;
  el.textContent = '';
  el.appendChild(document.createTextNode(text));
}

function showProfileMsg(type, text) {
  const el = document.getElementById('profile-message');
  el.className = 'auth-message ' + type;
  el.textContent = '';
  el.appendChild(document.createTextNode(text));
}

function buildAvatar(container, name, photoURL) {
  container.innerHTML = '';
  if (photoURL) {
    const img = document.createElement('img');
    img.src = sanitizeText(photoURL);
    img.alt = sanitizeText(name);
    container.appendChild(img);
  } else {
    const letter = (name || '?')[0].toUpperCase();
    container.appendChild(document.createTextNode(letter));
  }
}

// ──────────────────────────────────────────
// 5. AUTH TABS
// ──────────────────────────────────────────
const tabs = document.querySelectorAll('.auth-tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// Toggle password visibility
document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    input.type  = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁' : '🙈';
  });
});

// ──────────────────────────────────────────
// 6. LOGIN
// ──────────────────────────────────────────
document.getElementById('btn-login').addEventListener('click', async () => {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) return showAuthMsg('error', 'Por favor completa todos los campos.');
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (e) {
    showAuthMsg('error', friendlyError(e.code));
  }
});

// Enter key en los inputs de login
['login-email', 'login-password'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-login').click();
  });
});

// ──────────────────────────────────────────
// 7. REGISTER
// ──────────────────────────────────────────
document.getElementById('btn-register').addEventListener('click', async () => {
  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  if (!name || !email || !password) return showAuthMsg('error', 'Por favor completa todos los campos.');
  if (password.length < 6) return showAuthMsg('error', 'La contraseña debe tener al menos 6 caracteres.');
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });
    await saveUserProfile(cred.user.uid, { name, email, bio: '', photoURL: '' });
    await cred.user.sendEmailVerification();
    showAuthMsg('success', '¡Cuenta creada! Revisa tu correo para verificar tu cuenta.');
  } catch (e) {
    showAuthMsg('error', friendlyError(e.code));
  }
});

// ──────────────────────────────────────────
// 8. FORGOT PASSWORD
// ──────────────────────────────────────────
document.getElementById('btn-forgot').addEventListener('click', () => {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById('tab-forgot').classList.add('active');
});

document.getElementById('btn-back-login').addEventListener('click', () => {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById('tab-login').classList.add('active');
});

document.getElementById('btn-send-reset').addEventListener('click', async () => {
  const email = document.getElementById('forgot-email').value.trim();
  if (!email) return showAuthMsg('error', 'Ingresa tu correo electrónico.');
  try {
    await auth.sendPasswordResetEmail(email);
    showAuthMsg('success', 'Correo de recuperación enviado. ¡Revisa tu bandeja!');
  } catch (e) {
    showAuthMsg('error', friendlyError(e.code));
  }
});

function friendlyError(code) {
  const map = {
    'auth/user-not-found':        'No existe una cuenta con ese correo.',
    'auth/wrong-password':        'Contraseña incorrecta.',
    'auth/email-already-in-use':  'Ese correo ya está en uso.',
    'auth/invalid-email':         'Correo inválido.',
    'auth/weak-password':         'La contraseña es muy débil.',
    'auth/network-request-failed':'Error de red. Verifica tu conexión.',
    'auth/too-many-requests':     'Demasiados intentos. Espera un momento.',
  };
  return map[code] || 'Error: ' + code;
}

// ──────────────────────────────────────────
// 9. AUTH STATE
// ──────────────────────────────────────────
auth.onAuthStateChanged(async user => {
  if (user) {
    currentUser = user;
    showScreen('app-screen');
    await setOnlineStatus(true);
    loadUserProfile();
    listenContacts();
    requestNotifPermission();
    window.addEventListener('focus',        () => setOnlineStatus(true));
    window.addEventListener('blur',         () => setOnlineStatus(false));
    window.addEventListener('beforeunload', () => setOnlineStatus(false));
  } else {
    currentUser = null;
    showScreen('auth-screen');
    if (contactsListener) contactsListener();
    if (messagesListener) messagesListener();
  }
});

async function setOnlineStatus(online) {
  if (!currentUser) return;
  await db.ref('users/' + currentUser.uid + '/online').set(online);
  await db.ref('users/' + currentUser.uid + '/lastSeen').set(firebase.database.ServerValue.TIMESTAMP);
}

// ──────────────────────────────────────────
// 10. USER PROFILE
// ──────────────────────────────────────────
async function saveUserProfile(uid, data) {
  await db.ref('users/' + uid).update(data);
}

async function loadUserProfile() {
  const snap = await db.ref('users/' + currentUser.uid).once('value');
  const data = snap.val() || {};
  document.getElementById('profile-name').value      = sanitizeText(data.name     || currentUser.displayName || '');
  document.getElementById('profile-email').value     = sanitizeText(data.email    || currentUser.email       || '');
  document.getElementById('profile-bio').value       = sanitizeText(data.bio      || '');
  document.getElementById('profile-photo-url').value = sanitizeText(data.photoURL || '');
  const preview = document.getElementById('profile-avatar-preview');
  buildAvatar(preview, data.name || currentUser.displayName, data.photoURL);
}

document.getElementById('profile-photo-url').addEventListener('input', function () {
  const preview = document.getElementById('profile-avatar-preview');
  const name    = document.getElementById('profile-name').value || '?';
  buildAvatar(preview, name, this.value.trim());
});

document.getElementById('btn-save-profile').addEventListener('click', async () => {
  const name     = document.getElementById('profile-name').value.trim();
  const bio      = document.getElementById('profile-bio').value.trim();
  const photoURL = document.getElementById('profile-photo-url').value.trim();
  if (!name) return showProfileMsg('error', 'El nombre no puede estar vacío.');
  try {
    await currentUser.updateProfile({ displayName: name, photoURL: photoURL || null });
    await saveUserProfile(currentUser.uid, { name, bio, photoURL, email: currentUser.email });
    showProfileMsg('success', '¡Perfil actualizado!');
    loadUserProfile();
  } catch (e) {
    showProfileMsg('error', 'Error al guardar: ' + e.message);
  }
});

document.getElementById('btn-open-profile').addEventListener('click', () => {
  loadUserProfile();
  openModal('modal-profile');
});

// ──────────────────────────────────────────
// 11. CONTACTS LIST
// ──────────────────────────────────────────
function listenContacts() {
  const ref = db.ref('userChats/' + currentUser.uid);
  contactsListener = ref.on('value', snap => {
    const data = snap.val() || {};
    allContacts = data;
    renderContacts(data);
  });
}

function renderContacts(data) {
  const list    = document.getElementById('contact-list');
  list.innerHTML = '';
  const entries  = Object.values(data);

  if (entries.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-contacts';
    const emoji = document.createElement('span');
    emoji.appendChild(document.createTextNode('🍕'));
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('Agrega un amigo para empezar a chatear'));
    empty.appendChild(emoji);
    empty.appendChild(p);
    list.appendChild(empty);
    return;
  }

  entries.sort((a, b) => (b.lastTime || 0) - (a.lastTime || 0));
  entries.forEach(contact => list.appendChild(buildContactItem(contact)));
}

function buildContactItem(contact) {
  const item = document.createElement('div');
  item.className = 'contact-item';
  if (contact.uid === currentContactId) item.classList.add('active');
  item.setAttribute('data-uid', contact.uid);

  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'contact-avatar';
  buildAvatar(avatar, contact.name, contact.photoURL);

  // Online dot
  const onlineDot = document.createElement('span');
  onlineDot.className   = 'online-dot';
  onlineDot.style.display = 'none';
  avatar.appendChild(onlineDot);
  db.ref('users/' + contact.uid + '/online').on('value', snap => {
    onlineDot.style.display = snap.val() ? 'block' : 'none';
  });

  // Info
  const info = document.createElement('div');
  info.className = 'contact-info';

  const name = document.createElement('div');
  name.className = 'contact-name';
  name.appendChild(document.createTextNode(sanitizeText(contact.name || 'Usuario')));

  const preview = document.createElement('div');
  preview.className = 'contact-preview';
  preview.appendChild(document.createTextNode(sanitizeText(contact.lastMsg || '')));

  info.appendChild(name);
  info.appendChild(preview);

  // Meta
  const meta = document.createElement('div');
  meta.className = 'contact-meta';

  const time = document.createElement('div');
  time.className = 'contact-time';
  time.appendChild(document.createTextNode(contact.lastTime ? formatTime(contact.lastTime) : ''));
  meta.appendChild(time);

  const unread = unreadCounts[contact.uid] || 0;
  if (unread > 0) {
    const badge = document.createElement('span');
    badge.className = 'badge-unread';
    badge.appendChild(document.createTextNode(unread > 99 ? '99+' : String(unread)));
    meta.appendChild(badge);
  }

  item.appendChild(avatar);
  item.appendChild(info);
  item.appendChild(meta);
  item.addEventListener('click', () => openChat(contact));
  return item;
}

// Search/filter contacts
document.getElementById('search-contacts').addEventListener('input', function () {
  const q       = this.value.trim().toLowerCase();
  const entries = Object.values(allContacts);
  const filtered = q ? entries.filter(c => (c.name || '').toLowerCase().includes(q)) : entries;
  const fakeObj  = {};
  filtered.forEach(c => { fakeObj[c.uid] = c; });
  renderContacts(fakeObj);
});

// ──────────────────────────────────────────
// 12. OPEN CHAT
// ──────────────────────────────────────────
function openChat(contact) {
  currentContactId   = contact.uid;
  currentContactData = contact;
  currentChatId      = chatId(currentUser.uid, contact.uid);

  unreadCounts[contact.uid] = 0;

  // Header
  const headerName   = document.getElementById('chat-header-name');
  const headerStatus = document.getElementById('chat-header-status');
  const headerAvatar = document.getElementById('chat-header-avatar');

  headerName.textContent = '';
  headerName.appendChild(document.createTextNode(sanitizeText(contact.name || 'Usuario')));
  buildAvatar(headerAvatar, contact.name, contact.photoURL);

  db.ref('users/' + contact.uid + '/online').on('value', snap => {
    const on = snap.val();
    headerStatus.textContent = '';
    headerStatus.className   = 'chat-header-status' + (on ? ' online' : '');
    headerStatus.appendChild(document.createTextNode(on ? '● En línea' : '○ Desconectado'));
  });

  // Show window
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('chat-window').classList.remove('hidden');
  document.getElementById('messages-list').innerHTML = '';
  lastLoadedMsgKey = null;

  // Mark active contact
  document.querySelectorAll('.contact-item').forEach(el => {
    el.classList.toggle('active', el.dataset.uid === contact.uid);
  });

  closeSidebarMobile();
  loadMessages();
  listenNewMessages();
  listenTyping();
}

// ──────────────────────────────────────────
// 13. LOAD MESSAGES (paginated)
// ──────────────────────────────────────────
function loadMessages() {
  let query = db.ref('chats/' + currentChatId + '/messages').orderByKey().limitToLast(PAGE_SIZE);

  query.once('value', snap => {
    const msgs = snap.val();
    if (!msgs) return;
    const keys = Object.keys(msgs).sort();

    if (keys.length >= PAGE_SIZE) {
      lastLoadedMsgKey = keys[0];
      document.getElementById('btn-load-more').classList.remove('hidden');
    } else {
      document.getElementById('btn-load-more').classList.add('hidden');
    }

    const list     = document.getElementById('messages-list');
    const fragment = document.createDocumentFragment();
    let lastDay    = null;

    keys.forEach(key => {
      const msg = msgs[key];
      const day = formatDay(msg.ts);
      if (day !== lastDay) { fragment.appendChild(buildDaySeparator(day)); lastDay = day; }
      fragment.appendChild(buildMsgElement(key, msg));
    });

    list.insertBefore(fragment, list.firstChild);
    scrollToBottom();
    markVisibleRead();
  });
}

document.getElementById('btn-load-more').addEventListener('click', () => {
  if (!lastLoadedMsgKey) return;
  const prevKey = lastLoadedMsgKey;

  db.ref('chats/' + currentChatId + '/messages')
    .orderByKey().endBefore(prevKey).limitToLast(PAGE_SIZE)
    .once('value', snap => {
      const msgs = snap.val();
      if (!msgs) { document.getElementById('btn-load-more').classList.add('hidden'); return; }
      const keys = Object.keys(msgs).sort();
      lastLoadedMsgKey = keys[0];
      if (keys.length < PAGE_SIZE) document.getElementById('btn-load-more').classList.add('hidden');

      const list     = document.getElementById('messages-list');
      const fragment = document.createDocumentFragment();
      let lastDay    = null;

      keys.forEach(key => {
        const msg = msgs[key];
        const day = formatDay(msg.ts);
        if (day !== lastDay) { fragment.appendChild(buildDaySeparator(day)); lastDay = day; }
        fragment.appendChild(buildMsgElement(key, msg));
      });
      list.insertBefore(fragment, list.firstChild);
    });
});

// ──────────────────────────────────────────
// 14. LISTEN NEW MESSAGES
// ──────────────────────────────────────────
function listenNewMessages() {
  if (messagesListener) messagesListener();

  const ref   = db.ref('chats/' + currentChatId + '/messages');
  const query = ref.orderByChild('ts').limitToLast(1);
  let initialLoad = true;

  messagesListener = query.on('child_added', (snap) => {
    if (initialLoad) { initialLoad = false; return; }
    const msg = snap.val();
    const key = snap.key;

    if (msg.from !== currentUser.uid) {
      db.ref('chats/' + currentChatId + '/messages/' + key + '/status').set('read');
    }

    appendMsg(key, msg);
    scrollToBottom();

    if (msg.from !== currentUser.uid) {
      notify(currentContactData ? currentContactData.name : 'Nuevo mensaje', msg.text || '📎 Archivo');
    }
  });

  // Listen read receipts
  db.ref('chats/' + currentChatId + '/messages')
    .orderByChild('from').equalTo(currentUser.uid)
    .on('child_changed', snap => {
      const msg      = snap.val();
      const key      = snap.key;
      const checksEl = document.querySelector('.msg-checks[data-key="' + key + '"]');
      if (checksEl) {
        checksEl.textContent = '';
        checksEl.className   = 'msg-checks ' + (msg.status === 'read' ? 'read' : 'delivered');
        checksEl.appendChild(document.createTextNode(msg.status === 'read' ? '✓✓' : '✓'));
      }
    });
}

// ──────────────────────────────────────────
// 15. BUILD MESSAGE ELEMENT
// ──────────────────────────────────────────
function buildMsgElement(key, msg) {
  const isOut  = msg.from === currentUser.uid;
  const wrapper = document.createElement('div');
  wrapper.className = 'msg-wrapper ' + (isOut ? 'out' : 'in');
  wrapper.setAttribute('data-key', key);

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  if (msg.type === 'image') {
    const img    = document.createElement('img');
    img.src      = sanitizeText(msg.url);
    img.alt      = 'Imagen';
    img.className = 'msg-image';
    img.addEventListener('click', () => window.open(sanitizeText(msg.url), '_blank'));
    bubble.appendChild(img);
    if (msg.text) bubble.appendChild(document.createTextNode(sanitizeText(msg.text)));

  } else if (msg.type === 'video') {
    const video    = document.createElement('video');
    video.src      = sanitizeText(msg.url);
    video.className = 'msg-video';
    video.controls  = true;
    video.preload   = 'metadata';
    bubble.appendChild(video);
    if (msg.text) bubble.appendChild(document.createTextNode(sanitizeText(msg.text)));

  } else if (msg.type === 'audio') {
    const audio    = document.createElement('audio');
    audio.src      = sanitizeText(msg.url);
    audio.className = 'msg-audio';
    audio.controls  = true;
    bubble.appendChild(audio);
    if (msg.text) bubble.appendChild(document.createTextNode(sanitizeText(msg.text)));

  } else if (msg.type === 'link') {
    const a    = document.createElement('a');
    a.href     = sanitizeText(msg.url);
    a.target   = '_blank';
    a.rel      = 'noopener noreferrer';
    a.className = 'msg-link';
    a.appendChild(document.createTextNode(sanitizeText(msg.url)));
    bubble.appendChild(a);
    if (msg.text) {
      bubble.appendChild(document.createElement('br'));
      bubble.appendChild(document.createTextNode(sanitizeText(msg.text)));
    }

  } else {
    // Plain text — parse inline URLs
    const parts = parseTextWithUrls(sanitizeText(msg.text || ''));
    parts.forEach(part => bubble.appendChild(part));
  }

  // Meta row
  const meta   = document.createElement('div');
  meta.className = 'msg-meta';

  const timeEl = document.createElement('span');
  timeEl.className = 'msg-time';
  timeEl.appendChild(document.createTextNode(formatTime(msg.ts)));
  meta.appendChild(timeEl);

  if (isOut) {
    const checks = document.createElement('span');
    checks.className = 'msg-checks ' + (msg.status === 'read' ? 'read' : 'delivered');
    checks.setAttribute('data-key', key);
    checks.appendChild(document.createTextNode(msg.status === 'read' ? '✓✓' : '✓'));
    meta.appendChild(checks);
  }

  wrapper.appendChild(bubble);
  wrapper.appendChild(meta);
  return wrapper;
}

function parseTextWithUrls(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts    = text.split(urlRegex);
  return parts.map(part => {
    if (/^https?:\/\//.test(part)) {
      const a    = document.createElement('a');
      a.href     = part;
      a.target   = '_blank';
      a.rel      = 'noopener noreferrer';
      a.className = 'msg-link';
      a.appendChild(document.createTextNode(part));
      return a;
    }
    return document.createTextNode(part);
  });
}

function appendMsg(key, msg) {
  document.getElementById('messages-list').appendChild(buildMsgElement(key, msg));
}

function buildDaySeparator(text) {
  const sep = document.createElement('div');
  sep.className = 'day-separator';
  sep.appendChild(document.createTextNode(sanitizeText(text)));
  return sep;
}

function scrollToBottom() {
  const c    = document.getElementById('messages-container');
  c.scrollTop = c.scrollHeight;
}

// ──────────────────────────────────────────
// 16. SEND MESSAGE
// ──────────────────────────────────────────
async function sendMessage(msgData) {
  if (!currentChatId || !currentUser) return;
  const ref  = db.ref('chats/' + currentChatId + '/messages').push();
  const data = Object.assign(
    { from: currentUser.uid, ts: firebase.database.ServerValue.TIMESTAMP, status: 'delivered' },
    msgData
  );
  await ref.set(data);

  const preview = msgData.text ||
    (msgData.type === 'image' ? '🖼 Imagen' :
     msgData.type === 'video' ? '🎬 Video'  :
     msgData.type === 'audio' ? '🎵 Audio'  : '🔗 Enlace');

  const chatMeta = {
    uid: currentContactId,
    name: currentContactData.name || 'Usuario',
    photoURL: currentContactData.photoURL || '',
    lastMsg: preview,
    lastTime: firebase.database.ServerValue.TIMESTAMP
  };
  await db.ref('userChats/' + currentUser.uid + '/' + currentContactId).update(chatMeta);

  const mySnap = await db.ref('users/' + currentUser.uid).once('value');
  const myInfo = mySnap.val() || {};
  await db.ref('userChats/' + currentContactId + '/' + currentUser.uid).update({
    uid: currentUser.uid,
    name: myInfo.name || currentUser.displayName || 'Usuario',
    photoURL: myInfo.photoURL || '',
    lastMsg: preview,
    lastTime: firebase.database.ServerValue.TIMESTAMP
  });
}

// Send text
document.getElementById('btn-send').addEventListener('click', handleSendText);

document.getElementById('message-input').addEventListener('keydown', function (e) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (e.key === 'Enter' && !e.shiftKey) {
    if (!isMobile) {
      // Desktop: Enter sends
      e.preventDefault();
      handleSendText();
    }
    // Mobile: Enter = newline (natural behavior)
  }
  // Shift+Enter always = newline (both platforms)
});

// Typing indicator
document.getElementById('message-input').addEventListener('input', function () {
  if (!currentChatId) return;
  db.ref('chats/' + currentChatId + '/typing/' + currentUser.uid).set(true);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    db.ref('chats/' + currentChatId + '/typing/' + currentUser.uid).set(false);
  }, 2000);
});

function handleSendText() {
  const input = document.getElementById('message-input');
  const text  = input.innerText.trim();
  if (!text || !currentChatId) return;
  input.innerText = '';
  if (isUrl(text)) {
    sendMessage({ type: getMediaType(text), url: text, text: '' });
  } else {
    sendMessage({ type: 'text', text });
  }
  db.ref('chats/' + currentChatId + '/typing/' + currentUser.uid).set(false);
}

// ──────────────────────────────────────────
// 17. TYPING LISTENER
// ──────────────────────────────────────────
function listenTyping() {
  if (!currentChatId || !currentContactId) return;
  db.ref('chats/' + currentChatId + '/typing/' + currentContactId).on('value', snap => {
    const ind = document.getElementById('typing-indicator');
    if (snap.val()) { ind.classList.remove('hidden'); scrollToBottom(); }
    else              ind.classList.add('hidden');
  });
}

// ──────────────────────────────────────────
// 18. ATTACH PANEL
// ──────────────────────────────────────────
document.getElementById('btn-attach').addEventListener('click', () => {
  document.getElementById('attach-panel').classList.toggle('hidden');
  document.getElementById('emoji-panel').classList.add('hidden');
  document.getElementById('voice-panel').classList.add('hidden');
});

document.getElementById('btn-cancel-attach').addEventListener('click', () => {
  document.getElementById('attach-panel').classList.add('hidden');
  document.getElementById('attach-url').value = '';
});

document.getElementById('btn-send-attach').addEventListener('click', () => {
  const url  = document.getElementById('attach-url').value.trim();
  const type = document.getElementById('attach-type').value;
  if (!url || !isUrl(url)) { alert('Por favor ingresa una URL válida.'); return; }
  sendMessage({ type, url, text: '' });
  document.getElementById('attach-panel').classList.add('hidden');
  document.getElementById('attach-url').value = '';
});

// ──────────────────────────────────────────
// 19. EMOJI PANEL
// ──────────────────────────────────────────
document.getElementById('btn-emoji').addEventListener('click', () => {
  document.getElementById('emoji-panel').classList.toggle('hidden');
  document.getElementById('attach-panel').classList.add('hidden');
  document.getElementById('voice-panel').classList.add('hidden');
});

document.querySelector('emoji-picker').addEventListener('emoji-click', e => {
  const input = document.getElementById('message-input');
  input.focus();
  const selection = window.getSelection();
  if (selection.rangeCount) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(e.detail.unicode));
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    input.appendChild(document.createTextNode(e.detail.unicode));
  }
  document.getElementById('emoji-panel').classList.add('hidden');
});

// ──────────────────────────────────────────
// 20. VOICE PANEL
// ──────────────────────────────────────────
document.getElementById('btn-voice').addEventListener('click', () => {
  document.getElementById('voice-panel').classList.toggle('hidden');
  document.getElementById('emoji-panel').classList.add('hidden');
  document.getElementById('attach-panel').classList.add('hidden');
});

document.getElementById('btn-cancel-voice').addEventListener('click', () => {
  document.getElementById('voice-panel').classList.add('hidden');
  document.getElementById('voice-url').value = '';
});

document.getElementById('btn-send-voice').addEventListener('click', () => {
  const url = document.getElementById('voice-url').value.trim();
  if (!url || !isUrl(url)) { alert('Por favor ingresa una URL válida de audio.'); return; }
  sendMessage({ type: 'audio', url, text: '' });
  document.getElementById('voice-panel').classList.add('hidden');
  document.getElementById('voice-url').value = '';
});

// ──────────────────────────────────────────
// 21. ADD CONTACT
// ──────────────────────────────────────────
document.getElementById('btn-add-contact').addEventListener('click', () => openModal('modal-add-contact'));

document.getElementById('btn-search-user').addEventListener('click', async () => {
  const query     = document.getElementById('add-contact-query').value.trim().toLowerCase();
  if (!query) return;
  const resultsEl  = document.getElementById('search-results');
  resultsEl.innerHTML = '';

  const loadingEl  = document.createElement('p');
  loadingEl.style.fontSize = '0.88rem';
  loadingEl.style.color    = 'var(--text-muted)';
  loadingEl.appendChild(document.createTextNode('Buscando...'));
  resultsEl.appendChild(loadingEl);

  const snap  = await db.ref('users').once('value');
  const users = snap.val() || {};
  resultsEl.innerHTML = '';

  let found = false;
  Object.entries(users).forEach(([uid, userData]) => {
    if (uid === currentUser.uid) return;
    const nameMatch  = (userData.name  || '').toLowerCase().includes(query);
    const emailMatch = (userData.email || '').toLowerCase() === query;
    if (nameMatch || emailMatch) {
      found = true;
      resultsEl.appendChild(buildSearchResultItem(uid, userData));
    }
  });

  if (!found) {
    const noResult = document.createElement('p');
    noResult.style.fontSize = '0.88rem';
    noResult.style.color    = 'var(--text-muted)';
    noResult.appendChild(document.createTextNode('No se encontraron usuarios.'));
    resultsEl.appendChild(noResult);
  }
});

// Enter key en búsqueda
document.getElementById('add-contact-query').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('btn-search-user').click();
});

function buildSearchResultItem(uid, userData) {
  const item = document.createElement('div');
  item.className = 'search-result-item';

  const avatar = document.createElement('div');
  avatar.className = 'search-result-avatar';
  buildAvatar(avatar, userData.name, userData.photoURL);

  const info = document.createElement('div');
  info.className = 'search-result-info';

  const name = document.createElement('div');
  name.className = 'search-result-name';
  name.appendChild(document.createTextNode(sanitizeText(userData.name || 'Usuario')));

  const email = document.createElement('div');
  email.className = 'search-result-email';
  email.appendChild(document.createTextNode(sanitizeText(userData.email || '')));

  info.appendChild(name);
  info.appendChild(email);

  const addBtn = document.createElement('button');
  addBtn.className = 'search-result-add';
  addBtn.appendChild(document.createTextNode('Chatear'));
  addBtn.addEventListener('click', async () => {
    const mySnap = await db.ref('users/' + currentUser.uid).once('value');
    const myInfo = mySnap.val() || {};

    await db.ref('userChats/' + currentUser.uid + '/' + uid).update({
      uid,
      name: userData.name || 'Usuario',
      photoURL: userData.photoURL || '',
      lastMsg: '',
      lastTime: firebase.database.ServerValue.TIMESTAMP
    });
    await db.ref('userChats/' + uid + '/' + currentUser.uid).update({
      uid: currentUser.uid,
      name: myInfo.name || currentUser.displayName || 'Usuario',
      photoURL: myInfo.photoURL || '',
      lastMsg: '',
      lastTime: firebase.database.ServerValue.TIMESTAMP
    });

    closeModal('modal-add-contact');
    document.getElementById('add-contact-query').value = '';
    document.getElementById('search-results').innerHTML = '';
    openChat({ uid, name: userData.name, photoURL: userData.photoURL || '' });
  });

  item.appendChild(avatar);
  item.appendChild(info);
  item.appendChild(addBtn);
  return item;
}

// ──────────────────────────────────────────
// 22. VIEW CONTACT PROFILE
// ──────────────────────────────────────────
document.getElementById('btn-view-profile').addEventListener('click', async () => {
  if (!currentContactId) return;
  const snap = await db.ref('users/' + currentContactId).once('value');
  const data = snap.val() || {};

  buildAvatar(document.getElementById('view-profile-avatar'), data.name, data.photoURL);

  document.getElementById('view-profile-name').textContent = '';
  document.getElementById('view-profile-name').appendChild(document.createTextNode(sanitizeText(data.name || 'Usuario')));

  const onlineEl = document.getElementById('view-profile-online');
  const onSnap   = await db.ref('users/' + currentContactId + '/online').once('value');
  const isOnline = onSnap.val();
  onlineEl.textContent = '';
  onlineEl.className   = 'view-profile-status' + (isOnline ? ' online' : '');
  onlineEl.appendChild(document.createTextNode(isOnline ? '● En línea' : '○ Desconectado'));

  document.getElementById('view-profile-bio').textContent = '';
  document.getElementById('view-profile-bio').appendChild(document.createTextNode(sanitizeText(data.bio || 'Sin descripción.')));

  openModal('modal-view-profile');
});

// ──────────────────────────────────────────
// 23. NOTIFICATIONS
// ──────────────────────────────────────────
function requestNotifPermission() {
  if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(p => { notifPermission = p === 'granted'; });
  }
}

function notify(title, body) {
  try {
    const snd = document.getElementById('notif-sound');
    snd.currentTime = 0;
    snd.play().catch(() => {});
  } catch {}

  if (!document.hasFocus()) {
    let toggle = false;
    clearInterval(docTitleInterval);
    docTitleInterval = setInterval(() => {
      document.title = toggle ? '🍕 Nuevo mensaje!' : originalTitle;
      toggle = !toggle;
    }, 1000);
    window.addEventListener('focus', () => {
      clearInterval(docTitleInterval);
      document.title = originalTitle;
    }, { once: true });
  }

  if (notifPermission && !document.hasFocus()) {
    try {
      new Notification('PizzaChat 🍕 — ' + sanitizeText(title), {
        body: sanitizeText(body),
        icon: 'https://em-content.zobj.net/source/noto-emoji/406/pizza_1f355.png'
      });
    } catch {}
  }
}

// ──────────────────────────────────────────
// 24. LOGOUT
// ──────────────────────────────────────────
document.getElementById('btn-logout').addEventListener('click', async () => {
  await setOnlineStatus(false);
  await auth.signOut();
  currentChatId      = null;
  currentContactId   = null;
  currentContactData = null;
  document.getElementById('messages-list').innerHTML  = '';
  document.getElementById('contact-list').innerHTML   = '';
  document.getElementById('chat-window').classList.add('hidden');
  document.getElementById('welcome-screen').classList.remove('hidden');
});

// ──────────────────────────────────────────
// 25. THEME BUTTON
// ──────────────────────────────────────────
document.getElementById('btn-theme').addEventListener('click', cycleTheme);

// ──────────────────────────────────────────
// 26. MODALS — CLOSE
// ──────────────────────────────────────────
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.modal));
});
document.querySelectorAll('.modal-backdrop').forEach(bd => {
  bd.addEventListener('click', () => bd.closest('.modal').classList.add('hidden'));
});

// ──────────────────────────────────────────
// 27. MOBILE SIDEBAR
// ──────────────────────────────────────────
function closeSidebarMobile() {
  if (window.innerWidth <= 700) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.add('hidden');
  }
}

document.getElementById('btn-back-sidebar').addEventListener('click', () => {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.remove('hidden');
  document.getElementById('chat-window').classList.add('hidden');
  document.getElementById('welcome-screen').classList.remove('hidden');
});

document.getElementById('sidebar-overlay').addEventListener('click', closeSidebarMobile);

window.addEventListener('resize', () => {
  if (window.innerWidth > 700) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.add('hidden');
  }
});

// ──────────────────────────────────────────
// 28. CLOSE PANELS ON OUTSIDE CLICK
// ──────────────────────────────────────────
document.addEventListener('click', e => {
  if (!e.target.closest('#btn-emoji')  && !e.target.closest('#emoji-panel'))
    document.getElementById('emoji-panel').classList.add('hidden');
  if (!e.target.closest('#btn-attach') && !e.target.closest('#attach-panel'))
    document.getElementById('attach-panel').classList.add('hidden');
  if (!e.target.closest('#btn-voice')  && !e.target.closest('#voice-panel'))
    document.getElementById('voice-panel').classList.add('hidden');
});

// ──────────────────────────────────────────
// 29. MARK MESSAGES READ
// ──────────────────────────────────────────
document.getElementById('messages-container').addEventListener('scroll', markVisibleRead);
window.addEventListener('focus', markVisibleRead);

function markVisibleRead() {
  if (!currentChatId || !currentUser || !currentContactId) return;
  db.ref('chats/' + currentChatId + '/messages')
    .orderByChild('from').equalTo(currentContactId)
    .once('value', snap => {
      const msgs = snap.val() || {};
      Object.entries(msgs).forEach(([key, msg]) => {
        if (msg.status !== 'read') {
          db.ref('chats/' + currentChatId + '/messages/' + key + '/status').set('read');
        }
      });
    });
}
