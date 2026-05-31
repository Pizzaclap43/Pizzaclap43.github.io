/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Mobile nav toggle ── */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

/* ── Reveal on scroll ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .step-item').forEach(el => revealObserver.observe(el));

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id], div[id="footer"]');
const navLinksAll = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinksAll.forEach(l => l.classList.remove('active'));
            const match = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
            if (match) match.classList.add('active');
        }
    });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

/* ── Server status ── */
async function updateStatus() {
    // Usando el proxy optimizado proporcionado por ElmichiYT
    const target = "https://cc-server-proxy.elmichiyt.workers.dev/";
    
    function formatUptime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        let parts = [];
        if (h > 0) parts.push(`${h} h`);
        if (m > 0 || h > 0) parts.push(`${m} m`);
        parts.push(`${s} s`);

        return parts.join(', ');
    }

    try {
        const response = await fetch(target);
        if (!response.ok) throw new Error("Error en el servidor");
        
        const data = await response.json();
        
        const myServer = data.servers.find(s => s.hash === '73a30f1191366a1ac56bc4432bbb0225');
        
        const dot     = document.getElementById('status-dot');
        const text    = document.getElementById('status-text');
        const players = document.getElementById('player-count');
        const uptime  = document.getElementById('server-time');

        if (myServer && dot) {
            dot.className = 'sb-dot online';
            text.textContent = 'Online';
            players.textContent = `${myServer.players}/${myServer.maxplayers} jugadores`;
            if (uptime) uptime.textContent = formatUptime(myServer.uptime);
        } else if (dot) {
            dot.className = 'sb-dot offline';
            text.textContent = 'Offline';
            players.textContent = '— jugadores';
            if (uptime) uptime.textContent = '—';
        }
    } catch (error) {
        console.error('Error:', error);
        const text = document.getElementById('status-text');
        if (text) text.textContent = 'Sin conexión';
    }
}

updateStatus();
setInterval(updateStatus, 15000);
