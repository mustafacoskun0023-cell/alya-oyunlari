/* ===== Kutlama efektleri: konfeti & yıldız yağmuru ===== */
window.FX = (function () {
  const cv = document.getElementById('fx');
  const cx = cv.getContext('2d');
  let parts = [], raf = null, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('orientationchange', () => setTimeout(resize, 300));

  const COLORS = ['#FF4757', '#2E86FF', '#FFC800', '#22C55E', '#FF8A00', '#8B5CF6', '#FF5FA2', '#12C2C2'];

  function loop() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      if (p.life <= 0 || p.y > innerHeight + 60) { parts.splice(i, 1); continue; }
      cx.save();
      cx.translate(p.x, p.y); cx.rotate(p.r);
      cx.globalAlpha = Math.min(1, p.life / 26);
      if (p.type === 'star') {
        cx.font = p.s + 'px serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
        cx.fillText('⭐', 0, 0);
      } else {
        cx.fillStyle = p.c;
        cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      }
      cx.restore();
    }
    if (parts.length) raf = requestAnimationFrame(loop);
    else { raf = null; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function run() { if (!raf) raf = requestAnimationFrame(loop); }

  function confetti(n, originX, originY) {
    n = n || 70;
    const ox = originX != null ? originX : innerWidth / 2;
    const oy = originY != null ? originY : innerHeight * 0.42;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 11;
      parts.push({
        x: ox, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 5,
        g: 0.28 + Math.random() * 0.16, r: Math.random() * 6, vr: (Math.random() - .5) * .38,
        s: 9 + Math.random() * 13, c: COLORS[(Math.random() * COLORS.length) | 0],
        life: 70 + Math.random() * 55, type: 'c'
      });
    }
    run();
  }

  function starRain(n) {
    n = n || 28;
    for (let i = 0; i < n; i++) {
      parts.push({
        x: Math.random() * innerWidth, y: -40 - Math.random() * 260,
        vx: (Math.random() - .5) * 1.6, vy: 1.5 + Math.random() * 2.5,
        g: 0.05, r: Math.random() * 3, vr: (Math.random() - .5) * .1,
        s: 22 + Math.random() * 26, c: '#FFC800',
        life: 190 + Math.random() * 90, type: 'star'
      });
    }
    run();
  }

  function clear() { parts = []; cx.clearRect(0, 0, innerWidth, innerHeight); }

  return { confetti, starRain, clear };
})();
