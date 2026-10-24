// Interactive parts of the docs site: theme, navigation drawer, search,
// reading progress, "On this page" highlighting, copy buttons and reveals.
(() => {
  const doc = document.documentElement;
  const root = document.body.dataset.root || '';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js');

  // Theme
  document.querySelector('.theme-toggle')?.addEventListener('click', () => {
    const next = doc.dataset.theme === 'dark' ? 'light' : 'dark';
    doc.dataset.theme = next;
    try { localStorage.setItem('pv-theme', next); } catch (e) { /* storage unavailable */ }
  });

  // Navigation drawer (small screens, and the home page)
  const toggle = document.querySelector('.nav-toggle');
  const setNav = (open) => {
    document.body.classList.toggle('nav-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
  };
  toggle?.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  document.querySelector('[data-close-nav]')?.addEventListener('click', () => setNav(false));
  // Keep the current page visible in a long sidebar, without scrolling the page itself.
  const activeLink = document.querySelector('.sidebar a.is-active');
  const sideScroll = document.querySelector('.sidebar-inner');
  if (activeLink && sideScroll) {
    const offset = activeLink.offsetTop - sideScroll.offsetTop;
    if (offset > sideScroll.clientHeight * 0.7) sideScroll.scrollTop = offset - sideScroll.clientHeight / 2;
  }

  // Copy buttons on code blocks
  document.querySelectorAll('.code .copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const code = btn.closest('.code').querySelector('code').innerText;
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1600);
      } catch (e) { btn.textContent = 'Press Ctrl+C'; }
    });
  });

  // Reading progress and "On this page" highlighting
  const bar = document.querySelector('.progress span');
  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]:not(.toc-top)')];
  const targets = tocLinks.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const max = doc.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max) : 0);
    if (!targets.length) return;
    let current = targets[0];
    for (const t of targets) if (t.getBoundingClientRect().top < 140) current = t;
    if (innerHeight + scrollY >= doc.scrollHeight - 4) current = targets[targets.length - 1];
    tocLinks.forEach((a) => a.classList.toggle('is-active', a.hash === '#' + current.id));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Reveal cards as they scroll into view
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => {
      const siblings = [...el.parentElement.children];
      el.style.setProperty('--delay', `${Math.min(siblings.indexOf(el), 6) * 70}ms`);
      io.observe(el);
    });
  } else reveals.forEach((el) => el.classList.add('in'));

  // Hero parallax: the art leans gently towards the pointer
  const art = document.querySelector('.hero-art');
  if (art && !reduced && matchMedia('(pointer: fine)').matches) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      art.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      art.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    hero.addEventListener('pointerleave', () => { art.style.setProperty('--mx', 0); art.style.setProperty('--my', 0); });
  }

  // Search
  const box = document.querySelector('.search');
  const input = box.querySelector('input');
  const list = box.querySelector('.search-results');
  const empty = box.querySelector('.search-empty');
  let index = null;
  let results = [];
  let sel = 0;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const hl = (s, words) => words.reduce((acc, w) => acc.replace(new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>'), esc(s));

  async function load() {
    if (index) return index;
    try { index = await (await fetch(root + 'assets/search.json')).json(); } catch (e) { index = []; }
    return index;
  }
  function search(q) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    results = [];
    if (!words.length) return render(words);
    for (const p of index) {
      const page = `${p.t} ${p.d}`.toLowerCase();
      if (words.every((w) => page.includes(w))) results.push({ title: p.t, path: p.s, url: p.u, score: words.every((w) => p.t.toLowerCase().includes(w)) ? 3 : 1 });
      for (const [h, id] of p.h) {
        if (words.every((w) => h.toLowerCase().includes(w) || p.t.toLowerCase().includes(w)) && words.some((w) => h.toLowerCase().includes(w))) {
          results.push({ title: h, path: `${p.s} › ${p.t}`, url: `${p.u}#${id}`, score: 2 });
        }
      }
    }
    results.sort((a, b) => b.score - a.score);
    results = results.slice(0, 12);
    render(words);
  }
  function render(words) {
    sel = 0;
    list.innerHTML = results.map((r, i) => `<li><a role="option" href="${root}${r.url}" aria-selected="${i === 0}"><span class="r-title">${hl(r.title, words)}</span><span class="r-path">${esc(r.path)}</span></a></li>`).join('');
    empty.hidden = !(words.length && !results.length);
  }
  function move(d) {
    const items = list.querySelectorAll('a');
    if (!items.length) return;
    items[sel].setAttribute('aria-selected', 'false');
    sel = (sel + d + items.length) % items.length;
    items[sel].setAttribute('aria-selected', 'true');
    items[sel].scrollIntoView({ block: 'nearest' });
  }
  let lastFocus = null;
  async function open() {
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    input.focus();
    input.select();
    await load();
    if (input.value) search(input.value);
  }
  function close() {
    box.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus();
  }
  document.querySelector('.search-btn')?.addEventListener('click', open);
  box.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
  input.addEventListener('input', () => index && search(input.value));
  list.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { const a = list.querySelectorAll('a')[sel]; if (a) location.href = a.href; }
  });
  addEventListener('keydown', (e) => {
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName))) {
      e.preventDefault();
      box.hidden ? open() : close();
    } else if (e.key === 'Escape') {
      if (!box.hidden) close();
      else setNav(false);
    }
  });
})();
