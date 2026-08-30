const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.08 });
revealEls.forEach(el => observer.observe(el));
// Fallback: elemen yang sudah di viewport saat load langsung diberi class visible
setTimeout(() => {
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight) el.classList.add('visible');
  });
}, 100);

const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(22,163,74,0.14)' : '0 2px 20px rgba(22,163,74,0.07)';
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if(window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + current ? 'var(--primary)' : ''; });
});

const titles = ['AI & ML Enthusiast','Web Developer','Deepfake Researcher','Mahasiswa Teknik Informatika'];
let tIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.querySelector('.hero-subtitle');
function typeLoop() {
  const full = titles[tIdx];
  if(!deleting){ cIdx++; typingEl.textContent = full.slice(0,cIdx); if(cIdx===full.length){ deleting=true; setTimeout(typeLoop,1800); return; } }
  else { cIdx--; typingEl.textContent = full.slice(0,cIdx); if(cIdx===0){ deleting=false; tIdx=(tIdx+1)%titles.length; } }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
  btn.style.background = 'linear-gradient(135deg,#16a34a,#4ade80)';
  setTimeout(() => { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pesan'; btn.style.background=''; e.target.reset(); }, 3000);
}

document.querySelectorAll('.hero-text > *').forEach((el, i) => {
  el.style.opacity = '0'; el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.7s ${i * 0.1}s, transform 0.7s ${i * 0.1}s`;
  setTimeout(() => { el.style.opacity='1'; el.style.transform='none'; }, 150 + i * 80);
});

// ── Hamburger Menu ──
const hamburger = document.getElementById('navHamburger');
const navLinksEl = document.getElementById('navLinks');

function closeMenu() {
  hamburger.classList.remove('open');
  navLinksEl.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Tutup menu saat salah satu link diklik
navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// Tutup menu saat resize ke desktop
window.addEventListener('resize', () => { if(window.innerWidth > 640) closeMenu(); });

