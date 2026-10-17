// Builds the promo-video documentation site from the Markdown in ../docs.
// Usage: node build.mjs            -> writes site/dist
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';
import { NAV, SITE, PIPELINE } from './src/nav.mjs';
import { page, homeBody } from './src/template.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.resolve(HERE, '..', 'docs');
const OUT = path.resolve(HERE, 'dist');
const SRC = path.resolve(HERE, 'src');

// ── Helpers ──────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (s) => String(s).replace(/<[^>]+>/g, '');
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// Docs page path ("how-to/x.md") -> output path ("how-to/x.html"). README is the home page.
const outPath = (md) => (md === 'README.md' ? 'index.html' : md.replace(/\.md$/, '.html'));

// GitHub-style heading slugs, so #anchors written for GitHub keep working.
function slugger() {
  const seen = new Map();
  return (text) => {
    let s = decode(stripTags(text)).toLowerCase().trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
    const n = seen.get(s);
    seen.set(s, n === undefined ? 0 : n + 1);
    return n === undefined ? s : `${s}-${n + 1}`;
  };
}

const ICONS = {
  note: '<path d="M12 16v-4M12 8h.01"/><circle cx="12" cy="12" r="9"/>',
  tip: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2h5c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z"/>',
  important: '<path d="M12 3 3 20h18L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
  warning: '<path d="M12 3 3 20h18L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
  caution: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>',
};
const icon = (name) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

// ── Markdown rendering ───────────────────────────────────────────────────
function renderMarkdown(md, file) {
  const slug = slugger();
  const headings = [];
  const dir = path.posix.dirname(file);

  const marked = new Marked({ gfm: true });

  // Definition lists ("**Term**\n: definition"), used by the glossary.
  marked.use({
    extensions: [{
      name: 'deflist',
      level: 'block',
      start(src) { return src.match(/^\*\*[^\n]+\*\*\n:/m)?.index; },
      tokenizer(src) {
        const m = /^(?:\*\*[^\n]+\*\*\n: [^\n]+(?:\n(?!\n|\*\*)[^\n]+)*(?:\n\n|\n?$))+/.exec(src);
        if (!m) return;
        const items = [...m[0].matchAll(/\*\*([^\n]+)\*\*\n: ([^\n]+(?:\n(?!\n|\*\*)[^\n]+)*)/g)]
          .map(([, term, def]) => ({ term, def: this.lexer.inlineTokens(def) }));
        return { type: 'deflist', raw: m[0], items };
      },
      renderer(tok) {
        return '<dl class="deflist">' + tok.items.map(({ term, def }) => {
          const id = slug(term);
          headings.push({ depth: 3, id, text: term, glossary: true });
          return `<div class="def" id="${id}"><dt><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${esc(term)}</dt><dd>${this.parser.parseInline(def)}</dd></div>`;
        }).join('') + '</dl>\n';
      },
    }],
  });

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const id = slug(html);
        if (depth === 1) return ''; // the page header renders the title
        headings.push({ depth, id, text: decode(stripTags(html)) });
        const step = depth === 2 && /^Step (\d+):\s*(.*)$/.exec(html);
        const inner = step
          ? `<span class="step-num" aria-hidden="true">${step[1]}</span><span><span class="sr-only">Step ${step[1]}: </span>${step[2]}</span>`
          : html;
        return `<h${depth} id="${id}"${step ? ' class="step"' : ''}>${inner}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${depth}>\n`;
      },
      blockquote({ tokens }) {
        const body = this.parser.parse(tokens);
        const m = /^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i.exec(body);
        if (!m) return `<blockquote>${body}</blockquote>\n`;
        const kind = m[1].toLowerCase();
        let rest = body.slice(m[0].length);
        rest = rest.startsWith('</p>') ? rest.slice(4) : '<p>' + rest;
        return `<aside class="callout callout-${kind}"><div class="callout-title">${icon(kind)}<span>${kind[0].toUpperCase() + kind.slice(1)}</span></div><div class="callout-body">${rest}</div></aside>\n`;
      },
      code({ text, lang }) {
        const label = (lang || 'text').split(/\s/)[0];
        return `<figure class="code"><figcaption><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="lang">${esc(label)}</span><button class="copy" type="button" aria-label="Copy code">Copy</button></figcaption><pre><code class="language-${esc(label)}">${esc(text)}</code></pre></figure>\n`;
      },
      paragraph({ tokens }) {
        const html = this.parser.parseInline(tokens);
        const m = /^<strong>(Problem|Likely cause|Solution|Result):<\/strong>/.exec(html);
        if (m) return `<p class="label label-${m[1].toLowerCase().replace(/\s+/g, '-')}">${html}</p>\n`;
        return `<p>${html}</p>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        let url = href;
        const external = /^[a-z]+:/i.test(href);
        if (!external && !href.startsWith('#')) {
          // Relative link to another docs page: point it at the rendered page.
          const [p, hash = ''] = href.split('#');
          if (p.endsWith('.md')) {
            const target = path.posix.normalize(path.posix.join(dir, p));
            url = path.posix.relative(dir, outPath(target)) + (hash ? '#' + hash : '');
          }
        }
        const t = title ? ` title="${esc(title)}"` : '';
        const ext = external ? ' target="_blank" rel="noopener noreferrer" class="ext"' : '';
        return `<a href="${esc(url)}"${t}${ext}>${text}</a>`;
      },
    },
  });

  // Pull the title (first H1) and the first paragraph for cards and meta tags.
  const tokens = marked.lexer(md);
  const h1 = tokens.find((t) => t.type === 'heading' && t.depth === 1);
  const firstP = tokens.find((t) => t.type === 'paragraph');
  // Wrap tables so wide ones scroll on small screens.
  const html = marked.parser(tokens).replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
  return {
    html,
    headings,
    title: h1 ? h1.text : file,
    lead: firstP ? decode(stripTags(marked.parseInline(firstP.text))) : '',
    words: md.split(/\s+/).length,
  };
}

// ── Build ────────────────────────────────────────────────────────────────
async function build() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(path.join(OUT, 'assets'), { recursive: true });

  const order = NAV.flatMap((s) => s.pages);
  const pages = new Map();
  for (const file of ['README.md', ...order]) {
    const md = await fs.readFile(path.join(DOCS, file), 'utf8');
    pages.set(file, { file, md, ...renderMarkdown(md, file) });
  }

  // Warn about docs pages that exist but aren't in the navigation.
  const all = (await fs.readdir(DOCS, { recursive: true })).filter((f) => f.endsWith('.md')).map((f) => f.split(path.sep).join('/'));
  for (const f of all) if (!pages.has(f) && !SITE.exclude.includes(f)) console.warn(`! ${f} is not in src/nav.mjs and was skipped`);

  const searchIndex = [];
  for (const [file, p] of pages) {
    const out = outPath(file);
    const root = path.posix.relative(path.posix.dirname(out), '.') || '.';
    const i = order.indexOf(file);
    const ctx = {
      file, out, root: root === '.' ? '' : root + '/',
      title: p.title, lead: p.lead, headings: p.headings,
      minutes: Math.max(1, Math.round(p.words / 220)),
      section: NAV.find((s) => s.pages.includes(file))?.title,
      prev: i > 0 ? { href: outPath(order[i - 1]), title: pages.get(order[i - 1]).title } : null,
      next: i >= 0 && i < order.length - 1 ? { href: outPath(order[i + 1]), title: pages.get(order[i + 1]).title } : null,
      nav: NAV.map((s) => ({ ...s, pages: s.pages.map((f) => ({ file: f, href: outPath(f), title: pages.get(f).title })) })),
    };
    let body = p.html;
    if (file === 'README.md') {
      const cards = Object.fromEntries([...pages].map(([f, q]) => [f, { href: outPath(f), title: q.title, lead: q.lead }]));
      body = homeBody({ ...ctx, cards, pipeline: PIPELINE });
    }
    await fs.mkdir(path.join(OUT, path.dirname(out)), { recursive: true });
    await fs.writeFile(path.join(OUT, out), page({ ...ctx, body, home: file === 'README.md' }));

    // Keep the Markdown source next to each page, for readers and AI tools.
    await fs.mkdir(path.join(OUT, path.dirname(file)), { recursive: true });
    await fs.writeFile(path.join(OUT, file), p.md);

    searchIndex.push({
      t: p.title, u: out, s: ctx.section || 'Home', d: p.lead,
      h: p.headings.filter((h) => h.depth <= 3).map((h) => [h.text, h.id]),
    });
  }

  // llms.txt: a plain index of the docs for AI tools (https://llmstxt.org).
  const llms = [`# ${SITE.name}`, '', `> ${pages.get('README.md').lead}`, '',
    ...NAV.flatMap((s) => [`## ${s.title}`, '', ...s.pages.map((f) => `- [${pages.get(f).title}](${f}): ${pages.get(f).lead}`), ''])].join('\n');
  await fs.writeFile(path.join(OUT, 'llms.txt'), llms);

  await fs.writeFile(path.join(OUT, 'assets', 'search.json'), JSON.stringify(searchIndex));
  for (const f of ['styles.css', 'site.js', 'favicon.svg']) await fs.copyFile(path.join(SRC, f), path.join(OUT, 'assets', f));
  await fs.writeFile(path.join(OUT, '.nojekyll'), '');

  console.log(`Built ${pages.size} pages into ${path.relative(process.cwd(), OUT) || OUT}`);
}

export { build };
if (process.argv[1] === fileURLToPath(import.meta.url)) await build();
