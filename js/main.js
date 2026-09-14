/* ═══════════════════════════════════════════════════════════
   BRODY SNYDER
   Builds the work list, and the larger view you get on click.
   No dependencies, no build step.
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* a project shows a picture only if it has a real one. projects.js can
   also carry { gen: ... } placeholders, which are deliberately skipped. */
const shotOf = p => (typeof p.cover === 'string' ? p.cover : null);

/* ── the list ─────────────────────────────────────────────── */
function buildList(){
  const list = $('#list');
  if (!list) return;

  list.innerHTML = PROJECTS.map((p, i) => {
    const src = shotOf(p);
    const media = src
      ? `<span class="row__media ${p.coverFit === 'contain' ? 'row__media--contain' : ''}">
           <img src="${esc(src)}" alt="${esc(p.title)}" loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async">
         </span>`
      : `<span class="row__media row__media--empty" aria-hidden="true"></span>`;

    return `
      <li class="row">
        <button class="row__btn" data-id="${esc(p.id)}" aria-label="View ${esc(p.title)}">
          ${media}
          <span class="row__text">
            <span class="row__meta">${String(i + 1).padStart(2, '0')} &nbsp;/&nbsp; ${esc(p.org)} &nbsp;/&nbsp; ${esc(p.period)}</span>
            <span class="row__title">${esc(p.title)}</span>
            <span class="row__blurb">${esc(p.blurb)}</span>
            <span class="row__stack">${p.stack.map(esc).join(' · ')}</span>
          </span>
        </button>
      </li>`;
  }).join('');

  list.addEventListener('click', e => {
    const btn = e.target.closest('.row__btn');
    if (btn) open(btn.dataset.id);
  });
}

/* ── the larger view ──────────────────────────────────────── */
const view = $('#view');
const viewBody = $('#viewBody');
let lastFocus = null;

function csHTML(p, idx){
  const src = shotOf(p);
  const contain = p.coverFit === 'contain' ? ' class="contain"' : '';
  const capOf = s => {
    const g = (p.gallery || []).find(x => x.src === s);
    return g ? g.cap : '';
  };

  const hero = src ? `
    <figure class="cs__shot">
      <img src="${esc(src)}"${contain} alt="${esc(p.title)}">
      ${capOf(src) ? `<figcaption>${esc(capOf(src))}</figcaption>` : ''}
    </figure>` : '';

  const rest = (p.gallery || [])
    .filter(g => g.src !== src)
    .map(g => `
      <figure class="cs__shot">
        <img src="${esc(g.src)}"${g.pad ? ' class="contain"' : ''} alt="${esc(g.cap)}" loading="lazy" decoding="async">
        <figcaption>${esc(g.cap)}</figcaption>
      </figure>`).join('');

  const prev = idx > 0 ? PROJECTS[idx - 1] : null;
  const next = idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null;

  return `
  <div class="cs">
    <p class="cs__meta">${String(idx + 1).padStart(2, '0')} &nbsp;/&nbsp; ${p.tags.map(esc).join(' · ')}</p>
    <h1 class="cs__title" id="viewTitle">${esc(p.title)}</h1>
    <p class="cs__sub">${esc(p.subtitle)}</p>

    <div class="cs__facts">
      <span><i>ORG</i>${esc(p.org)}</span>
      <span><i>ROLE</i>${esc(p.role)}</span>
      <span><i>PERIOD</i>${esc(p.period)}</span>
      ${p.link ? `<span><i>LIVE</i><a href="${esc(p.link.href)}" target="_blank" rel="noopener">${esc(p.link.label)}</a></span>` : ''}
    </div>

    ${hero}

    ${p.body.map(b => `<div class="cs__blk"><h2>${esc(b.h)}</h2><p>${esc(b.p)}</p></div>`).join('')}

    <p class="cs__stack"><b>Stack</b>${p.stack.map(esc).join(' · ')}</p>
    ${p.note ? `<p class="cs__note">${esc(p.note)}</p>` : ''}

    ${rest}

    <div class="cs__nav">
      <button ${prev ? `data-go="${esc(prev.id)}"` : 'disabled'}>${prev ? '&larr; ' + esc(prev.title) : ''}</button>
      <button ${next ? `data-go="${esc(next.id)}"` : 'disabled'}>${next ? esc(next.title) + ' &rarr;' : ''}</button>
    </div>
  </div>`;
}

function open(id){
  const idx = PROJECTS.findIndex(p => p.id === id);
  if (idx < 0) return;
  if (!view.classList.contains('open')) lastFocus = document.activeElement;

  viewBody.innerHTML = csHTML(PROJECTS[idx], idx);
  viewBody.scrollTop = 0;
  view.classList.add('open');
  view.setAttribute('aria-hidden', 'false');
  view.focus();
  history.replaceState(null, '', '#' + id);
}

function close(){
  if (!view.classList.contains('open')) return;
  view.classList.remove('open');
  view.setAttribute('aria-hidden', 'true');
  history.replaceState(null, '', location.pathname);
  if (lastFocus) lastFocus.focus();
}

view.addEventListener('click', e => {
  if (e.target.closest('[data-close]')) return close();
  const go = e.target.closest('[data-go]');
  if (go) open(go.dataset.go);
});

addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

/* keep tab focus inside the panel while it is open */
view.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const f = $$('a[href], button:not([disabled])', view).filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
});

/* ── boot ─────────────────────────────────────────────────── */
buildList();

const hash = location.hash.slice(1);
if (hash && PROJECTS.some(p => p.id === hash)) open(hash);

})();
