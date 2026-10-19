/**
 * tilt3d.js — Hero card 3D tilt effect
 * Mouse-tracking tilt with parallax layers + dynamic glare
 */

'use strict';

(function () {
  const card    = document.getElementById('heroCard3d');
  if (!card) return;

  const glare   = card.querySelector('.hc-glare');
  const shadow  = card.querySelector('.hc-shadow');
  const chips   = card.querySelectorAll('.hc-chip');
  const dots    = card.querySelectorAll('.hc-dot');

  /* Track di parent (.hero-photo-col) supaya children card tidak menghalangi event */
  const track = card.closest('.hero-photo-col') || card.parentElement;

  /* Semua child non-interaktif → pointer-events: none agar tidak menghalangi */
  card.querySelectorAll(
    '.hc-shadow, .hc-frame, .hc-frame-ring, .hc-photo, .hc-glare, .hc-dot'
  ).forEach(el => { el.style.pointerEvents = 'none'; });

  /* --- Settingan --- */
  const MAX_TILT  = 22;    /* derajat max — cukup dramatis */
  const GLARE_MAX = 0.28;
  const EASE_IN   = 0.14;  /* respons saat hover */
  const EASE_OUT  = 0.05;  /* kembali ke idle */

  let curX = -6, curY = 3;
  let tarX = -6, tarY = 3;
  let hovering = false;
  let idleT    = 0;

  /* ── Idle float pelan ── */
  function idleTick() {
    idleT += 0.007;
    tarX = Math.sin(idleT * 0.6) * 5  - 3;
    tarY = Math.cos(idleT * 0.45) * 4 + 2;
  }

  /* ── Mouse move di dalam track area ── */
  function onMove(e) {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  * 0.5;
    const cy   = rect.top  + rect.height * 0.5;

    /* normalise: -1 … +1 relatif ke ukuran card */
    const ndx  = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width  * 0.5)));
    const ndy  = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height * 0.5)));

    tarX =  ndy * -MAX_TILT;
    tarY =  ndx *  MAX_TILT;
    hovering = true;
  }

  function onLeave() {
    hovering = false;
    tarX = -6;
    tarY =  3;
  }

  /* ── Glare ikut rotasi ── */
  function applyGlare(rx, ry) {
    if (!glare) return;
    const gx  = 50 - (ry / MAX_TILT) * 40;
    const gy  = 50 + (rx / MAX_TILT) * 30;
    const mag = Math.min(1, (Math.abs(rx) + Math.abs(ry)) / (MAX_TILT * 1.5));
    glare.style.background = `radial-gradient(
      ellipse 70% 60% at ${gx.toFixed(1)}% ${gy.toFixed(1)}%,
      rgba(255,255,255,${(mag * GLARE_MAX).toFixed(3)}) 0%,
      transparent 65%)`;
  }

  /* ── Shadow geser dan scale ── */
  function applyShadow(rx, ry) {
    if (!shadow) return;
    const ox  = (ry / MAX_TILT) * 18;
    const oy  = (rx / MAX_TILT) * -12 + 10;
    const sc  = 1 - Math.abs(ry / MAX_TILT) * 0.15;
    const bl  = 14 + Math.abs(rx) * 0.5;
    const op  = 0.30 - Math.abs(rx) * 0.003;
    shadow.style.transform = `translateX(calc(-50% + ${ox.toFixed(1)}px)) translateY(${oy.toFixed(1)}px) scale(${sc.toFixed(3)})`;
    shadow.style.filter    = `blur(${bl.toFixed(1)}px)`;
    shadow.style.opacity   = op.toFixed(3);
  }

  /* ── Chips parallax (bergerak berlawanan → kesan melayang) ── */
  function applyChips(rx, ry) {
    const depths = [2.0, 2.5, 1.8];
    chips.forEach((chip, i) => {
      const d  = depths[i] || 2;
      const tx = (ry / MAX_TILT) * -d * 14;
      const ty = (rx / MAX_TILT) *  d * 10;
      chip.style.transform = `translateZ(40px) translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px)`;
    });
  }

  /* ── Dots parallax ── */
  function applyDots(rx, ry) {
    const depths = [1.6, 1.2, 1.9];
    dots.forEach((dot, i) => {
      const d  = depths[i] || 1.5;
      const tx = (ry / MAX_TILT) * -d * 8;
      const ty = (rx / MAX_TILT) *  d * 6;
      dot.style.transform = `translateZ(25px) translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px)`;
    });
  }

  /* ── Render loop ── */
  function tick() {
    if (!hovering) idleTick();

    const ease = hovering ? EASE_IN : EASE_OUT;
    curX += (tarX - curX) * ease;
    curY += (tarY - curY) * ease;

    card.style.transform = `rotateX(${curX.toFixed(2)}deg) rotateY(${curY.toFixed(2)}deg)`;

    applyGlare(curX, curY);
    applyShadow(curX, curY);
    applyChips(curX, curY);
    applyDots(curX, curY);

    requestAnimationFrame(tick);
  }

  /* ── Bind events ke PARENT (track) bukan ke card ── */
  track.addEventListener('mousemove',  onMove,  { passive: true });
  track.addEventListener('mouseleave', onLeave, { passive: true });

  /* Touch */
  track.addEventListener('touchmove', e => {
    onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
  }, { passive: true });
  track.addEventListener('touchend', onLeave, { passive: true });

  tick();
})();



