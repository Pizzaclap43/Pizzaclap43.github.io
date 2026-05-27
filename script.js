// Splash: bloquear scroll mientras carga
document.body.style.overflow = 'hidden';
setTimeout(() => { document.body.style.overflow = ''; }, 3400);

// Navbar: clase scrolled al bajar
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// Navbar: toggle mobile
document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
});

// Cerrar menu mobile al hacer click en un link
document.querySelectorAll('.nav-link:not(.nav-soon)').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
    });
});
