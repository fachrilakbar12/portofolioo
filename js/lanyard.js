/**
 * lanyard.js – Single-Strap Interactive ID Card Lanyard (#about)
 *
 * Physics & Interaction:
 *  - Single SVG strap from anchor (180, -560) to top of clip (H - 18px).
 *  - Drops smoothly with natural fabric stretch and damped pendulum sway
 *    when #lanyardScene enters viewport.
 *  - Sub-stepped symplectic integration: rock-solid numerical stability, zero jitter.
 *  - Lightweight cubic Bézier strap curve during drop; pauses RAF instantly when off-screen.
 *  - Pointer drag (clamped ±0.3 rad) with velocity release swing.
 *  - Click/tap (<6px, <400ms) & keyboard (Enter/Space) toggle monochrome -> color
 *    with a subtle 16° Y-axis spring tilt.
 *  - Stops requestAnimationFrame completely when settled or off-screen.
 */

'use strict';

(function () {
  const sceneEl  = document.getElementById('lanyardScene');
  const cardEl   = document.getElementById('lanyardCard');
  const bandEl   = document.getElementById('lanyardBand');
  const stitchEl = document.getElementById('lanyardStitch');

  if (!sceneEl || !cardEl || !bandEl || !stitchEl) return;

  /* ── Physics Constants ── */
  const ANCHOR_X = 180;
  const ANCHOR_Y = -560;
  const D0       = 732;      // Resting distance from anchor to clip pivot H
  const H0_X     = ANCHOR_X;
  const H0_Y     = ANCHOR_Y + D0; // 172px in scene coordinates
  const CLIP_TOP_OFFSET = 18;     // Strap end = H - 18px along strap direction

  // Falling & radial spring physics
  const INITIAL_D = 260;     // Drop starting distance (smooth, off-viewport start)
  const GRAVITY   = 3200;    // Natural, weighted fall acceleration (px/s²)
  const AIR_DRAG  = 0.25;    // Subtle aerodynamic drag during fall
  const KR        = 920;     // Fabric elastic stiffness (sub-stepped, stable)
  const DR        = 48;      // Fabric elastic damping (smooth critical cushion)

  // Pendulum swing physics
  const G_PEND    = 9800;    // Pendulum restoring constant
  const D_PEND    = 2.4;     // Natural pendulum damping (settles in 2-3 graceful sways)
  const INITIAL_SWING_IMPULSE = 0.42; // Initial swing angular velocity on catch (~4.5°)

  // Secondary clip hinge physics
  const K_ALPHA   = 75;      // Clip spring stiffness
  const D_ALPHA   = 12;      // Clip spring damping
  const C_ALPHA   = 0.5;     // Subtle coupling from pendulum acceleration

  // Click Y-tilt spring physics
  const K_TILT    = 180;     // Click Y-tilt spring stiffness
  const D_TILT    = 14;      // Click Y-tilt spring damping
  const TILT_IMPULSE = 230;  // Produces ~16° peak Y-axis tilt

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = reduceMotionQuery.matches;

  /* ── State Variables ── */
  let d          = prefersReducedMotion ? D0 : INITIAL_D;
  let vd         = 0;
  let phi        = 0;
  let vphi       = 0;
  let alpha      = 0;
  let valpha     = 0;
  let tiltY      = 0;
  let vtiltY     = 0;

  let hasDropped = prefersReducedMotion;
  let hasTaut    = prefersReducedMotion;
  let isColored  = false;
  let isDragging = false;
  let isVisible  = false;
  let rafId      = null;
  let lastTime   = 0;
  let lastDAttr  = '';
  let lastToggleTime = 0;

  /* ── Build SVG Path String ── */
  function buildStrapPath(Hx, Hy, sinP, cosP) {
    const Ex = Hx - CLIP_TOP_OFFSET * sinP;
    const Ey = Hy - CLIP_TOP_OFFSET * cosP;

    if (!hasTaut && d < D0) {
      const loose = D0 - d;
      if (loose > 2) {
        // Natural organic drape using a single cubic Bézier curve
        const sag  = Math.min(36, loose * 0.12);
        const wave = Math.sin(d * 0.04) * sag;
        const dy   = Ey - ANCHOR_Y;
        const cx1  = (ANCHOR_X + wave).toFixed(1);
        const cy1  = (ANCHOR_Y + dy * 0.35).toFixed(1);
        const cx2  = (Ex - wave * 0.7).toFixed(1);
        const cy2  = (ANCHOR_Y + dy * 0.75).toFixed(1);
        return `M ${ANCHOR_X} ${ANCHOR_Y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${Ex.toFixed(1)} ${Ey.toFixed(1)}`;
      }
    }

    return `M ${ANCHOR_X} ${ANCHOR_Y} L ${Ex.toFixed(1)} ${Ey.toFixed(1)}`;
  }

  /* ── Render Current State to DOM ── */
  function render() {
    const sinP = Math.sin(phi);
    const cosP = Math.cos(phi);
    const Hx   = ANCHOR_X + d * sinP;
    const Hy   = ANCHOR_Y + d * cosP;

    const tx     = Hx - H0_X;
    const ty     = Hy - H0_Y;
    const rotDeg = ((phi + alpha) * 180) / Math.PI;

    cardEl.style.transform =
      `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) ` +
      `rotate(${rotDeg.toFixed(3)}deg) ` +
      `rotateY(${tiltY.toFixed(2)}deg)`;

    const dAttr = buildStrapPath(Hx, Hy, sinP, cosP);
    if (dAttr !== lastDAttr) {
      bandEl.setAttribute('d', dAttr);
      stitchEl.setAttribute('d', dAttr);
      lastDAttr = dAttr;
    }
  }

  /* ── Settled Condition Check ── */
  function isSettledState() {
    return (
      !isDragging &&
      hasTaut &&
      Math.abs(d - D0) < 0.25 &&
      Math.abs(vd)     < 2.0  &&
      Math.abs(phi)    < 0.0025 &&
      Math.abs(vphi)   < 0.008 &&
      Math.abs(alpha)  < 0.0025 &&
      Math.abs(valpha) < 0.008 &&
      Math.abs(tiltY)  < 0.08  &&
      Math.abs(vtiltY) < 0.4
    );
  }

  /* ── Snap to Exact Resting State & Stop Loop ── */
  function snapToRest() {
    d       = D0;
    vd      = 0;
    phi     = 0;
    vphi    = 0;
    alpha   = 0;
    valpha  = 0;
    tiltY   = 0;
    vtiltY  = 0;
    hasTaut = true;
    render();
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  /* ── Physics Step (requestAnimationFrame) ── */
  function step(now) {
    rafId = null;
    if (!isVisible && !isDragging) {
      return; // Do nothing if off-screen to preserve 100% scrolling performance
    }

    const rawDt = (now - lastTime) / 1000;
    const dt = Math.min(0.033, Math.max(0.001, isNaN(rawDt) ? 0.016 : rawDt));
    lastTime = now;

    // Sub-stepping for rock-solid symplectic integration stability
    const substeps = 4;
    const dtSub = dt / substeps;

    for (let s = 0; s < substeps; s++) {
      if (!isDragging) {
        /* 1. Radial motion (fall -> cushioned elastic catch) */
        if (!hasTaut && d < D0) {
          vd += (GRAVITY - vd * AIR_DRAG) * dtSub;
          d  += vd * dtSub;
          if (d >= D0) {
            hasTaut = true;
            vphi    = INITIAL_SWING_IMPULSE;
            valpha  = -INITIAL_SWING_IMPULSE * 0.35;
          }
        } else {
          const ad = -KR * (d - D0) - DR * vd;
          vd += ad * dtSub;
          d  += vd * dtSub;
        }

        /* 2. Damped pendulum swing (phi) & secondary clip swing (alpha) */
        const aphi = -(G_PEND / D0) * Math.sin(phi) - D_PEND * vphi;
        vphi += aphi * dtSub;
        phi  += vphi * dtSub;

        const aalpha = -K_ALPHA * alpha - D_ALPHA * valpha - C_ALPHA * aphi;
        valpha += aalpha * dtSub;
        alpha  += valpha * dtSub;
      }

      /* 3. Click Y-axis spring tilt */
      if (tiltY !== 0 || vtiltY !== 0) {
        const atilt = -K_TILT * tiltY - D_TILT * vtiltY;
        vtiltY += atilt * dtSub;
        tiltY  += vtiltY * dtSub;
      }
    }

    render();

    /* 4. Check if settled to stop loop */
    if (isSettledState()) {
      snapToRest();
    } else {
      rafId = requestAnimationFrame(step);
    }
  }

  function startLoop() {
    if (prefersReducedMotion) {
      snapToRest();
      return;
    }
    if (rafId === null) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(step);
    }
  }

  /* ── Toggle Monochrome <-> Color ── */
  function toggleColor() {
    const now = performance.now();
    if (now - lastToggleTime < 250) return; // Prevent double trigger
    lastToggleTime = now;

    isColored = !isColored;
    sceneEl.classList.toggle('is-colored', isColored);
    cardEl.setAttribute('aria-pressed', isColored ? 'true' : 'false');

    if (!prefersReducedMotion) {
      vtiltY = TILT_IMPULSE;
      startLoop();
    }
  }

  /* ── Pointer Drag & Click/Tap Interaction ── */
  let activePointerId = null;
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let lastMoveX = 0;
  let lastMoveTime = 0;
  let pointerVx = 0;
  let movedBeyondThreshold = false;

  cardEl.addEventListener('pointerdown', (e) => {
    if (!hasTaut) return; // Ignore while falling
    if (e.button !== undefined && e.button !== 0) return;

    activePointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    startTime = performance.now();
    lastMoveX = startX;
    lastMoveTime = startTime;
    pointerVx = 0;
    movedBeyondThreshold = false;

    try {
      cardEl.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  cardEl.addEventListener('pointermove', (e) => {
    if (activePointerId === null || e.pointerId !== activePointerId || !hasTaut) return;

    const now  = performance.now();
    const dx   = e.clientX - startX;
    const dy   = e.clientY - startY;
    const dist = Math.hypot(dx, dy);

    const dtMove = Math.max(1, now - lastMoveTime) / 1000;
    const instVx = (e.clientX - lastMoveX) / dtMove;
    pointerVx    = pointerVx * 0.4 + instVx * 0.6;
    lastMoveX    = e.clientX;
    lastMoveTime = now;

    if (!movedBeyondThreshold && dist >= 6) {
      movedBeyondThreshold = true;
      isDragging = true;
      cardEl.classList.add('is-dragging');
    }

    if (isDragging && !prefersReducedMotion) {
      const targetPhi = Math.max(-0.28, Math.min(0.28, dx / D0));
      phi    = targetPhi;
      vphi   = 0;
      alpha  = -targetPhi * 0.2;
      valpha = 0;
      d      = D0 + Math.min(22, Math.hypot(dx, Math.max(0, dy)) * 0.1);
      vd     = 0;
      startLoop();
    }
  });

  function endPointer(e) {
    if (activePointerId === null || e.pointerId !== activePointerId) return;

    try {
      if (cardEl.hasPointerCapture(e.pointerId)) {
        cardEl.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    const elapsed     = performance.now() - startTime;
    const totalDist   = Math.hypot(e.clientX - startX, e.clientY - startY);
    const wasDragging = isDragging;

    activePointerId = null;
    isDragging = false;
    cardEl.classList.remove('is-dragging');

    if (!movedBeyondThreshold && totalDist < 6 && elapsed < 400) {
      toggleColor();
    } else if (wasDragging && !prefersReducedMotion) {
      const releaseOmega = Math.max(-1.8, Math.min(1.8, (pointerVx / D0) * 0.5));
      vphi   = releaseOmega;
      valpha = -releaseOmega * 0.4;
      startLoop();
    }
  }

  cardEl.addEventListener('pointerup', endPointer);
  cardEl.addEventListener('pointercancel', endPointer);

  // Click & Tap fallback
  cardEl.addEventListener('click', () => {
    if (!hasTaut || isDragging) return;
    toggleColor();
  });

  /* ── Keyboard Accessibility (Enter & Space) ── */
  cardEl.addEventListener('keydown', (e) => {
    if (!hasTaut) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleColor();
    }
  });

  /* ── Reduced Motion Listener ── */
  reduceMotionQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      hasDropped = true;
      snapToRest();
    }
  });

  /* ── Initial Render ── */
  render();

  /* ── Viewport Observer & Safe Top-Reset ── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!hasDropped) {
            hasDropped = true;
            startLoop();
          } else if (!isSettledState()) {
            startLoop();
          }
        } else {
          // Immediately pause RAF when off-screen to preserve smooth scroll everywhere
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(sceneEl);

  // Re-enable smooth drop only when user scrolls all the way back to top hero
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY < 30 && hasDropped && isSettledState()) {
        hasDropped = false;
        hasTaut    = false;
        d          = INITIAL_D;
        vd         = 0;
        phi        = 0;
        vphi       = 0;
        alpha      = 0;
        valpha     = 0;
        render();
      }
    },
    { passive: true }
  );
})();
