/* ═══════════════════════════════════════════════════════════
   BRODY SNYDER - PORTFOLIO
   No dependencies. No build step. Just the browser.
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE    = matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ─────────────────────────────────────────────────────────
   1. SEEDED NOISE  - deterministic generated artwork
   ───────────────────────────────────────────────────────── */
function rng(seed){
  let s = 0;
  for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

/* ─────────────────────────────────────────────────────────
   2. GENERATED COVER PLATES
   Each project without a photo gets its own instrument plate.
   ───────────────────────────────────────────────────────── */
function plate(kind, accent, seed){
  const W = 800, H = 500, r = rng(seed);
  const bg = `<rect width="${W}" height="${H}" fill="#0A0D12"/>`;

  /* faint measurement grid, on every plate */
  let gridLines = '';
  for (let x = 0; x <= W; x += 40) gridLines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#141A21" stroke-width="1"/>`;
  for (let y = 0; y <= H; y += 40) gridLines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#141A21" stroke-width="1"/>`;

  let art = '';

  if (kind === 'wave'){
    for (let k = 0; k < 3; k++){
      const amp = 40 + r() * 55, freq = .012 + r() * .014, ph = r() * 6.28;
      const op  = k === 0 ? 1 : .3 - k * .08;
      let d = '';
      for (let x = 0; x <= W; x += 4){
        const y = H/2
          + Math.sin(x * freq + ph) * amp
          + Math.sin(x * freq * 2.7 + ph * 2) * amp * .32
          + (r() - .5) * 3;
        d += (x === 0 ? 'M' : 'L') + x + ',' + y.toFixed(1);
      }
      art += `<path d="${d}" fill="none" stroke="${accent}" stroke-width="${k===0?2:1}" opacity="${op}"/>`;
    }
    art += `<line x1="0" y1="${H/2}" x2="${W}" y2="${H/2}" stroke="${accent}" stroke-width="1" opacity=".18" stroke-dasharray="6 6"/>`;
  }

  else if (kind === 'scatter'){
    for (let i = 0; i < 260; i++){
      const t  = r();
      const x  = 60 + t * (W - 120) + (r() - .5) * 70;
      const y  = H - 60 - Math.pow(t, .8) * (H - 140) + (r() - .5) * 90;
      const rad = 1.2 + r() * 3.4;
      art += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(1)}" fill="${accent}" opacity="${(.12 + r() * .5).toFixed(2)}"/>`;
    }
    art += `<path d="M60,${H-60} C ${W*.35},${H*.62} ${W*.6},${H*.3} ${W-60},70" fill="none" stroke="${accent}" stroke-width="1.6" opacity=".85" stroke-dasharray="5 5"/>`;
  }

  else if (kind === 'grid'){
    const cols = 16, rows = 10, cw = W / cols, chh = H / rows;
    for (let i = 0; i < cols; i++){
      for (let j = 0; j < rows; j++){
        const v = r();
        if (v < .42) continue;
        const pad = 3, o = (v - .42) / .58;
        art += `<rect x="${(i*cw+pad).toFixed(1)}" y="${(j*chh+pad).toFixed(1)}" width="${(cw-pad*2).toFixed(1)}" height="${(chh-pad*2).toFixed(1)}" fill="${accent}" opacity="${(o*.62).toFixed(2)}" rx="1"/>`;
      }
    }
  }

  else if (kind === 'orbit'){
    const cx = W/2, cy = H/2;
    for (let k = 0; k < 5; k++){
      const rx = 70 + k * 62, ry = rx * (.28 + r() * .16), rot = r() * 180;
      art += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry.toFixed(1)}" fill="none" stroke="${accent}" stroke-width="1" opacity="${(.42 - k*.06).toFixed(2)}" transform="rotate(${rot.toFixed(1)} ${cx} ${cy})"/>`;
      const a = r() * 6.28;
      art += `<circle cx="${(cx + Math.cos(a)*rx).toFixed(1)}" cy="${(cy + Math.sin(a)*ry).toFixed(1)}" r="3.5" fill="${accent}"/>`;
    }
    art += `<circle cx="${cx}" cy="${cy}" r="7" fill="${accent}"/>`;
  }

  else if (kind === 'bars'){
    const n = 26, bw = (W - 80) / n;
    for (let i = 0; i < n; i++){
      const h = 30 + Math.pow(r(), 1.5) * (H - 130);
      art += `<rect x="${(40 + i*bw + 2).toFixed(1)}" y="${(H - 50 - h).toFixed(1)}" width="${(bw-4).toFixed(1)}" height="${h.toFixed(1)}" fill="${accent}" opacity="${(.22 + r()*.6).toFixed(2)}"/>`;
    }
    art += `<line x1="40" y1="${H-50}" x2="${W-40}" y2="${H-50}" stroke="${accent}" stroke-width="1.4" opacity=".6"/>`;
  }

  else { /* pixels */
    const s = 25;
    for (let x = 0; x < W; x += s){
      for (let y = 0; y < H; y += s){
        const v = r();
        if (v < .72) continue;
        art += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${accent}" opacity="${((v-.72)*1.7).toFixed(2)}"/>`;
      }
    }
  }

  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
    <defs><radialGradient id="g-${seed}" cx="50%" cy="118%" r="80%">
      <stop offset="0%" stop-color="${accent}" stop-opacity=".28"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient></defs>
    ${bg}${gridLines}${art}
    <rect width="${W}" height="${H}" fill="url(#g-${seed})"/>
  </svg>`;
}

/* ─────────────────────────────────────────────────────────
   3. HERO FIELD  - thermal plasma + reactive trace
   ───────────────────────────────────────────────────────── */
function heroField(){
  const cv = $('#field');
  if (!cv) return;
  const ctx = cv.getContext('2d', { alpha: false });
  let w = 0, h = 0, dpr = 1, t = 0, raf = 0;
  const mouse = { x: .5, y: .5, tx: .5, ty: .5 };

  const blobs = [
    { x:.18, y:.30, r:.46, c:[ 76,157,255], s:.00021, p:0 },
    { x:.72, y:.22, r:.40, c:[ 34,211,216], s:.00017, p:2.2 },
    { x:.52, y:.62, r:.44, c:[255,122, 26], s:.00013, p:4.1 },
    { x:.88, y:.66, r:.32, c:[245,194, 74], s:.00025, p:1.1 }
  ];

  function size(){
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(){
    t += 1;
    mouse.x += (mouse.tx - mouse.x) * .045;
    mouse.y += (mouse.ty - mouse.y) * .045;

    ctx.fillStyle = '#07090C';
    ctx.fillRect(0, 0, w, h);

    /* thermal blobs */
    ctx.globalCompositeOperation = 'lighter';
    for (const b of blobs){
      const dx = Math.sin(t * b.s * 1000 + b.p) * .10 + (mouse.x - .5) * .05;
      const dy = Math.cos(t * b.s * 780  + b.p) * .08 + (mouse.y - .5) * .05;
      const cx = (b.x + dx) * w, cy = (b.y + dy) * h;
      const rad = b.r * Math.max(w, h) * (.9 + Math.sin(t * b.s * 620 + b.p) * .1);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0,   `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0.24)`);
      g.addColorStop(.45, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0.07)`);
      g.addColorStop(1,   `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 6.2832); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    /* measurement grid */
    const step = Math.max(58, Math.min(w, h) / 14);
    ctx.strokeStyle = 'rgba(255,255,255,.032)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += step){ ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, h); }
    for (let y = 0; y <= h; y += step){ ctx.moveTo(0, y + .5); ctx.lineTo(w, y + .5); }
    ctx.stroke();

    /* reactive trace */
    const base = h * (.60 + mouse.y * .16);
    const amp  = h * (.030 + (1 - mouse.y) * .050);
    const freq = .0042 + mouse.x * .0052;

    for (let pass = 0; pass < 2; pass++){
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3){
        const y = base
          + Math.sin(x * freq + t * .013) * amp
          + Math.sin(x * freq * 2.6 - t * .019) * amp * .34
          + Math.sin(x * freq * 5.3 + t * .009) * amp * .13;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      if (pass === 0){
        ctx.strokeStyle = 'rgba(255,122,26,.24)';
        ctx.lineWidth = 8;
        ctx.filter = 'blur(7px)';
      } else {
        ctx.strokeStyle = 'rgba(255,146,64,.78)';
        ctx.lineWidth = 1.5;
        ctx.filter = 'none';
      }
      ctx.stroke();
    }
    ctx.filter = 'none';

    /* travelling sample marker */
    const mx = ((t * 1.5) % (w + 200)) - 100;
    if (mx > 0 && mx < w){
      const my = base
        + Math.sin(mx * freq + t * .013) * amp
        + Math.sin(mx * freq * 2.6 - t * .019) * amp * .34
        + Math.sin(mx * freq * 5.3 + t * .009) * amp * .13;
      ctx.fillStyle = 'rgba(255,160,80,.9)';
      ctx.beginPath(); ctx.arc(mx, my, 2.6, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = 'rgba(255,122,26,.16)';
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, h); ctx.stroke();
    }

    raf = requestAnimationFrame(draw);
  }

  size();
  addEventListener('resize', size, { passive: true });

  if (REDUCED){ draw(); cancelAnimationFrame(raf); return; }

  addEventListener('pointermove', e => {
    mouse.tx = e.clientX / innerWidth;
    mouse.ty = Math.min(1, Math.max(0, e.clientY / innerHeight));
  }, { passive: true });

  draw();

  /* stop painting when the hero is off screen */
  new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) raf = requestAnimationFrame(draw);
  }, { threshold: 0 }).observe(cv);
}

/* ─────────────────────────────────────────────────────────
   4. WORK GRID
   ───────────────────────────────────────────────────────── */
/* rows always sum to 12 columns: 6+6, 4+4+4, 6+6, 4+4+4, 6+6, then a 12-wide finale */
const LAYOUT = ['wide','wide','','','','wide','wide','','','','wide','wide','full'];

function coverHTML(p, i){
  if (typeof p.cover === 'string'){
    const cls = p.coverFit === 'contain' ? ' card__media--contain' : '';
    return `<div class="card__media${cls}">
      <img src="${p.cover}" alt="${p.title} project output" loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async">
      <span class="card__scan"></span><span class="card__glow"></span>
      <span class="card__idx">${String(i + 1).padStart(2,'0')}</span>
      <span class="card__chip">${p.cat}</span>
    </div>`;
  }
  return `<div class="card__media">
    ${plate(p.cover.gen, p.accent, p.id)}
    <span class="card__glow"></span>
    <span class="card__idx">${String(i + 1).padStart(2,'0')}</span>
    <span class="card__chip">${p.cat}</span>
  </div>`;
}

function buildGrid(){
  const grid = $('#grid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((p, i) => `
    <button class="card rv ${LAYOUT[i] ? 'card--' + LAYOUT[i] : ''}"
            style="--c:${p.accent}"
            data-cat="${p.cat}" data-id="${p.id}"
            aria-label="Open case study: ${p.title}">
      ${coverHTML(p, i)}
      <div class="card__body">
        <p class="card__org"><b>${p.org}</b><span>${p.period}</span></p>
        <h3 class="card__title">${p.title}</h3>
        <p class="card__blurb">${p.blurb}</p>
        <p class="card__foot">
          <span>${p.stack.slice(0,3).join(' · ')}</span>
          <span class="card__open">CASE STUDY <i aria-hidden="true">→</i></span>
        </p>
      </div>
    </button>`).join('');

  /* filters */
  const bar = $('#filters');
  const counts = c => c === 'ALL' ? PROJECTS.length : PROJECTS.filter(p => p.cat === c).length;
  bar.innerHTML = CATEGORIES
    .filter(c => counts(c) > 0)
    .map(c => `<button class="chip${c === 'ALL' ? ' on' : ''}" data-f="${c}" role="tab" aria-selected="${c === 'ALL'}">${c}<b>${counts(c)}</b></button>`)
    .join('');

  bar.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const f = chip.dataset.f;
    $$('.chip', bar).forEach(c => {
      const on = c === chip;
      c.classList.toggle('on', on);
      c.setAttribute('aria-selected', on);
    });
    $$('.card', grid).forEach(card => {
      const show = f === 'ALL' || card.dataset.cat === f;
      card.classList.add('filtering');
      setTimeout(() => {
        card.classList.toggle('hidden', !show);
        requestAnimationFrame(() => card.classList.remove('filtering'));
      }, 180);
    });
  });

  grid.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (card) openCase(card.dataset.id);
  });
}

/* ─────────────────────────────────────────────────────────
   5. CASE STUDY OVERLAY
   ───────────────────────────────────────────────────────── */
const caseEl  = $('#case');
const caseBody = $('#caseBody');
let lastFocus = null;

function caseHTML(p, idx){
  const hero = typeof p.cover === 'string'
    ? `<div class="cs__hero${p.coverFit === 'contain' ? ' cs__hero--contain' : ''}"><img src="${p.cover}" alt=""></div>`
    : `<div class="cs__hero">${plate(p.cover.gen, p.accent, p.id + '-hero')}</div>`;

  const gallery = (p.gallery || []).map(g => `
    <div class="cs__shot">
      <figure>
        <img src="${g.src}" alt="${g.cap}" loading="lazy" decoding="async" class="${g.pad ? 'pad' : ''}">
        <figcaption>${g.cap}</figcaption>
      </figure>
    </div>`).join('');

  const prev = (idx - 1 + PROJECTS.length) % PROJECTS.length;
  const next = (idx + 1) % PROJECTS.length;

  return `
  <div style="--c:${p.accent}">
    ${hero}
    <div class="cs__head">
      <p class="cs__kind">${String(idx + 1).padStart(2,'0')} // ${p.tags.join(' · ')}</p>
      <h2 class="cs__title" id="caseTitle">${p.title}</h2>
      <p class="cs__sub">${p.subtitle}</p>
    </div>

    <div class="cs__specs">
      <dl class="cs__spec"><dt>ORGANIZATION</dt><dd>${p.org}</dd></dl>
      <dl class="cs__spec"><dt>ROLE</dt><dd>${p.role}</dd></dl>
      <dl class="cs__spec"><dt>PERIOD</dt><dd>${p.period}</dd></dl>
      ${p.link ? `<dl class="cs__spec"><dt>LIVE</dt><dd><a href="${p.link.href}" target="_blank" rel="noopener">${p.link.label} ↗</a></dd></dl>` : ''}
    </div>

    <div class="cs__body">
      ${p.body.map(b => `<div class="cs__block"><h3>${b.h}</h3><p>${b.p}</p></div>`).join('')}
      <div class="cs__block">
        <h3>Stack</h3>
        <ul class="cs__tags">${p.stack.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>
    </div>

    ${gallery ? `<div class="cs__gallery">${gallery}</div>` : ''}
    ${p.note ? `<p class="cs__note">${p.note}</p>` : ''}

    <div class="cs__nav">
      <button data-go="${PROJECTS[prev].id}">← ${PROJECTS[prev].title}</button>
      <button data-go="${PROJECTS[next].id}">${PROJECTS[next].title} →</button>
    </div>
  </div>`;
}

function openCase(id){
  const idx = PROJECTS.findIndex(p => p.id === id);
  if (idx < 0) return;
  if (!caseEl.classList.contains('is-open')) lastFocus = document.activeElement;

  caseBody.innerHTML = caseHTML(PROJECTS[idx], idx);
  caseBody.scrollTop = 0;
  caseEl.classList.add('is-open');
  caseEl.setAttribute('aria-hidden', 'false');
  caseEl.focus();
  history.replaceState(null, '', '#' + id);
}

function closeCase(){
  if (!caseEl.classList.contains('is-open')) return;
  caseEl.classList.remove('is-open');
  caseEl.setAttribute('aria-hidden', 'true');
  history.replaceState(null, '', '#work');
  if (lastFocus) lastFocus.focus();
}

caseEl.addEventListener('click', e => {
  if (e.target.closest('[data-close]')) return closeCase();
  const go = e.target.closest('[data-go]');
  if (go) openCase(go.dataset.go);
});
addEventListener('keydown', e => { if (e.key === 'Escape') closeCase(); });

/* keep focus inside the panel while it is open */
caseEl.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const f = $$('a[href], button, [tabindex]:not([tabindex="-1"])', caseEl).filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
});

/* ─────────────────────────────────────────────────────────
   6. TIMELINE + STACK + TICKER
   ───────────────────────────────────────────────────────── */
function buildTimeline(){
  const el = $('#timeline');
  if (!el) return;
  el.innerHTML = TIMELINE.map(t => `
    <li class="tl rv${t.live ? ' live' : ''}">
      <div class="tl__top">
        <span class="tl__when">${t.when}</span>
        <span class="tl__kind">${t.kind}</span>
      </div>
      <p class="tl__what">${t.what}</p>
      <p class="tl__where">${t.where}</p>
    </li>`).join('');
}

function buildStack(){
  const el = $('#stackGrid');
  if (!el) return;
  el.innerHTML = STACK.map(g => `
    <div class="sgroup rv">
      <h3 class="sgroup__h">${g.group}<b>${String(g.items.length).padStart(2,'0')}</b></h3>
      <ul class="sgroup__list">${g.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`).join('');
}

function buildTicker(){
  const el = $('#tickerTrack');
  if (!el) return;
  const words = ['EMBEDDED FIRMWARE','COMPUTER VISION','PYTORCH','YOLOv8','OPENCV','C / C++','SATELLITE COMMS',
                 'POWER ELECTRONICS','MACHINE INTELLIGENCE','REACT','TYPESCRIPT','CONTROL SYSTEMS',
                 'OCR PIPELINES','ELECTRON','PURDUE CS','SIGNAL PROCESSING'];
  const run = words.map(w => `<span>${w}</span><b>◆</b>`).join('');
  el.innerHTML = run + run;   /* doubled for a seamless -50% loop */
}

/* ─────────────────────────────────────────────────────────
   7. SCROLL BEHAVIOUR
   ───────────────────────────────────────────────────────── */
function reveals(){
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('in'), Math.min(i * 55, 300));
      obs.unobserve(e.target);
    });
  }, { threshold: .1, rootMargin: '0px 0px -8% 0px' });

  $$('.rv, .shead, .stat, .about__bio').forEach(el => { el.classList.add('rv'); io.observe(el); });
}

function counters(){
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.dec || '0', 10);
      const suf = el.dataset.suffix || '';
      const dur = 1400;
      let t0 = null;
      const tick = ts => {
        if (!t0) t0 = ts;
        const k = Math.min((ts - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = (end * eased).toFixed(dec) + (k === 1 ? suf : '');
        if (k < 1) requestAnimationFrame(tick);
      };
      REDUCED ? el.textContent = end.toFixed(dec) + suf : requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach(el => io.observe(el));
}

function navState(){
  const nav = $('#nav');
  const links = $$('.nav__links a');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);

  addEventListener('scroll', () => {
    nav.classList.toggle('stuck', scrollY > 40);
    const y = scrollY + innerHeight * .32;
    let current = null;
    sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }, { passive: true });

  /* mobile menu */
  const burger = $('#burger'), menu = $('.nav__links');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  /* smooth anchors */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = $(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function clock(){
  const el = $('#clock');
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    setTimeout(tick, 1000);
  };
  tick();
}

function reticle(){
  if (!FINE || REDUCED) return;
  const el = $('.reticle');
  addEventListener('pointermove', e => {
    el.classList.add('on');
    el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    el.classList.toggle('grow', !!e.target.closest('a, button, .card'));
  }, { passive: true });
  addEventListener('pointerleave', () => el.classList.remove('on'));
}

/* ─────────────────────────────────────────────────────────
   8. BOOT
   ───────────────────────────────────────────────────────── */
buildGrid();
buildTimeline();
buildStack();
buildTicker();
heroField();
reveals();
counters();
navState();
clock();
reticle();
$('#year').textContent = new Date().getFullYear();

/* deep link straight to a case study */
const hash = location.hash.slice(1);
if (hash && PROJECTS.some(p => p.id === hash)) openCase(hash);

})();
