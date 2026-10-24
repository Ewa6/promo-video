// HTML templates for the docs site. Everything is static HTML; site.js adds the interactive parts.
import { SITE } from './nav.mjs';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Card text: whole sentences that fit in about n characters.
const clip = (s, n = 130) => {
  let out = '';
  for (const x of s.split(/(?<=[.!?])\s+/)) { if (out && (out + ' ' + x).length > n) break; out = out ? out + ' ' + x : x; }
  return out.length > n + 40 ? out.slice(0, out.lastIndexOf(' ', n)) + '…' : out;
};

// ── The mark: three arcs (as in the portfolio logo) around a play button ──
const polar = (cx, cy, r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)];
};
const arc = (cx, cy, r, from, to) => {
  const [x1, y1] = polar(cx, cy, r, from);
  const [x2, y2] = polar(cx, cy, r, to);
  return `M${x1} ${y1}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};
// Each arc starts at a dot and sweeps clockwise; the three are spaced 120° apart.
const ARCS = [
  { cls: 'a-teal', from: 232, to: 322 },
  { cls: 'a-purple', from: 352, to: 82 + 360 },
  { cls: 'a-blue', from: 112, to: 202 },
];

export const mark = (size = 28) => {
  const c = 16, r = 11;
  return `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
    ${ARCS.map(({ cls, from, to }) => {
      const [dx, dy] = polar(c, c, r, from);
      return `<g class="${cls}"><path d="${arc(c, c, r, from, to)}" fill="none" stroke-width="3" stroke-linecap="round"/><circle cx="${dx}" cy="${dy}" r="2.6"/></g>`;
    }).join('')}
    <path class="play" d="M13.4 11.6v8.8a.8.8 0 0 0 1.2.7l7-4.4a.8.8 0 0 0 0-1.4l-7-4.4a.8.8 0 0 0-1.2.7Z"/>
  </svg>`;
};

// Frames from the example video in media/ (rendered from the template; see media-src/README.md).
const FRAMES = [
  { src: 'title.jpg', scene: 'Title', alt: 'Headline "Every update. One place." on a dark background' },
  { src: 'problem.jpg', scene: 'Problem', alt: 'Spreadsheets, emails, a sticky note and a chat message scattered across the screen' },
  { src: 'inbox.jpg', scene: 'Screen', alt: 'A mock app window with an inbox of three tasks and a cursor on the first one' },
  { src: 'steps.jpg', scene: 'Steps', alt: 'Four steps on a ring: Plan, Assign, Review, Ship, around the words One flow' },
  { src: 'endcard.jpg', scene: 'End card', alt: 'End card: Acme Cloud, Work, simplified, Book a demo' },
];

// ── Shared chrome ─────────────────────────────────────────────────────────
const svgIcon = {
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  sun: '<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>',
  arrow: '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back: '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></svg>',
  md: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15V9l2.5 3L12 9v6M15.5 9v6m0 0-2-2m2 2 2-2"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
};

function header(ctx) {
  return `<header class="site-header">
  <div class="header-inner">
    <button class="icon-btn nav-toggle" type="button" aria-label="Open navigation" aria-controls="sidebar" aria-expanded="false">${svgIcon.menu}</button>
    <a class="brand" href="${ctx.root}index.html">${mark(30)}<span class="brand-name">${esc(SITE.name)}</span><span class="brand-tag">Docs</span></a>
    <button class="search-btn" type="button" aria-label="Search the docs">${svgIcon.search}<span>Search the docs</span><kbd>Ctrl K</kbd></button>
    <nav class="header-links" aria-label="Elsewhere">
      <a class="pill" href="${SITE.portfolio}" target="_blank" rel="noopener">Portfolio</a>
      <a class="icon-btn" href="${SITE.repo}" target="_blank" rel="noopener" aria-label="GitHub repository">${svgIcon.github}</a>
      <button class="icon-btn theme-toggle" type="button" aria-label="Switch between dark and light theme">${svgIcon.sun}${svgIcon.moon}</button>
    </nav>
  </div>
  <div class="progress" aria-hidden="true"><span></span></div>
</header>`;
}

function sidebar(ctx) {
  return `<nav class="sidebar" id="sidebar" aria-label="Documentation">
  <div class="sidebar-inner">
    <a class="side-home${ctx.home ? ' is-active' : ''}" href="${ctx.root}index.html"${ctx.home ? ' aria-current="page"' : ''}>Documentation home</a>
    ${ctx.nav.map((s) => `<div class="side-section">
      <p class="side-title">${esc(s.title)}</p>
      <ul>${s.pages.map((p) => {
        const on = p.file === ctx.file;
        return `<li><a href="${ctx.root}${p.href}"${on ? ' class="is-active" aria-current="page"' : ''}>${esc(p.title)}</a></li>`;
      }).join('')}</ul>
    </div>`).join('')}
  </div>
</nav>`;
}

function toc(ctx) {
  const items = ctx.headings.filter((h) => h.depth === 2);
  if (items.length < 2) return '<aside class="toc" aria-hidden="true"></aside>';
  return `<aside class="toc" aria-labelledby="toc-title">
  <div class="toc-inner">
    <p class="toc-title" id="toc-title">On this page</p>
    <ul>${items.map((h) => `<li><a href="#${h.id}">${esc(h.text.replace(/^Step (\d+):\s*/, '$1. '))}</a></li>`).join('')}</ul>
    <a class="toc-top" href="#top">Back to top ↑</a>
  </div>
</aside>`;
}

function footer(ctx) {
  return `<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">${mark(26)}<span>Documentation by <a href="${SITE.portfolio}" target="_blank" rel="noopener">${esc(SITE.author)}</a></span></div>
    <ul class="footer-links">
      <li><a href="${SITE.repo}" target="_blank" rel="noopener">GitHub</a></li>
      <li><a href="${ctx.root}llms.txt">llms.txt</a></li>
      <li><a href="${SITE.portfolio}" target="_blank" rel="noopener">Technical writing portfolio</a></li>
    </ul>
  </div>
</footer>`;
}

const searchDialog = `<div class="search" hidden>
  <div class="search-backdrop" data-close></div>
  <div class="search-panel" role="dialog" aria-modal="true" aria-label="Search the docs">
    <div class="search-field">${svgIcon.search}<input type="search" placeholder="Search pages and sections" aria-label="Search pages and sections" autocomplete="off" spellcheck="false"><kbd data-close>Esc</kbd></div>
    <ul class="search-results" role="listbox" aria-label="Results"></ul>
    <p class="search-empty" hidden>No matches. Try a shorter word.</p>
  </div>
</div>`;

// ── Pages ───────────────────────────────────────────────────────────────
export function page(ctx) {
  const title = ctx.home ? `${SITE.name} documentation` : `${ctx.title} · ${SITE.name}`;
  const main = ctx.home ? ctx.body : docPage(ctx);
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(ctx.lead)}">
<meta name="author" content="${esc(SITE.author)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(ctx.lead)}">
<meta name="theme-color" content="#081024">
<link rel="icon" href="${ctx.root}assets/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="text/markdown" href="${ctx.root}${esc(ctx.file)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="${ctx.root}assets/styles.css">
<script>try{var t=localStorage.getItem('pv-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}</script>
</head>
<body class="${ctx.home ? 'is-home' : 'is-doc'}" data-root="${ctx.root}">
<a class="skip" href="#content">Skip to content</a>
${header(ctx)}
<div class="layout${ctx.home ? ' layout-home' : ''}" id="top">
${sidebar(ctx)}
<div class="scrim" data-close-nav></div>
${main}
</div>
${footer(ctx)}
${searchDialog}
<script src="${ctx.root}assets/site.js" defer></script>
</body>
</html>
`;
}

function docPage(ctx) {
  return `<main class="doc" id="content">
  <article class="article">
    <header class="article-head">
      <p class="kicker">${esc(ctx.section || 'Documentation')}</p>
      <h1>${esc(ctx.title)}</h1>
      <div class="rule" aria-hidden="true"></div>
      <p class="meta">${svgIcon.clock}<span>${ctx.minutes} min read</span></p>
    </header>
    <div class="prose">
${ctx.body}
    </div>
    <div class="page-actions">
      <a href="${SITE.editBase}${esc(ctx.file)}" target="_blank" rel="noopener">${svgIcon.edit}Edit this page on GitHub</a>
      <a href="${ctx.root}${esc(ctx.file)}">${svgIcon.md}View as Markdown</a>
    </div>
    <nav class="pager" aria-label="Previous and next pages">
      ${ctx.prev ? `<a class="pager-card prev" href="${ctx.root}${ctx.prev.href}"><span class="pager-label">${svgIcon.back}Previous</span><span class="pager-title">${esc(ctx.prev.title)}</span></a>` : '<span></span>'}
      ${ctx.next ? `<a class="pager-card next" href="${ctx.root}${ctx.next.href}"><span class="pager-label">Next${svgIcon.arrow}</span><span class="pager-title">${esc(ctx.next.title)}</span></a>` : ''}
    </nav>
  </article>
  ${toc(ctx)}
</main>`;
}

export function homeBody(ctx) {
  const card = (file) => {
    const c = ctx.cards[file];
    return `<li class="reveal"><a class="card" href="${c.href}">
      <span class="card-title">${esc(c.title)}</span>
      <span class="card-lead">${esc(clip(c.lead))}</span>
      <span class="card-go">${svgIcon.arrow}</span>
    </a></li>`;
  };
  const [start, make, help] = ctx.nav;
  return `<main class="home" id="content">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <h1 id="hero-title">Promo video skill</h1>
      <p class="hero-lead">${esc(ctx.lead)}</p>
      <div class="hero-cta">
        <a class="btn btn-primary" href="quick-start.html">Make your first video ${svgIcon.arrow}</a>
        <a class="btn btn-ghost" href="overview.html">What the skill does</a>
      </div>
    </div>
    <figure class="hero-media">
      <video src="assets/media/demo.mp4" poster="assets/media/dashboard.jpg" autoplay muted loop playsinline preload="metadata" aria-label="Example promo video for a sample product, Acme Cloud, without sound"></video>
      <figcaption>Example output: a 30-second video for a sample product, Acme Cloud, rendered from the skill's template.</figcaption>
    </figure>
  </section>

  <section class="frames" aria-labelledby="frames-title">
    <h2 id="frames-title">What a finished video looks like</h2>
    <p class="section-lead">Frames from the example above. Each frame is one scene from the skill's library, timed to the voiceover. The vertical cut adds burned-in captions.</p>
    <div class="frames-grid">
      <ul class="frames-strip">${FRAMES.map((f) => `<li class="reveal"><figure><img src="assets/media/${f.src}" alt="${esc(f.alt)}" width="1280" height="720" loading="lazy"><figcaption>${esc(f.scene)}</figcaption></figure></li>`).join('')}</ul>
      <figure class="frame-vertical reveal"><img src="assets/media/vertical.jpg" alt="Vertical 9:16 frame: Acme Cloud, Brings it all together, with a caption at the bottom" width="540" height="960" loading="lazy"><figcaption>Vertical cut, 9:16</figcaption></figure>
    </div>
  </section>

  <section class="pipeline reveal" aria-labelledby="pipeline-title">
    <div class="section-head">
      <h2 id="pipeline-title">The same stages, every time</h2>
    </div>
    <p class="section-lead">Claude does the research, writing, animation, and checking. It stops twice and waits for your decision. <a href="how-it-works.html">How a promo video gets made</a></p>
    <ol class="stages">
      ${ctx.pipeline.map((s, i) => {
        const inner = `<span class="stage-dot">${i + 1}</span><span class="stage-label">${esc(s.label)}</span>${s.you ? '<span class="stage-you">You approve</span>' : ''}`;
        return `<li class="stage${s.you ? ' is-you' : ''}" style="--i:${i}">${s.link ? `<a href="${s.link}">${inner}</a>` : inner}</li>`;
      }).join('')}
    </ol>
  </section>

  <section class="home-section" aria-labelledby="start-title">
    <div class="section-head"><h2 id="start-title">Where to start</h2></div>
    <p class="section-lead">New to the skill? Read these pages in order.</p>
    <ol class="cards cards-4">${start.pages.map((p) => card(p.file)).join('')}</ol>
  </section>

  <section class="home-section" aria-labelledby="make-title">
    <div class="section-head"><h2 id="make-title">${esc(make.title)}</h2></div>
    <ul class="cards cards-2">${make.pages.map((p) => card(p.file)).join('')}</ul>
  </section>

  <section class="home-section" aria-labelledby="help-title">
    <div class="section-head"><h2 id="help-title">${esc(help.title)}</h2></div>
    <ul class="cards cards-3">${help.pages.map((p) => card(p.file)).join('')}</ul>
  </section>
</main>`;
}
