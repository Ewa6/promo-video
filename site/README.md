# Documentation site

A static site built from the Markdown in [`../docs`](../docs). The Markdown stays the source of truth: the site only restyles it.

## Preview locally

You need Node.js 20 or later.

```bash
cd site
npm install
npm run dev        # builds, serves http://127.0.0.1:4517/ and rebuilds when docs/ changes
```

To use another port: `node serve.mjs 5000 --watch`.

## Build

```bash
npm run build      # writes site/dist
```

`site/dist` is plain HTML, CSS and JavaScript. Any static host can serve it, for example GitHub Pages.

## What's where

| File | What it does |
|---|---|
| `src/nav.mjs` | The sidebar sections and page order, and the stages shown on the home page. Add new pages here. |
| `src/template.mjs` | The page layout, the home page and the animated hero. |
| `src/styles.css` | The theme. Colors are the portfolio palette (primary `#4464AD`, secondary `#5944AD`, highlight `#4498AD`). |
| `src/site.js` | Theme switch, search (Ctrl K or /), reading progress, "On this page", copy buttons. |
| `build.mjs` | Turns each page in `docs/` into HTML. Keeps the `.md` next to it and writes `llms.txt` for AI tools. |

## Markdown features

The site renders GitHub-flavored Markdown, plus:

- `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]` and `> [!CAUTION]` callouts;
- `## Step 1: ...` headings, shown with a numbered badge;
- `**Problem:**`, `**Likely cause:**`, `**Solution:**` and `**Result:**` paragraphs, shown with labels;
- `**Term**` followed by `: definition` lines, shown as a glossary.

Animations stop when the reader's system asks for reduced motion.
