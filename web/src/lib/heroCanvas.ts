// Kanvas partikel energi untuk hero. transform/opacity-free (canvas), DPR-aware,
// pause saat tab tersembunyi, mati total di prefers-reduced-motion.
// Semua listener di-teardown saat navigasi (astro:before-swap) → tanpa leak
// walau hero dikunjungi berkali-kali.

export function initHeroCanvas(cv: HTMLCanvasElement) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = cv.getContext("2d");
  if (!ctx) return;

  const COL = ["#b8f23a", "#35e0d2", "#9b8cff"];
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let w = 0, h = 0, raf = 0;
  let parts: { x: number; y: number; s: number; r: number; c: string; a: number }[] = [];
  const ac = new AbortController();

  const size = () => {
    w = cv.width = cv.offsetWidth * dpr;
    h = cv.height = cv.offsetHeight * dpr;
  };
  const seed = () => {
    const n = Math.min(64, Math.floor(w / 28));
    parts = Array.from({ length: n }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: 0.3 + Math.random() * 0.9,
      r: (Math.random() * 1.5 + 0.5) * dpr,
      c: COL[i % 3],
      a: 0.12 + Math.random() * 0.35,
    }));
  };
  const tick = () => {
    if (!cv.isConnected) { stop(); return; } // canvas dilepas → hentikan
    ctx.clearRect(0, 0, w, h);
    // gerak
    for (const p of parts) {
      p.x += p.s * dpr;
      if (p.x > w + 20) { p.x = -20; p.y = Math.random() * h; }
    }
    // garis jaringan antar-node terdekat (konstelasi energi)
    const maxD = 120 * dpr;
    ctx.lineWidth = dpr * 0.6;
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i], b = parts[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < maxD * maxD) {
          ctx.globalAlpha = (1 - Math.sqrt(d2) / maxD) * 0.16;
          ctx.strokeStyle = a.c;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    // node
    for (const p of parts) {
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(tick);
  };
  const loop = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
  const start = () => { cancelAnimationFrame(raf); size(); seed(); loop(); };

  function stop() {
    cancelAnimationFrame(raf);
    ac.abort();
    document.removeEventListener("astro:before-swap", stop);
  }

  start();
  addEventListener("resize", start, { passive: true, signal: ac.signal });
  document.addEventListener(
    "visibilitychange",
    () => { cancelAnimationFrame(raf); if (!document.hidden && cv.isConnected) loop(); },
    { signal: ac.signal },
  );
  document.addEventListener("astro:before-swap", stop);
}
