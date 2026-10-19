/**
 * nav.js – Hamburger menu toggle & Active nav-link highlight
 */

'use strict';

const hamburger   = document.getElementById('navHamburger');
const navLinksEl  = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');
const nav         = document.querySelector('nav');

/* ── Hamburger open / close & Accessibility ── */
function closeMenu(restoreFocus = false) {
  if (!navLinksEl.classList.contains('open')) return;
  hamburger.classList.remove('open');
  navLinksEl.classList.remove('open');
  if (navBackdrop) navBackdrop.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
  document.body.style.overflow = '';
  if (restoreFocus && hamburger) {
    hamburger.focus();
  }
}

function openMenu() {
  hamburger.classList.add('open');
  navLinksEl.classList.add('open');
  if (navBackdrop) navBackdrop.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
  document.body.style.overflow = 'hidden';

  // Move focus to first menu link for keyboard accessibility
  const firstLink = navLinksEl.querySelector('a');
  if (firstLink) {
    setTimeout(() => firstLink.focus(), 50);
  }
}

function toggleMenu() {
  const isOpen = navLinksEl.classList.contains('open');
  if (isOpen) {
    closeMenu(true);
  } else {
    openMenu();
  }
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMenu);
}

if (navBackdrop) {
  navBackdrop.addEventListener('click', () => closeMenu(true));
}

document.addEventListener('click', (e) => {
  if (!navLinksEl.classList.contains('open')) return;
  if (!navLinksEl.contains(e.target) && !hamburger.contains(e.target) && (!navBackdrop || !navBackdrop.contains(e.target))) {
    closeMenu(true);
  }
});

navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu(false)));
const navLogo = document.querySelector('.nav-logo');
if (navLogo) navLogo.addEventListener('click', () => closeMenu(false));

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinksEl.classList.contains('open')) {
    closeMenu(true);
  }
});

// Trap keyboard focus inside mobile menu panel while open
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !navLinksEl.classList.contains('open')) return;

  const focusable = [
    ...navLinksEl.querySelectorAll('a'),
    document.getElementById('themeToggle'),
    hamburger
  ].filter(el => el && el.offsetParent !== null);

  if (focusable.length === 0) return;

  const firstEl = focusable[0];
  const lastEl = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    }
  } else {
    if (document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMenu(false);
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
