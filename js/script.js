// Menu mobile
const btn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
btn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
  }
});


// Jaringan titik dan simbol kode di hero
(function () {
  const cv = document.getElementById('bg');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const hero = cv.parentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GLYPHS = ['</>', '{ }', '=>', '( )', '[ ]', ';', '&&', '01', '/>', '<>'];
  const LINK = 130, REACH = 170, PUSH = 150;
  let W = 0, H = 0, P = [], m = null, running = true;

  function setup() {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    cv.width = W * d; cv.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    const n = Math.min(60, Math.round(W * H / 14000)); // jumlah partikel
    P = Array.from({ length: n }, () => {
      const bx = (Math.random() - .5) * .4, by = (Math.random() - .5) * .4;
      return {
        x: Math.random() * W, y: Math.random() * H,
        bx, by, vx: bx, vy: by,
        g: Math.random() < .4 ? GLYPHS[Math.random() * GLYPHS.length | 0] : null,
        s: 13 + Math.random() * 9
      };
    });
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      if (!still) {
        if (m) {
          const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy);
          if (d < PUSH && d > 0) {
            const f = (PUSH - d) / PUSH;
            p.vx += dx / d * f * .35; p.vy += dy / d * f * .35;
          }
        }
        p.vx += (p.bx - p.vx) * .03; p.vy += (p.by - p.vy) * .03;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -40) p.x = W + 40; else if (p.x > W + 40) p.x = -40;
        if (p.y < -40) p.y = H + 40; else if (p.y > H + 40) p.y = -40;
      }
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < P.length; i++) {
      for (let j = i + 1; j < P.length; j++) {
        const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(255,255,255,${(1 - d / LINK) * .3})`;
          ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y); ctx.stroke();
        }
      }
      if (m) {
        const d = Math.hypot(P[i].x - m.x, P[i].y - m.y);
        if (d < REACH) {
          ctx.strokeStyle = `rgba(255,255,255,${(1 - d / REACH) * .7})`;
          ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      }
    }
    for (const p of P) {
      let near = 0;
      if (m) { const d = Math.hypot(p.x - m.x, p.y - m.y); if (d < REACH) near = 1 - d / REACH; }
      if (p.g) {
        ctx.font = `600 ${p.s}px "Courier New", monospace`;
        ctx.fillStyle = `rgba(255,255,255,${.28 + near * .55})`;
        ctx.fillText(p.g, p.x, p.y);
      } else {
        ctx.fillStyle = `rgba(255,255,255,${.65 + near * .35})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2 + near * 2, 0, 6.283); ctx.fill();
      }
    }
  }

  function loop() { if (running) frame(); requestAnimationFrame(loop); }

  window.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    m = (x >= 0 && y >= 0 && x <= r.width && y <= r.height) ? { x, y } : null;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { m = null; });

  new IntersectionObserver(([en]) => { running = en.isIntersecting; }).observe(hero);
  new ResizeObserver(() => {
    if (!P.length || Math.abs(hero.clientWidth - W) > 1 || Math.abs(hero.clientHeight - H) > 120) {
      setup();
      if (still) frame();
    }
  }).observe(hero);

  setup();
  if (still) frame(); else loop();
})();

// Tombol "Lihat semua project"
const tgl = document.getElementById('toggle-projects');
const extra = document.getElementById('more-projects');
const note = document.getElementById('more-note');
if (tgl && extra) {
  tgl.addEventListener('click', () => {
    const show = extra.hidden;
    extra.hidden = !show;
    if (note) note.hidden = !show;
    tgl.setAttribute('aria-expanded', show);
    tgl.firstElementChild.textContent = show ? 'Sembunyikan project lainnya' : 'Lihat semua project';
    if (!show) document.getElementById('proyek').scrollIntoView();
  });
}

// Ornamen background tiap section
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const B = '55,132,250';
  const R = (a, b) => a + Math.random() * (b - a);
  const SET = {
    code: ['</>', '{ }', '=>', '( )', '[ ]', '&&', '/>', ';'],
    math: ['Σ', 'π', 'λ', '∫', '√', '∞', 'Δ', '01']
  };

  const T = {
    // Simbol melayang yang menjauh dari kursor
    glyph(c, set) {
      const L = SET[set];
      const P = Array.from({ length: Math.round(c.w * c.h / 24000) }, () => ({
        x: R(0, c.w), y: R(0, c.h), vx: R(-.15, .15), vy: R(-.12, .12),
        s: R(18, 36), g: L[R(0, L.length) | 0], ox: 0, oy: 0
      }));
      return () => {
        for (const p of P) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -60) p.x = c.w + 60; else if (p.x > c.w + 60) p.x = -60;
          if (p.y < -40) p.y = c.h + 40; else if (p.y > c.h + 40) p.y = -40;
          let a = .13;
          if (c.m) {
            const dx = p.x + p.ox - c.m.x, dy = p.y + p.oy - c.m.y, d = Math.hypot(dx, dy);
            if (d < 170 && d > 0) { const f = 1 - d / 170; p.ox += dx / d * f * 4; p.oy += dy / d * f * 4; a += f * .35; }
          }
          p.ox *= .93; p.oy *= .93;
          c.ctx.font = `600 ${p.s}px "Courier New",monospace`;
          c.ctx.fillStyle = `rgba(${B},${a})`;
          c.ctx.fillText(p.g, p.x + p.ox, p.y + p.oy);
        }
      };
    },

    // Bingkai jendela browser, parallax mengikuti kursor
    frames(c) {
      const P = Array.from({ length: Math.max(5, Math.round(c.w / 150)) }, () => ({
        x: R(0, c.w), y: R(0, c.h), w: R(80, 180), h: R(55, 115), z: R(.03, .1),
        vy: R(.08, .2) * (Math.random() < .5 ? -1 : 1), ox: 0, oy: 0
      }));
      return () => {
        const mx = c.m ? c.m.x - c.w / 2 : 0, my = c.m ? c.m.y - c.h / 2 : 0, g = c.ctx;
        for (const p of P) {
          p.y += p.vy;
          if (p.y < -140) p.y = c.h + 20; else if (p.y > c.h + 20) p.y = -140;
          p.ox += (-mx * p.z - p.ox) * .06; p.oy += (-my * p.z - p.oy) * .06;
          const x = p.x + p.ox, y = p.y + p.oy;
          const hit = c.m && c.m.x > x && c.m.x < x + p.w && c.m.y > y && c.m.y < y + p.h;
          g.strokeStyle = `rgba(${B},${hit ? .5 : .17})`;
          g.strokeRect(x, y, p.w, p.h);
          g.beginPath();
          g.moveTo(x, y + 16); g.lineTo(x + p.w, y + 16);
          g.moveTo(x + 10, y + 30); g.lineTo(x + p.w * .6, y + 30);
          g.moveTo(x + 10, y + 42); g.lineTo(x + p.w * .4, y + 42);
          g.stroke();
          g.fillStyle = `rgba(${B},${hit ? .6 : .25})`;
          for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x + 8 + i * 9, y + 8, 2.2, 0, 6.283); g.fill(); }
        }
      };
    },

    // Kisi heksagon yang menyala di dekat kursor
    hex(c) {
      const r = 30, w = r * 1.732, H = [];
      for (let row = 0, y = 0; y < c.h + r; row++, y += r * 1.5)
        for (let x = (row % 2) * w / 2; x < c.w + w; x += w) H.push([x, y]);
      return () => {
        const g = c.ctx;
        for (const [x, y] of H) {
          let k = 0;
          if (c.m) { const d = Math.hypot(x - c.m.x, y - c.m.y); if (d < 190) k = 1 - d / 190; }
          g.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = Math.PI / 3 * i + Math.PI / 6;
            g[i ? 'lineTo' : 'moveTo'](x + (r - 1.5) * Math.cos(a), y + (r - 1.5) * Math.sin(a));
          }
          g.closePath();
          g.strokeStyle = `rgba(${B},${.09 + k * .5})`; g.stroke();
          if (k > .15) { g.fillStyle = `rgba(${B},${k * .18})`; g.fill(); }
        }
      };
    },

    // Gelombang yang membesar di dekat kursor
    waves(c) {
      const N = 5;
      return () => {
        const g = c.ctx;
        for (let k = 0; k < N; k++) {
          const base = c.h * (k + 1) / (N + 1);
          g.beginPath();
          for (let x = 0; x <= c.w; x += 10) {
            let amp = 14 + k * 3;
            if (c.m) amp += 46 * Math.exp(-((x - c.m.x) ** 2) / 22000) * Math.exp(-((base - c.m.y) ** 2) / 60000);
            const y = base + Math.sin(x * .008 + c.t * (1 + k * .15) + k) * amp;
            x ? g.lineTo(x, y) : g.moveTo(x, y);
          }
          g.strokeStyle = `rgba(${B},${.12 + k * .02})`; g.stroke();
        }
      };
    },

    // Cincin sinyal dari kursor
    ripples(c) {
      const Q = []; let last = null, n = 0;
      return () => {
        if (c.m && (!last || Math.hypot(c.m.x - last.x, c.m.y - last.y) > 50)) {
          Q.push({ x: c.m.x, y: c.m.y, r: 0 }); last = { x: c.m.x, y: c.m.y };
        }
        if (n++ % 150 === 0) Q.push({ x: c.w * .85, y: c.h * .3, r: 0 });
        for (let i = Q.length - 1; i >= 0; i--) {
          const q = Q[i]; q.r += 1.4;
          const a = 1 - q.r / 190;
          if (a <= 0) { Q.splice(i, 1); continue; }
          c.ctx.strokeStyle = `rgba(${B},${a * .4})`;
          c.ctx.beginPath(); c.ctx.arc(q.x, q.y, q.r, 0, 6.283); c.ctx.stroke();
        }
      };
    }
  };

  document.querySelectorAll('[data-bg]').forEach(sec => {
    const cv = document.createElement('canvas');
    cv.className = 'bgc'; cv.setAttribute('aria-hidden', 'true');
    sec.prepend(cv);
    const ctx = cv.getContext('2d');
    const c = { ctx, w: 0, h: 0, m: null, t: 0 };
    let draw, vis = true;

    const step = () => { if (!draw) return; ctx.clearRect(0, 0, c.w, c.h); c.t += .02; ctx.lineWidth = 1.2; draw(); };
    const setup = () => {
      const d = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.5 : 2);
      c.w = sec.clientWidth; c.h = sec.clientHeight;
      cv.width = c.w * d; cv.height = c.h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      const [k, a] = sec.dataset.bg.split(':');
      draw = T[k](c, a);
      if (reduce) step();
    };

    (function loop() { if (vis && !reduce) step(); requestAnimationFrame(loop); })();
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(sec);
    new ResizeObserver(setup).observe(sec);
    addEventListener('pointermove', e => {
      const r = sec.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.m = (x >= 0 && y >= 0 && x <= r.width && y <= r.height) ? { x, y } : null;
    }, { passive: true });
  });
})();

// Jejak simbol kode dari kursor
(function () {
  const cv = document.getElementById('trail');
  if (!cv) return;
  if (matchMedia('(hover: none)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cv.remove(); return; // nonaktif di layar sentuh dan saat reduce motion
  }
  const ctx = cv.getContext('2d');
  const hero = document.querySelector('.hero');
  const G = ['</>', '{ }', '=>', ';', '( )', '[ ]', '&&', '/>'];
  const P = [];
  let W = 0, H = 0, last = null, run = false;

  function size() {
    const d = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * d; cv.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  size();
  addEventListener('resize', size);

  addEventListener('pointermove', e => {
    if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 38) return;
    last = { x: e.clientX, y: e.clientY };
    const r = hero.getBoundingClientRect();
    const onHero = e.clientY >= r.top && e.clientY <= r.bottom;
    P.push({
      x: e.clientX, y: e.clientY,
      vx: (Math.random() - .5) * .6, vy: Math.random() * .5 + .25,
      g: G[Math.random() * G.length | 0], s: 12 + Math.random() * 6,
      r: (Math.random() - .5) * .4, life: 1,
      c: onHero ? '255,255,255' : '55,132,250'
    });
    if (P.length > 40) P.shift();
    if (!run) { run = true; requestAnimationFrame(tick); }
  }, { passive: true });

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.life -= .02;
      if (p.life <= 0) { P.splice(i, 1); continue; }
      p.x += p.vx; p.y += p.vy;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.font = `600 ${p.s}px "Courier New", monospace`;
      ctx.fillStyle = `rgba(${p.c},${p.life * .75})`;
      ctx.fillText(p.g, 0, 0);
      ctx.restore();
    }
    if (P.length) requestAnimationFrame(tick);
    else { run = false; ctx.clearRect(0, 0, W, H); }
  }
})();