/**
 * ==========================================================================
 * MOTION.JS — Elegant, Luxurious & Non-Destructive Motion Runtime Layer
 * Antigravity Portfolio | Handcrafted Pure Vanilla JS (Zero External Libraries)
 * 
 * STRICT ARCHITECTURAL & SAFETY RULES:
 * 1. Global Master Switch: MX_ENABLED = true. Set to false to disable all motion.
 * 2. 3D objects, hero photo 3D, and About lanyard card are 100% UNTOUCHED.
 * 3. Zero MutationObserver loops: active nav pill & dots sync inside single RAF scroll.
 * 4. Idempotent DOM transforms: guarded with `data-mx-done` to prevent re-splitting.
 * 5. Isolated error boundaries: every effect is wrapped in its own try/catch.
 * 6. Zero idle CPU: requestAnimationFrame is purely event-driven, never looping idle.
 * ==========================================================================
 */

'use strict';

// ── MASTER SWITCH ──
// Set to false to instantly neutralize the entire motion runtime.
const MX_ENABLED = true;

(function () {
  if (!MX_ENABLED) {
    return;
  }

  // Progressive enhancement root flag
  document.documentElement.classList.add('mx-js');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Strict Exclusion Checker: NEVER touch 3D elements, canvas, lanyard, or modals
  function isExcluded(el) {
    if (!el || !(el instanceof Element)) return true;
    return (
      el.closest(
        '#spaceCanvas, #bgCanvas, #cursorGlow, .ag3d-scene, .hero-photo-col, #heroCard3d, .lanyard-scene, #lanyardScene, #galleryModal, #projectModal, #certLightbox, .marquee-section'
      ) !== null
    );
  }

  // ── 1. Hero Text Staggered Entrance (Left Column Only) ──
  function initHeroEntrance() {
    try {
      const heroSection = document.getElementById('hero');
      if (!heroSection || heroSection.dataset.mxDone === 'true') return;
      heroSection.dataset.mxDone = 'true';

      if (prefersReduced) {
        heroSection.classList.add('mx-hero-ready');
        return;
      }

      requestAnimationFrame(() => {
        setTimeout(() => {
          heroSection.classList.add('mx-hero-ready');
        }, 50);
      });
    } catch (err) {
      console.error('[Motion] initHeroEntrance failed:', err);
    }
  }

  // ── 2. Floating Glass Island Navbar, Sliding Pill & Rolling Text ──
  let navPillEl = null;
  let navLinksContainer = null;
  let lastActiveLink = null;

  function initNavbarMotion() {
    try {
      const mainNav = document.getElementById('mainNav');
      navLinksContainer = document.getElementById('navLinks');
      if (!mainNav || !navLinksContainer || navLinksContainer.dataset.mxDone === 'true') return;
      navLinksContainer.dataset.mxDone = 'true';

      // A. Create sliding active pill (placed once)
      navPillEl = document.createElement('li');
      navPillEl.className = 'mx-nav-pill';
      navPillEl.setAttribute('aria-hidden', 'true');
      navLinksContainer.appendChild(navPillEl);

      // B. Rolling text on desktop menu items (run once with guard)
      const links = navLinksContainer.querySelectorAll('a');
      links.forEach((a) => {
        if (a.dataset.mxDone === 'true') return;
        const origText = a.textContent.trim();
        if (!origText) return;

        a.dataset.mxDone = 'true';
        a.setAttribute('aria-label', origText);
        a.innerHTML = `
          <span class="mx-roll" aria-hidden="true">
            <span class="mx-roll-inner">
              <span class="mx-roll-item">${origText}</span>
              <span class="mx-roll-item">${origText}</span>
            </span>
          </span>
        `;
      });

      // Synchronize pill position initially
      syncActiveNavPill();

      window.addEventListener('resize', syncActiveNavPill, { passive: true });
    } catch (err) {
      console.error('[Motion] initNavbarMotion failed:', err);
    }
  }

  function syncActiveNavPill() {
    if (!navPillEl || !navLinksContainer) return;

    if (window.innerWidth <= 860) {
      navPillEl.classList.remove('mx-active');
      return;
    }

    const activeLink = navLinksContainer.querySelector('a.active');
    if (!activeLink) {
      navPillEl.classList.remove('mx-active');
      lastActiveLink = null;
      return;
    }

    if (activeLink === lastActiveLink && navPillEl.classList.contains('mx-active')) {
      return; // No layout read needed if active link has not changed
    }

    lastActiveLink = activeLink;
    const rect = activeLink.getBoundingClientRect();
    const parentRect = navLinksContainer.getBoundingClientRect();
    const left = rect.left - parentRect.left;

    navPillEl.style.transform = `translateX(${left}px) translateY(-50%)`;
    navPillEl.style.width = `${rect.width}px`;
    navPillEl.classList.add('mx-active');
  }

  // ── 3. Scroll Progress Indicator (Top 3px Line) ──
  let progressLine = null;

  function initScrollProgress() {
    try {
      if (document.querySelector('.mx-scroll-progress')) return;
      progressLine = document.createElement('div');
      progressLine.className = 'mx-scroll-progress';
      progressLine.setAttribute('aria-hidden', 'true');
      document.body.appendChild(progressLine);
    } catch (err) {
      console.error('[Motion] initScrollProgress failed:', err);
    }
  }

  // ── 5. Section Boundary Divider Lines ──
  function initSectionDividers() {
    try {
      const targetSectionIds = ['about', 'skills', 'timeline', 'certificates', 'contact'];
      targetSectionIds.forEach((id) => {
        const sec = document.getElementById(id);
        if (!sec || sec.dataset.mxLineDone === 'true') return;
        sec.dataset.mxLineDone = 'true';

        const container = sec.querySelector('.section-container') || sec;
        const line = document.createElement('div');
        line.className = 'mx-section-line';
        line.setAttribute('aria-hidden', 'true');
        container.insertBefore(line, container.firstChild);

        if (prefersReduced) {
          line.classList.add('mx-drawn');
        } else {
          const lineObs = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('mx-drawn');
                  lineObs.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.1 }
          );
          lineObs.observe(line);
        }
      });

      // Animate existing small accent lines under titles (.section-divider)
      const existingDividers = document.querySelectorAll('.section-divider');
      existingDividers.forEach((div) => {
        if (isExcluded(div) || div.dataset.mxDone === 'true') return;
        div.dataset.mxDone = 'true';

        if (prefersReduced) {
          div.classList.add('mx-drawn');
        } else {
          const divObs = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('mx-drawn');
                  divObs.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.2 }
          );
          divObs.observe(div);
        }
      });
    } catch (err) {
      console.error('[Motion] initSectionDividers failed:', err);
    }
  }

  // ── 6. Contact Title Word-by-Word Reveal ──
  function initContactTitleReveal() {
    try {
      const contactSec = document.getElementById('contact');
      if (!contactSec) return;
      const title = contactSec.querySelector('.section-title');
      if (!title || isExcluded(title) || title.dataset.mxDone === 'true') return;
      title.dataset.mxDone = 'true';

      const originalText = title.textContent.trim();
      const words = originalText.split(/\s+/);

      title.innerHTML = words
        .map(
          (word, idx) =>
            `<span class="mx-word-mask" aria-hidden="true"><span class="mx-word-inner" style="transition-delay: ${
              idx * 70
            }ms;">${word}</span></span>`
        )
        .join(' ') +
        `<span class="sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">${originalText}</span>`;

      if (prefersReduced) {
        title.querySelectorAll('.mx-word-mask').forEach((m) => m.classList.add('mx-word-in'));
        return;
      }

      const titleObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.querySelectorAll('.mx-word-mask').forEach((m) => m.classList.add('mx-word-in'));
              titleObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      titleObs.observe(title);
    } catch (err) {
      console.error('[Motion] initContactTitleReveal failed:', err);
    }
  }

  // ── 7. Staggered Scroll Reveal Elements ──
  function initScrollReveal() {
    try {
      const candidateSelectors = [
        '#skills .skill-card',
        '#timeline .tl-item',
        '#projects .project-card',
        '#certificates .cert-card',
        '#organizations .org-card',
        '#about .detail-item',
        '#about .about-content-col > p:not(.about-p1):not(.about-p2)',
        '#contact .contact-item',
        '#contact .contact-card',
        '#contact .availability-badge',
        '#cta-banner .cta-banner-inner'
      ];

      const elements = document.querySelectorAll(candidateSelectors.join(', '));
      const targets = [];

      elements.forEach((el) => {
        if (isExcluded(el) || el.classList.contains('mx-reveal')) return;
        el.classList.add('mx-reveal');
        targets.push(el);
      });

      if (prefersReduced) {
        targets.forEach((el) => el.classList.add('mx-in'));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              let siblingIndex = 0;
              if (el.parentElement) {
                const siblings = Array.from(el.parentElement.children).filter((c) =>
                  c.classList.contains('mx-reveal')
                );
                siblingIndex = Math.max(0, siblings.indexOf(el)) % 6;
              }
              const delay = siblingIndex * 90;
              el.style.transitionDelay = `${delay}ms`;
              el.classList.add('mx-in');
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.15 }
      );

      targets.forEach((el) => observer.observe(el));

      // Immediate reveal fallback for dynamic filtering and pagination
      function revealAllCards() {
        document.querySelectorAll('.project-card, .cert-card, .skill-card').forEach((card) => {
          card.classList.add('mx-in');
        });
      }

      document
        .querySelectorAll('.project-tab, .cert-tab, .skill-tab, #certLoadMoreBtn, .filter-btn')
        .forEach((btn) => {
          btn.addEventListener('click', () => {
            setTimeout(revealAllCards, 50);
          });
        });
    } catch (err) {
      console.error('[Motion] initScrollReveal failed:', err);
    }
  }

  // ── 8. Timeline Progress Sync ──
  function updateTimelineProgress() {
    const timelineSec = document.getElementById('timeline') || document.getElementById('journey');
    if (!timelineSec) return;

    const line = timelineSec.querySelector('.timeline-line');
    if (!line) return;

    const rect = timelineSec.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom < 0 || rect.top > winH) return;

    const progress = (winH * 0.6 - rect.top) / (rect.height * 0.8 || 1);
    const clamped = Math.min(100, Math.max(0, progress * 100));
    line.style.setProperty('--tl-p', `${clamped}%`);
  }

  // ── 10. Large Color Block Expanding Inset (Desktop > 860px) ──
  const expandBlocks = [];

  function initBlockExpand() {
    try {
      const projectsSec = document.getElementById('projects');
      if (projectsSec && !isExcluded(projectsSec) && projectsSec.dataset.mxDone !== 'true') {
        projectsSec.dataset.mxDone = 'true';
        projectsSec.classList.add('mx-block-expand');
        expandBlocks.push(projectsSec);
      }
    } catch (err) {
      console.error('[Motion] initBlockExpand failed:', err);
    }
  }

  function updateBlockExpand() {
    if (prefersReduced || window.innerWidth <= 860 || expandBlocks.length === 0) {
      expandBlocks.forEach((block) => {
        block.style.marginLeft = '';
        block.style.marginRight = '';
        block.style.borderRadius = '';
      });
      return;
    }

    const winH = window.innerHeight;
    expandBlocks.forEach((block) => {
      const rect = block.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > winH) return;

      const p = Math.min(1, Math.max(0, (winH - rect.top) / (winH * 0.55)));

      if (p >= 1) {
        block.style.marginLeft = '';
        block.style.marginRight = '';
        block.style.borderRadius = '';
      } else {
        const insetVw = (1 - p) * 5;
        const radiusPx = 36 + (1 - p) * 44;
        block.style.marginLeft = `calc(14px + ${insetVw}vw)`;
        block.style.marginRight = `calc(14px + ${insetVw}vw)`;
        block.style.borderRadius = `${radiusPx}px`;
      }
    });
  }

  // ── 11. Buttons: Light Sheen Sweep & Magnetic Hover ──
  function isMagneticEligible(btn) {
    if (!btn || isExcluded(btn)) return false;
    if (btn.id === 'themeToggle' || btn.id === 'backToTop') return false;
    if (
      btn.closest(
        '#themeToggle, #backToTop, #galleryModal, #projectModal, #certLightbox, .projects-tabs, .cert-tabs, .skill-tabs, .gallery-nav, .nav-links'
      )
    ) {
      return false;
    }
    if (
      btn.classList.contains('filter-btn') ||
      btn.classList.contains('project-tab') ||
      btn.classList.contains('cert-tab') ||
      btn.classList.contains('skill-tab')
    ) {
      return false;
    }
    return true;
  }

  function initButtons() {
    try {
      const buttons = document.querySelectorAll(
        '.btn-primary, .btn-outline, .btn-cv, .btn-full, .btn-card-primary, .btn-card-action'
      );

      buttons.forEach((btn) => {
        if (!isMagneticEligible(btn) || btn.dataset.mxDone === 'true') return;
        btn.dataset.mxDone = 'true';

        // A. Surface Light Sheen Sweep
        btn.classList.add('mx-btn-shine');

        // B. Subtle Magnetic Hover (Pointer Devices > 860px)
        if (!prefersReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          btn.classList.add('mx-magnetic');

          btn.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 860) return;
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const diffX = e.clientX - centerX;
            const diffY = e.clientY - centerY;
            const dist = Math.hypot(diffX, diffY);
            const maxShift = 6;
            const ratio = Math.min(dist, maxShift) / (dist || 1);

            btn.style.translate = `${diffX * ratio * 0.35}px ${diffY * ratio * 0.35}px`;
          });

          btn.addEventListener('mouseleave', () => {
            btn.style.translate = '0px 0px';
          });
        }
      });
    } catch (err) {
      console.error('[Motion] initButtons failed:', err);
    }
  }

  // ── 12. Single Consolidated RAF Scroll Loop ──
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(runScrollFrame);
      ticking = true;
    }
  }

  function runScrollFrame() {
    try {
      const scrollY = window.scrollY;

      // A. Top Scroll Progress Indicator
      if (progressLine) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
        progressLine.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      }

      // B. Navbar Scrolled Island Compression (> 80px)
      const mainNav = document.getElementById('mainNav');
      if (mainNav) {
        mainNav.classList.toggle('mx-scrolled', scrollY > 80);
      }

      // C. Sync Active Navigation Indicator Pill
      syncActiveNavPill();

      // D. Timeline Progress Line
      updateTimelineProgress();

      // E. Large Block Expanding Inset
      updateBlockExpand();
    } catch (err) {
      console.error('[Motion] runScrollFrame error:', err);
    } finally {
      ticking = false;
    }
  }

  // ── Initialization Entry Point ──
  function init() {
    initHeroEntrance();
    initNavbarMotion();
    initScrollProgress();
    initSectionDividers();
    initContactTitleReveal();
    initScrollReveal();
    initBlockExpand();
    initButtons();

    window.addEventListener('scroll', onScroll, { passive: true });
    // Trigger initial frame once to set baseline values
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
