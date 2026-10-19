/**
 * space.js — Astronomy Background Engine
 * Layers (back → front):
 *   1. Deep nebula clouds   (soft radial blobs, slow drift)
 *   2. Aurora ribbons       (dark mode only, slow wave)
 *   3. Stars layer A        (distant, tiny, slow twinkle)
 *   4. Stars layer B        (mid, medium, faster twinkle)
 *   5. Stars layer C        (near, bright, pulse + parallax scroll)
 *   6. Shooting stars       (random, burst of light trail)
 *
 * Rules:
 *   - Everything runs on a single offscreen-composited canvas
 *   - pointer-events: none — zero layout impact
 *   - Adapts opacity based on data-theme (dark = vivid, light = ghost)
 *   - Parallax on scroll: layer C moves faster than A
 */

'use strict';

(function () {

  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let scrollY   = 0;
  let isDark    = () => document.documentElement.getAttribute('data-theme') === 'dark';

  /* ─── Resize ─────────────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initNebulae();   // re-seed nebulae on resize
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  /* ─── Colour helpers ──────────────────────────────── */
  const STAR_COLORS = [
    [255, 255, 255],   // white
    [210, 230, 255],   // cold blue
    [255, 230, 200],   // warm orange
    [200, 210, 255],   // lavender
    [255, 255, 220],   // pale yellow
  ];

  function randColor() {
    return STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
  }

  function rgba(c, a) { return `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`; }

  /* ─── Star class ──────────────────────────────────── */
  class Star {
    constructor(layer) {
      this.layer = layer;   // 0=far 1=mid 2=near
      this.spawn();
    }

    spawn() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.baseR = this.layer === 0 ? Math.random() * 0.7 + 0.2
                 : this.layer === 1 ? Math.random() * 1.0 + 0.4
                 :                    Math.random() * 1.4 + 0.6;
      this.r     = this.baseR;
      this.color = randColor();

      // twinkle
      this.phase  = Math.random() * Math.PI * 2;
      this.speed  = 0.003 + Math.random() * 0.012;
      this.range  = 0.25 + Math.random() * 0.55;   // alpha swing

      // base alpha per layer
      this.baseA  = this.layer === 0 ? 0.30 + Math.random() * 0.35
                  : this.layer === 1 ? 0.45 + Math.random() * 0.40
                  :                    0.65 + Math.random() * 0.35;

      // parallax scroll factor (near moves more)
      this.pFactor = [0.04, 0.10, 0.20][this.layer];
    }

    update(t) {
      this.phase += this.speed;
      const tw = Math.sin(this.phase) * 0.5 + 0.5;   // 0–1
      this.alpha = this.baseA - this.range * 0.5 + tw * this.range;
      this.r     = this.baseR + tw * (this.baseR * 0.4);
    }

    draw(dark) {
      const py  = this.y - scrollY * this.pFactor;
      // wrap vertically
      const drawY = ((py % H) + H) % H;
      const a   = dark ? this.alpha : this.alpha * 0.18;
      if (a < 0.01) return;

      // glow halo for bright stars
      if (this.layer === 2 && this.alpha > 0.7) {
        const grad = ctx.createRadialGradient(this.x, drawY, 0, this.x, drawY, this.r * 4);
        grad.addColorStop(0, rgba(this.color, a * 0.55));
        grad.addColorStop(1, rgba(this.color, 0));
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // core dot
      ctx.beginPath();
      ctx.arc(this.x, drawY, this.r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(this.color, Math.min(1, a));
      ctx.fill();

      // cross spike for very bright near-stars
      if (this.layer === 2 && this.alpha > 0.85) {
        ctx.strokeStyle = rgba(this.color, a * 0.35);
        ctx.lineWidth   = 0.5;
        const sp = this.r * 5;
        ctx.beginPath();
        ctx.moveTo(this.x - sp, drawY); ctx.lineTo(this.x + sp, drawY);
        ctx.moveTo(this.x, drawY - sp); ctx.lineTo(this.x, drawY + sp);
        ctx.stroke();
      }
    }
  }

  /* ─── Shooting star class ─────────────────────────── */
  class Shoot {
    constructor() { this.reset(); }

    reset() {
      // start from random top-right area
      this.x    = W * (0.3 + Math.random() * 0.7);
      this.y    = H * (Math.random() * 0.4);
      const ang = (0.3 + Math.random() * 0.4);   // rad, downward-left
      const spd = 12 + Math.random() * 14;
      this.vx   = -Math.cos(ang) * spd;
      this.vy   =  Math.sin(ang) * spd;
      this.life = 0;
      this.maxL = 0.6 + Math.random() * 0.6;     // seconds
      this.trail = [];
      this.active = false;
      this.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    }

    activate() {
      this.active = true;
      this.life   = 0;
      this.trail  = [];
      this.x = W * (0.35 + Math.random() * 0.6);
      this.y = H * (0.02  + Math.random() * 0.25);
      const ang = 0.35 + Math.random() * 0.35;
      const spd = 14 + Math.random() * 16;
      this.vx = -Math.cos(ang) * spd;
      this.vy =  Math.sin(ang) * spd;
      this.maxL = 0.5 + Math.random() * 0.55;
      this.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    }

    update(dt) {
      if (!this.active) return;
      this.life += dt;
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 28) this.trail.shift();
      this.x += this.vx;
      this.y += this.vy;
      if (this.life > this.maxL || this.x < -40 || this.y > H + 40) {
        this.active = false;
      }
    }

    draw(dark) {
      if (!this.active || this.trail.length < 2) return;
      const prog = this.life / this.maxL;
      const fade = prog < 0.15 ? prog / 0.15
                 : prog > 0.75 ? 1 - (prog - 0.75) / 0.25
                 : 1;
      const baseA = dark ? 0.92 : 0.22;

      ctx.save();
      ctx.lineCap = 'round';
      for (let i = 1; i < this.trail.length; i++) {
        const t  = i / this.trail.length;
        const a  = t * t * fade * baseA;
        const lw = t * 1.8;
        ctx.beginPath();
        ctx.moveTo(this.trail[i-1].x, this.trail[i-1].y);
        ctx.lineTo(this.trail[i].x,   this.trail[i].y);
        ctx.strokeStyle = rgba(this.color, a);
        ctx.lineWidth   = lw;
        ctx.stroke();
      }
      // head glow
      const hg = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 6);
      hg.addColorStop(0, rgba(this.color, fade * baseA));
      hg.addColorStop(1, rgba(this.color, 0));
      ctx.beginPath();
      ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = hg;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ─── Nebula cloud class ─────────────────────────── */
  class Nebula {
    constructor() { this.init(); }

    init() {
      this.cx    = Math.random() * W;
      this.cy    = Math.random() * H;
      this.rx    = 120 + Math.random() * 280;
      this.ry    = 80  + Math.random() * 200;
      this.angle = Math.random() * Math.PI;
      this.phase = Math.random() * Math.PI * 2;
      this.speed = 0.0003 + Math.random() * 0.0004;

      // pick nebula colour palette
      const palettes = [
        [[196, 53, 43],  [220, 90, 58]],   // crimson
        [[107, 79, 216], [140,100,240]],   // violet
        [[200,137, 10],  [240,170, 40]],   // amber
        [[ 20,120,180],  [ 60,180,220]],   // blue
        [[100, 20,160],  [180, 60,220]],   // deep purple
      ];
      const pal = palettes[Math.floor(Math.random() * palettes.length)];
      this.c1 = pal[0];
      this.c2 = pal[1];
      this.baseA = 0.04 + Math.random() * 0.06;
    }

    update() {
      this.phase += this.speed;
      // slow drift
      this.cx += Math.sin(this.phase * 0.3) * 0.08;
      this.cy += Math.cos(this.phase * 0.2) * 0.05;
    }

    draw(dark) {
      const pulse = 0.5 + Math.sin(this.phase) * 0.5;
      const a = dark
        ? this.baseA + pulse * 0.04
        : (this.baseA + pulse * 0.04) * 0.25;

      ctx.save();
      ctx.translate(this.cx, this.cy);
      ctx.rotate(this.angle + this.phase * 0.05);

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.rx);
      g.addColorStop(0,   rgba(this.c2, a * 1.4));
      g.addColorStop(0.4, rgba(this.c1, a));
      g.addColorStop(1,   rgba(this.c1, 0));

      ctx.scale(1, this.ry / this.rx);
      ctx.beginPath();
      ctx.arc(0, 0, this.rx, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ─── Aurora ribbon ──────────────────────────────── */
  class Aurora {
    constructor(index) {
      this.index  = index;
      this.phase  = index * 1.4;
      this.speed  = 0.0006 + index * 0.0003;
      this.y      = H * (0.05 + index * 0.18);
      this.amp    = 55 + index * 30;
      this.freq   = 0.0012 + index * 0.0004;
      this.colors = [
        [[  0,220,180], [  0,160,140]],  // teal-green
        [[140, 60,220], [180,100,255]],  // violet
        [[  0,140,220], [ 40,190,255]],  // sky blue
      ];
      const pal = this.colors[index % this.colors.length];
      this.c1 = pal[0]; this.c2 = pal[1];
    }

    update() { this.phase += this.speed; }

    draw(dark) {
      if (!dark) return;   // aurora only in dark mode
      const aBase = 0.05 + this.index * 0.015;
      const thickness = 60 + this.index * 20;

      ctx.save();
      // draw ribbon as a wide bezier stroke
      for (let layer = 0; layer < 3; layer++) {
        const t = layer / 2;
        const a = (aBase - t * aBase * 0.6) * (0.5 + Math.sin(this.phase * 0.7) * 0.5);
        if (a < 0.004) continue;

        ctx.beginPath();
        ctx.moveTo(0, this.y);

        for (let x = 0; x <= W; x += 4) {
          const wave = Math.sin(x * this.freq + this.phase)
                     * this.amp
                     + Math.sin(x * this.freq * 2.3 + this.phase * 1.5)
                     * (this.amp * 0.3);
          ctx.lineTo(x, this.y + wave + layer * (thickness / 3));
        }

        ctx.strokeStyle = rgba(t < 0.5 ? this.c1 : this.c2, a);
        ctx.lineWidth   = thickness - layer * (thickness * 0.3);
        ctx.lineCap     = 'round';
        ctx.filter      = 'blur(18px)';
        ctx.stroke();
        ctx.filter      = 'none';
      }
      ctx.restore();
    }
  }

  /* ─── Build scene ─────────────────────────────────── */
  const STAR_COUNTS = [280, 140, 55];   // far, mid, near
  let stars = [];
  let nebulae = [];
  let auroras = [];
  const SHOOT_COUNT = 4;
  let shoots = Array.from({ length: SHOOT_COUNT }, () => new Shoot());
  let nextShoot = 3 + Math.random() * 6;   // seconds until first

  function initStars() {
    stars = [];
    STAR_COUNTS.forEach((n, layer) => {
      for (let i = 0; i < n; i++) stars.push(new Star(layer));
    });
  }

  function initNebulae() {
    nebulae = Array.from({ length: 7 }, () => new Nebula());
  }

  function initAuroras() {
    auroras = [new Aurora(0), new Aurora(1), new Aurora(2)];
  }

  /* ─── Animate ─────────────────────────────────────── */
  let last = 0;

  function animate(ts) {
    const dt  = Math.min((ts - last) / 1000, 0.05);   // seconds, capped
    last = ts;
    const dark = isDark();

    ctx.clearRect(0, 0, W, H);

    // 1. Nebulae
    nebulae.forEach(n => { n.update(); n.draw(dark); });

    // 2. Aurora
    auroras.forEach(a => { a.update(); a.draw(dark); });

    // 3. Stars A (far)
    const t = ts * 0.001;
    for (const s of stars) { s.update(t); s.draw(dark); }

    // 4. Shooting stars
    nextShoot -= dt;
    if (nextShoot <= 0) {
      const idle = shoots.find(s => !s.active);
      if (idle) { idle.activate(); }
      nextShoot = dark ? 4 + Math.random() * 8 : 10 + Math.random() * 20;
    }
    shoots.forEach(s => { s.update(dt); s.draw(dark); });

    requestAnimationFrame(animate);
  }

  /* ─── Init + start ────────────────────────────────── */
  resize();
  initStars();
  initAuroras();
  requestAnimationFrame(ts => { last = ts; animate(ts); });

  // Re-init on theme change to update aurora / nebula intensity
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    setTimeout(initAuroras, 50);
  });

})();
