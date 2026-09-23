/**
 * main.js – Core Initialization
 * Handles:
 *  1. Scroll-reveal (IntersectionObserver)
 *  2. Hero text staggered entrance
 *  3. Stat counter animation
 *  4. Skill bar animation
 *  5. Skill tab filtering
 *  6. Back-to-top button
 */

'use strict';

/* ── 1. Scroll Reveal ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);
revealEls.forEach((el) => revealObserver.observe(el));

/* Fallback: immediately reveal elements in viewport on load */
setTimeout(() => {
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('visible');
  });
}, 100);

/* ── 2. Hero Text Staggered Entrance ── */
document.querySelectorAll('.hero-text > *').forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease`;
  setTimeout(() => {
    el.style.opacity   = '1';
    el.style.transform = 'none';
  }, 80 + i * 70);
});

/* ── 3. Stat Counter Animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const duration = 1400;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.stat-num');
        if (numEl) animateCounter(numEl);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.stat-card').forEach((el) => statObserver.observe(el));

/* ── 4. Skill Bar Animation ── */
const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-bar');
        if (bar) {
          const level = bar.dataset.level || '0';
          setTimeout(() => { bar.style.width = level + '%'; }, 100);
        }
        skillBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll('.skill-card').forEach((el) => skillBarObserver.observe(el));

/* ── 5. Skill Tab Filtering ── */
const tabs = document.querySelectorAll('.skill-tab');
const skillCards = document.querySelectorAll('.skill-card');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.tab;

    skillCards.forEach((card) => {
      const categories = (card.dataset.category || '').split(' ');
      const show = filter === 'all' || categories.includes(filter);
      card.style.display = show ? '' : 'none';
    });
  });
});

/* ── 6. Back-to-Top Button ── */
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
