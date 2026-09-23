/**
 * nav.js – Hamburger menu toggle & Active nav-link highlight
 */

'use strict';

const hamburger  = document.getElementById('navHamburger');
const navLinksEl = document.getElementById('navLinks');
const nav        = document.querySelector('nav');

/* ── Hamburger open / close ── */
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

navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 640) closeMenu();
});

/* ── Active section highlight ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* ── Nav scrolled state ── */
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });
