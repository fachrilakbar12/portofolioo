/**
 * gallery.js – Project Photo Gallery
 *
 * Feature utama:
 *  - Klik item di section #gallery → buka modal lightbox
 *  - Prev / Next navigation (tombol + keyboard ← →)
 *  - Dot indicators
 *  - Smooth fade-scale transition
 *  - Tekan ESC / klik backdrop → tutup modal
 *
 * Cara tambah foto:
 *  1. Tambah entry di array PHOTOS di bawah
 *  2. Tambah elemen .pg-item di index.html (section #gallery)
 *     dengan data-idx yang sesuai (0, 1, 2, dst.)
 */

'use strict';

/* ══════════════════════════════════════════════════
   DAFTAR FOTO GALERI
   Sesuaikan src & label sesuai file foto Anda.
   ══════════════════════════════════════════════════ */
const PHOTOS = [
  { src: 'foto.jpg', label: 'Fachril Akbar' },
  // Tambah foto proyek di sini:
  // { src: 'foto/deepfake-demo.jpg',  label: 'Demo Deepfake Detection' },
  // { src: 'foto/portfolio-web.jpg',  label: 'Website Portofolio' },
  // { src: 'foto/java-app.jpg',       label: 'Aplikasi Manajemen Data' },
];

/* ── DOM References ── */
const galleryModal   = document.getElementById('galleryModal');
const galleryImg     = document.getElementById('galleryImg');
const galleryLabel   = document.getElementById('galleryLabel');
const galleryCounter = document.getElementById('galleryCounter');
const galleryDotsEl  = document.getElementById('galleryDots');
const btnPrev        = document.getElementById('galleryPrev');
const btnNext        = document.getElementById('galleryNext');
const btnClose       = document.getElementById('galleryClose');

let currentIndex = 0;

/* ── Build dot indicators ── */
function buildDots() {
  if (!galleryDotsEl) return;
  galleryDotsEl.innerHTML = '';
  PHOTOS.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot' + (i === currentIndex ? ' active' : '');
    dot.setAttribute('aria-label', `Foto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    galleryDotsEl.appendChild(dot);
  });
}

/* ── Update dot state ── */
function updateDots() {
  if (!galleryDotsEl) return;
  galleryDotsEl.querySelectorAll('.gallery-dot')
    .forEach((d, i) => d.classList.toggle('active', i === currentIndex));
}

/* ── Update counter & label ── */
function updateMeta() {
  const photo = PHOTOS[currentIndex];
  if (galleryLabel)   galleryLabel.textContent = photo.label;
  if (galleryCounter) galleryCounter.textContent = `${currentIndex + 1} / ${PHOTOS.length}`;
}

/* ── Navigate to index ── */
function goTo(index) {
  currentIndex = (index + PHOTOS.length) % PHOTOS.length;

  /* Fade-scale out */
  galleryImg.classList.add('switching');

  setTimeout(() => {
    galleryImg.src = PHOTOS[currentIndex].src;
    galleryImg.alt = PHOTOS[currentIndex].label;
    updateMeta();
    updateDots();
    galleryImg.classList.remove('switching');
  }, 290);
}

/* ── Open modal at specific index ── */
function openGallery(idx = 0) {
  currentIndex = Math.max(0, Math.min(idx, PHOTOS.length - 1));

  galleryImg.src = PHOTOS[currentIndex].src;
  galleryImg.alt = PHOTOS[currentIndex].label;
  updateMeta();
  buildDots();

  galleryModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ── Close modal ── */
function closeGallery() {
  galleryModal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Bind gallery grid items ── */
document.querySelectorAll('.pg-item[data-idx]').forEach(item => {
  item.addEventListener('click', () => {
    const idx = parseInt(item.dataset.idx, 10);
    openGallery(isNaN(idx) ? 0 : idx);
  });
});

/* ── Modal controls ── */
if (btnClose) btnClose.addEventListener('click', closeGallery);
if (btnPrev)  btnPrev.addEventListener('click',  () => goTo(currentIndex - 1));
if (btnNext)  btnNext.addEventListener('click',  () => goTo(currentIndex + 1));

/* Close on backdrop click */
galleryModal.addEventListener('click', (e) => {
  if (e.target === galleryModal) closeGallery();
});

/* ── Keyboard navigation ── */
document.addEventListener('keydown', (e) => {
  if (!galleryModal.classList.contains('open')) return;
  if (e.key === 'ArrowRight') goTo(currentIndex + 1);
  if (e.key === 'ArrowLeft')  goTo(currentIndex - 1);
  if (e.key === 'Escape')     closeGallery();
});

/* ── Bind profile photo to open gallery ── */
const photoScene = document.getElementById('photoScene');
if (photoScene) {
  photoScene.addEventListener('click', () => openGallery(0));
}

/* ── Hide nav/dots if only 1 photo ── */
if (PHOTOS.length <= 1) {
  if (btnPrev)       btnPrev.style.display       = 'none';
  if (btnNext)       btnNext.style.display       = 'none';
  if (galleryDotsEl) galleryDotsEl.style.display = 'none';
}
