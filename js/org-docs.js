/**
 * org-docs.js – Organization Section Tabs & Documentation Lightbox
 * - Accessible Tabs (Kepengurusan & Dokumentasi)
 * - WAI-ARIA compliant tab navigation (Arrow keys, Home, End)
 * - Cross-fade transition without layout jumps
 * - Dedicated Lightbox for Documentation photos (Prev/Next, Keyboard, Touch swipe, Focus trap)
 */

'use strict';

(function() {
  /* ══════════════════════════════════════════════════
     DOCUMENTATION DATA
     ══════════════════════════════════════════════════ */
  const ORG_DOCS_DATA = [
    {
      title: 'Anggota Humas',
      period: 'Periode 2024 – 2025',
      image: 'assets/organizations/anggota-humas.webp',
      alt: 'Dokumentasi Anggota Humas periode 2023–2025'
    },
    {
      title: 'Wakil Ketua Himpunan',
      period: 'Periode 2025 – 2026',
      image: 'assets/organizations/wakil-ketua-himpunan.webp',
      alt: 'Dokumentasi Wakil Ketua Himpunan periode 2025–2026'
    },
    {
      title: 'Staff Kominfo BEM UNIMAL',
      period: 'Periode 2025 – 2026',
      image: 'assets/organizations/staff-kominfo-bem.webp',
      alt: 'Dokumentasi Staff Kominfo BEM UNIMAL periode 2025–2026'
    }
  ];

  /* ══════════════════════════════════════════════════
     DOM REFERENCES & INITIALIZATION
     ══════════════════════════════════════════════════ */
  function initOrgDocs() {
    const tabLeadership = document.getElementById('tabOrgLeadership');
    const tabDocs = document.getElementById('tabOrgDocs');
    const panelLeadership = document.getElementById('panelOrgLeadership');
    const panelDocs = document.getElementById('panelOrgDocs');

    if (!tabLeadership || !tabDocs || !panelLeadership || !panelDocs) return;

    const tabs = [tabLeadership, tabDocs];
    const panels = [panelLeadership, panelDocs];
    let transitionTimeout = null;
    let fadeTimeout = null;

    /* ── Tab Switching Logic ── */
    function switchOrgTab(targetIndex, setFocus = false) {
      const currentActiveIndex = tabs.findIndex(tab => tab.classList.contains('active'));
      if (currentActiveIndex === targetIndex) return;

      // Clear any pending transitions if switching rapidly
      if (transitionTimeout) clearTimeout(transitionTimeout);
      if (fadeTimeout) clearTimeout(fadeTimeout);

      const currentPanel = panels[currentActiveIndex];
      const targetPanel = panels[targetIndex];

      panels.forEach(p => p.classList.remove('fade-out', 'fade-in'));

      // Update ARIA & active classes on tabs
      tabs.forEach((tab, idx) => {
        const isTarget = idx === targetIndex;
        tab.classList.toggle('active', isTarget);
        tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        tab.setAttribute('tabindex', isTarget ? '0' : '-1');
      });

      if (setFocus) {
        tabs[targetIndex].focus();
      }

      // Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        currentPanel.hidden = true;
        currentPanel.classList.remove('active');
        targetPanel.hidden = false;
        targetPanel.classList.add('active');
        return;
      }

      // Cross-fade: fade out current panel (0.25s), then fade in target panel (0.35s)
      currentPanel.classList.add('fade-out');

      transitionTimeout = setTimeout(() => {
        currentPanel.hidden = true;
        currentPanel.classList.remove('active', 'fade-out');

        targetPanel.hidden = false;
        targetPanel.classList.add('active', 'fade-in');

        // Reveal any unrevealed items in the target panel
        const unrevealed = targetPanel.querySelectorAll('.reveal:not(.visible)');
        unrevealed.forEach(el => el.classList.add('visible'));

        fadeTimeout = setTimeout(() => {
          targetPanel.classList.remove('fade-in');
        }, 350);
      }, 250);
    }

    // Tab Click Listeners
    tabLeadership.addEventListener('click', () => switchOrgTab(0));
    tabDocs.addEventListener('click', () => switchOrgTab(1));

    // Tab Keyboard Navigation (Left/Right arrow, Home, End)
    tabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const nextIndex = e.key === 'ArrowRight'
            ? (index + 1) % tabs.length
            : (index - 1 + tabs.length) % tabs.length;
          switchOrgTab(nextIndex, true);
        } else if (e.key === 'Home') {
          e.preventDefault();
          switchOrgTab(0, true);
        } else if (e.key === 'End') {
          e.preventDefault();
          switchOrgTab(tabs.length - 1, true);
        }
      });
    });

    /* ══════════════════════════════════════════════════
       DOCUMENTATION LIGHTBOX
       ══════════════════════════════════════════════════ */
    const orgLightbox = document.getElementById('orgDocLightbox');
    if (!orgLightbox) return;

    const orgBackdrop = document.getElementById('orgDocBackdrop');
    const orgCloseBtn = document.getElementById('orgDocCloseBtn');
    const orgPrevBtn = document.getElementById('orgDocPrevBtn');
    const orgNextBtn = document.getElementById('orgDocNextBtn');
    const orgImage = document.getElementById('orgDocImage');
    const orgSpinner = document.getElementById('orgDocSpinner');
    const orgCounter = document.getElementById('orgDocCounter');
    const orgTitle = document.getElementById('orgDocTitle');
    const orgMeta = document.getElementById('orgDocMeta');

    let currentDocIndex = 0;
    let lastFocusedElement = null;

    function renderOrgDocView() {
      const data = ORG_DOCS_DATA[currentDocIndex];
      if (!data) return;

      if (orgCounter) {
        orgCounter.textContent = `${currentDocIndex + 1} / ${ORG_DOCS_DATA.length}`;
      }

      if (orgTitle) orgTitle.textContent = data.title;
      if (orgMeta) orgMeta.textContent = data.period;

      if (orgSpinner) orgSpinner.style.display = 'flex';
      if (orgImage) {
        orgImage.style.opacity = '0';
        orgImage.onload = () => {
          if (orgSpinner) orgSpinner.style.display = 'none';
          orgImage.style.opacity = '1';
        };
        orgImage.onerror = () => {
          if (orgSpinner) orgSpinner.style.display = 'none';
          orgImage.style.opacity = '1';
        };
        orgImage.src = data.image;
        orgImage.alt = data.alt;

        if (orgImage.complete && orgImage.naturalWidth > 0) {
          if (orgSpinner) orgSpinner.style.display = 'none';
          orgImage.style.opacity = '1';
        }
      }
    }

    function openOrgDocLightbox(index) {
      lastFocusedElement = document.activeElement;
      currentDocIndex = (index >= 0 && index < ORG_DOCS_DATA.length) ? index : 0;

      renderOrgDocView();

      orgLightbox.classList.add('open');
      orgLightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (orgCloseBtn) {
        orgCloseBtn.focus();
      }
    }

    function closeOrgDocLightbox() {
      orgLightbox.classList.remove('open');
      orgLightbox.setAttribute('aria-hidden', 'true');

      // Check if other modals are open before unlocking scroll
      const certLb = document.getElementById('certLightbox');
      const projMod = document.getElementById('projectModal');
      const isOtherModalOpen = (certLb && certLb.classList.contains('open')) ||
                               (projMod && projMod.classList.contains('open'));

      if (!isOtherModalOpen) {
        document.body.style.overflow = '';
      }

      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    function prevOrgDoc() {
      currentDocIndex = (currentDocIndex - 1 + ORG_DOCS_DATA.length) % ORG_DOCS_DATA.length;
      renderOrgDocView();
    }

    function nextOrgDoc() {
      currentDocIndex = (currentDocIndex + 1) % ORG_DOCS_DATA.length;
      renderOrgDocView();
    }

    // Button event listeners
    if (orgCloseBtn) orgCloseBtn.addEventListener('click', closeOrgDocLightbox);
    if (orgBackdrop) orgBackdrop.addEventListener('click', closeOrgDocLightbox);
    if (orgPrevBtn) orgPrevBtn.addEventListener('click', prevOrgDoc);
    if (orgNextBtn) orgNextBtn.addEventListener('click', nextOrgDoc);

    // Card click and keydown listeners
    const docCards = panelDocs.querySelectorAll('.org-doc-card');
    docCards.forEach((card, idx) => {
      card.addEventListener('click', () => openOrgDocLightbox(idx));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openOrgDocLightbox(idx);
        }
      });
    });

    // Keyboard handlers (Escape, ArrowLeft, ArrowRight, Focus Trap)
    document.addEventListener('keydown', (e) => {
      if (!orgLightbox.classList.contains('open')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeOrgDocLightbox();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevOrgDoc();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextOrgDoc();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusable = orgLightbox.querySelectorAll('button:not([disabled]), [tabindex="0"]');
        const focusableArr = Array.from(focusable);
        if (focusableArr.length === 0) return;

        const firstEl = focusableArr[0];
        const lastEl = focusableArr[focusableArr.length - 1];

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
      }
    });

    // Touch swipe navigation
    let touchStartX = 0;
    let touchStartY = 0;

    orgLightbox.addEventListener('touchstart', (e) => {
      if (e.changedTouches.length > 0) {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
      }
    }, { passive: true });

    orgLightbox.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Ensure horizontal intent and minimum swipe threshold (40px)
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX < 0) {
            nextOrgDoc();
          } else {
            prevOrgDoc();
          }
        }
      }
    }, { passive: true });

    // Expose globals for external triggers if needed
    window.switchOrgTab = switchOrgTab;
    window.openOrgDocLightbox = openOrgDocLightbox;
    window.closeOrgDocLightbox = closeOrgDocLightbox;
  }

  // Run on DOMContentLoaded or immediately if DOM is already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrgDocs);
  } else {
    initOrgDocs();
  }
})();
