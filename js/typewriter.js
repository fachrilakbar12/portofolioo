/**
 * typewriter.js – Animasi Pengetikan untuk Subtitle Hero
 *
 * Bergantian mengetik dan menghapus judul, dengan kecepatan
 * yang dapat dikonfigurasi dan jeda di setiap kata penuh.
 */

const TITLES = [
  'AI & Deep Learning Enthusiast',
  'Computer Vision Researcher',
  'Fresh Graduate · Angkatan 2024',
  'Web Developer',
  'Problem Solver',
  'Deepfake Detection Specialist',
];

const TYPING_SPEED  = 100;   // ms per karakter (mengetik)
const DELETING_SPEED = 55;   // ms per karakter (menghapus)
const PAUSE_AFTER   = 1800;  // ms jeda setelah kata penuh

const typingEl = document.querySelector('.hero-subtitle');

let titleIndex   = 0;
let charIndex    = 0;
let isDeleting   = false;

function typeLoop() {
  const fullText = TITLES[titleIndex];

  if (!isDeleting) {
    charIndex++;
    typingEl.textContent = fullText.slice(0, charIndex);

    if (charIndex === fullText.length) {
      isDeleting = true;
      setTimeout(typeLoop, PAUSE_AFTER);
      return;
    }
  } else {
    charIndex--;
    typingEl.textContent = fullText.slice(0, charIndex);

    if (charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % TITLES.length;
    }
  }

  const delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;
  setTimeout(typeLoop, delay);
}

/* Mulai setelah jeda singkat agar animasi masuk hero berjalan dulu */
setTimeout(typeLoop, 600);
