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

  const COLORS = [
    'rgba(232,68,90,',
    'rgba(255,112,85,',
    'rgba(245,158,11,',
    'rgba(139,92,246,',
  ];

  const REPULSION_RADIUS = 110;
  const REPULSION_FORCE  = 1.0;
  const CONNECT_DISTANCE = 120;
  const PARTICLE_COUNT   = 70;

  class Particle {
    constructor() {
      this._color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.reset(true);
    }

    reset(initial = false) {
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
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i], p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < CONNECT_DISTANCE) {
          const t = 1 - dist / CONNECT_DISTANCE;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(232,68,90,${t * 0.09})`;
          ctx.lineWidth = t * 0.6;
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
}
