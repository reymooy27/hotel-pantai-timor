/* ===================== NAV SCROLL ===================== */
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ===================== MOBILE MENU ===================== */
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

/* ===================== SMOOTH SCROLL (fallback) ===================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===================== FORM → WHATSAPP ===================== */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    const text = `Halo, saya ${name}.\n${subject ? 'Keperluan: ' + subject + '\n' : ''}${message}`;
    window.open(`https://wa.me/6281246007575?text=${encodeURIComponent(text)}`, '_blank');
    form.reset();
  });
}

/* ===================== INTERSECTION OBSERVER ===================== */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(el => observer.observe(el));
