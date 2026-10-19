/**
 * cursor.js – Interactive Background System
 * Canvas particle field + cursor glow
 */

'use strict';

const canvas = document.getElementById('bgCanvas');
if (!canvas) {
  console.warn('bgCanvas not found, skipping particle system');
} else {
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;

  const mouse = { x: -9999, y: -9999 };
  const cursorGlow = document.getElementById('cursorGlow');

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (cursorGlow) {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
    if (cursorGlow) {
      cursorGlow.style.left = '-999px';
      cursorGlow.style.top  = '-999px';
    }
  }, { passive: true });

  const COLORS_DARK  = [
    'rgba(198, 255, 52,',  /* Lime */
    'rgba(127, 58, 237,',  /* Violet */
    'rgba(198, 255, 52,',  /* Lime */
    'rgba(127, 58, 237,',  /* Violet */
  ];

  const COLORS_LIGHT = [
    'rgba(251, 86, 7,',    /* Nitro Orange */
    'rgba(224, 74, 0,',    /* Nitro Dark */
    'rgba(251, 110, 40,',  /* Nitro Light */
    'rgba(184, 59, 0,',    /* Nitro Accent */
  ];

  function getColors() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? COLORS_DARK : COLORS_LIGHT;
  }

  const REPULSION_RADIUS = 110;
  const REPULSION_FORCE  = 1.0;
  const CONNECT_DISTANCE = 120;
  const PARTICLE_COUNT   = 70;

  class Particle {
    constructor() {
      const colors = getColors();
      this._color = colors[Math.floor(Math.random() * colors.length)];
      this.reset(true);
    }

    reset(initial = false) {
      const colors = getColors();
      this._color = colors[Math.floor(Math.random() * colors.length)];
      this.x  = initial ? Math.random() * W : (Math.random() < 0.5 ? 0 : W);
      this.y  = initial ? Math.random() * H : Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 1.5 + 0.5;
      this.baseAlpha = Math.random() * 0.35 + 0.10;
      this.alpha = this.baseAlpha;
    }

    update() {
      const dx   = this.x - mouse.x;
      const dy   = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);

      if (dist < REPULSION_RADIUS && dist > 0) {
        const strength = ((REPULSION_RADIUS - dist) / REPULSION_RADIUS) * REPULSION_FORCE;
        this.vx += (dx / dist) * strength;
        this.vy += (dy / dist) * strength;
        this.alpha = Math.min(1, this.baseAlpha + strength * 0.5);
      } else {
        this.alpha += (this.baseAlpha - this.alpha) * 0.04;
      }

      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x  += this.vx;
      this.y  += this.vy;

      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this._color + this.alpha + ')';
      ctx.fill();
    }
  }

  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  function drawConnections() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const strokeBase = isDark ? '198,255,52' : '251,86,7';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i], p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < CONNECT_DISTANCE) {
          const t = 1 - dist / CONNECT_DISTANCE;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${strokeBase},${t * 0.10})`;
          ctx.lineWidth = t * 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();

  /* Re-sample particle colors when theme changes */
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      // Setelah theme.js mengubah data-theme, refresh warna partikel
      setTimeout(() => {
        particles.forEach(p => {
          const colors = getColors();
          p._color = colors[Math.floor(Math.random() * colors.length)];
        });
      }, 50);
    });
  }
}
