// Lints the edit before any voice is recorded or frame rendered: npm run check [-- cut…]
//
//  ✗ errors   unknown scenes, missing required props, cues that are never spoken, missing assets,
//             duplicate section ids, numbers on screen without a source
//  ⚠ warnings length vs target, digits in the voice text, ALL-CAPS acronyms ElevenLabs may spell
//             out, stale timings
// Exit code 1 when there are errors.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CATALOG } from '../src/scenes/catalog.ts';
import { wordInSection } from '../src/timeline.ts';
import { CUTS, PUBLIC, ROOT, estimateSeconds, normalize, parseCutsArg, spokenText } from './lib.mjs';

let errors = 0;
let warnings = 0;
const err = (cut, msg) => {
  errors++;
  console.log(`  ✗ [${cut}] ${msg}`);
};
const warn = (cut, msg) => {
  warnings++;
  console.log(`  ⚠ [${cut}] ${msg}`);
};

/** Every cue string inside a props object (keys `cue` or ending in `Cue`), with its path. */
const collectCues = (obj, path = 'props') => {
  const out = [];
  if (Array.isArray(obj)) obj.forEach((v, i) => out.push(...collectCues(v, `${path}[${i}]`)));
  else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if ((k === 'cue' || k.endsWith('Cue')) && typeof v === 'string') out.push({ path: `${path}.${k}`, cue: v });
      else out.push(...collectCues(v, `${path}.${k}`));
    }
  }
  return out;
};

/** Asset paths (relative to public/) referenced by props: keys `src`. */
const collectSrc = (obj) => {
  const out = [];
  if (Array.isArray(obj)) obj.forEach((v) => out.push(...collectSrc(v)));
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) (k === 'src' && typeof v === 'string' ? out.push(v) : out.push(...collectSrc(v)));
  return out;
};

const cleanWord = (w) => w.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9'-]/g, '');

/** Same semantics as useScene().cue in src/SceneContext.tsx. */
const cueSpoken = (spec, group) => {
  if (spec.startsWith('@')) return group.some((s) => s.id === spec.slice(1));
  const [scoped, nthRaw] = spec.split('#');
  const [sectionId, w] = scoped.includes('/') ? scoped.split('/') : [undefined, scoped];
  const prefix = cleanWord(w);
  const words = group.filter((s) => !sectionId || s.id === sectionId).flatMap((s) => spokenText(s.text).split(' ').map(cleanWord));
  return words.filter((x) => x.startsWith(prefix)).length >= Math.max(1, Number(nthRaw) || 1);
};

// brand assets
const brandSrc = readFileSync(join(ROOT, 'src', 'brand.ts'), 'utf8');
for (const m of brandSrc.matchAll(/['"]((?:brand|screens|footage|music)\/[^'"]+)['"]/g)) {
  if (!existsSync(join(PUBLIC, m[1]))) err('brand', `src/brand.ts references public/${m[1]}, which does not exist`);
}
if (/name: 'Acme Cloud'/.test(brandSrc)) warn('brand', 'src/brand.ts still has the template placeholder brand (Acme Cloud)');

const ACRONYM_OK = new Set(['OK', 'TV', 'AI', 'UK', 'US', 'EU', 'API', 'CEO', 'PDF', 'SQL', 'GPS', 'CRM', 'ERP', 'KPI', 'ROI', 'SaaS', 'IT', 'HR', 'QA']);

const comps = Object.entries(CUTS).map(([id, c]) => [id, c.composition]);
for (const [id, comp] of comps) {
  if (!/^[A-Za-z0-9-]+$/.test(comp ?? '')) err(id, `composition "${comp}" must be letters, digits and hyphens only (Remotion id)`);
  if (comps.filter(([, x]) => x === comp).length > 1) err(id, `composition "${comp}" is used by more than one cut`);
}

for (const cut of parseCutsArg()) {
  const c = CUTS[cut];
  console.log(`\n${cut} — ${c.title} (${c.format}, captions ${c.captions ? 'on' : 'off'})`);
  const ids = new Set();
  if (!c.sections.length) err(cut, 'no sections');
  if (c.voiceFrom) {
    const src = CUTS[c.voiceFrom];
    if (!src) err(cut, `voiceFrom "${c.voiceFrom}" is not a cut`);
    else if (src.sections.map((s) => s.text).join('|') !== c.sections.map((s) => s.text).join('|')) err(cut, `voiceFrom "${c.voiceFrom}" but the words differ — it needs its own recording`);
  }
  if (c.sections[0] && !c.sections[0].para) warn(cut, `first section "${c.sections[0].id}" should have para: true`);

  // group consecutive sections into scenes, as PromoCut does
  const groups = [];
  for (const s of c.sections) {
    if (ids.has(s.id)) err(cut, `duplicate section id "${s.id}"`);
    ids.add(s.id);
    const last = groups[groups.length - 1];
    if (last && last.scene === s.scene && !s.break) last.sections.push(s);
    else groups.push({ scene: s.scene, sections: [s] });
  }

  for (const g of groups) {
    const label = `${g.scene} (${g.sections.map((s) => s.id).join(', ')})`;
    const entry = CATALOG[g.scene];
    if (!entry) {
      err(cut, `${label}: unknown scene "${g.scene}" — known: ${Object.keys(CATALOG).join(', ')}`);
      continue;
    }
    const props = Object.assign({}, ...g.sections.map((s) => s.props ?? {}));
    // consecutive sections of one scene merge their props: the same key twice is almost always a
    // second, separate shot that needs `break: true`
    const seen = {};
    for (const s of g.sections) {
      for (const k of Object.keys(s.props ?? {})) {
        if (seen[k] && JSON.stringify(seen[k].v) !== JSON.stringify(s.props[k])) {
          err(cut, `${label}: sections "${seen[k].id}" and "${s.id}" both set "${k}" — they merge into ONE scene and the later wins. Add break: true to "${s.id}" for a separate shot.`);
        }
        seen[k] = { id: s.id, v: s.props[k] };
      }
    }
    for (const r of entry.required) if (props[r] === undefined) err(cut, `${label}: missing required prop "${r}"`);
    for (const { path, cue } of collectCues(props)) {
      if (!cueSpoken(cue, g.sections)) err(cut, `${label}: ${path} = "${cue}" is never spoken in this scene`);
    }
    for (const src of collectSrc(props)) if (!existsSync(join(PUBLIC, src))) err(cut, `${label}: public/${src} does not exist`);
    if (g.scene === 'title' && Array.isArray(props.lines) && props.lines[0]?.cue) {
      warn(cut, `${label}: the first title line waits for cue "${props.lines[0].cue}" — the screen is empty until then; drop that cue`);
    }
    if (g.scene === 'stats' && (!props.source || /missing|todo|tbd/i.test(String(props.source)))) err(cut, `${label}: stats need a real "source" line`);
  }

  for (const s of c.sections) {
    const spoken = spokenText(s.text);
    if (/\d/.test(spoken)) warn(cut, `section "${s.id}": digits in the voice text ("${spoken.match(/\S*\d\S*/)[0]}") — write numbers as words so the voice, alignment and captions agree`);
    // short all-caps tokens (not parts of hyphenated emphasis like SEVENTY-FIVE) read like acronyms
    for (const m of spoken.matchAll(/(?<![A-Za-z-])[A-Z]{2,4}s?(?![A-Za-z-])/g)) {
      if (!ACRONYM_OK.has(m[0].replace(/s$/, ''))) {
        warn(cut, `section "${s.id}": "${m[0]}" in capitals — v4 may spell it out letter by letter. If it is said as a word, write it in title case (e.g. "Kora" for KORA) and map it back via BRAND.captionReplace`);
      }
    }
    if (/\[(?![^\]]*\])/.test(s.text) || /<[^>]+>/.test(s.text)) err(cut, `section "${s.id}": unbalanced [tag] or SSML-like <tag> (v4 has no SSML)`);
    if (!normalize(spoken)) err(cut, `section "${s.id}": no spoken words`);
    const holds = [['hold', s.hold], ['minSeconds', s.minSeconds], ...Object.entries(s.holdAfter ?? {}).map(([w, v]) => [`holdAfter.${w}`, v])];
    for (const [k, v] of holds) {
      if (v !== undefined && !(typeof v === 'number' && v >= 0)) err(cut, `section "${s.id}": ${k} must be a number of seconds ≥ 0`);
      else if (k !== 'minSeconds' && v > 2.5) warn(cut, `section "${s.id}": ${k} ${v} s is a long silence — the voice stops that long; shorten it or add words`);
    }
    const sectionWords = spokenText(s.text).split(' ').filter((w) => normalize(w)).map((text) => ({ text, section: s.id }));
    for (const w of Object.keys(s.holdAfter ?? {})) {
      if (wordInSection(sectionWords, s.id, w) < 0) err(cut, `section "${s.id}": holdAfter "${w}" is not spoken in this section`);
      else if (wordInSection(sectionWords, s.id, w) === sectionWords.length - 1) warn(cut, `section "${s.id}": holdAfter "${w}" is its last word — use hold instead`);
    }
  }

  // the finished film is voice + tail; a 30 s slot means ~27–28 s of voice
  // custom (product-specific) scenes: the part of the film that can't appear in anyone else's video
  // (a `screen` showing a real screenshot of the product counts as specific too)
  const custom = [
    ...new Set([
      ...c.sections.map((s) => s.scene).filter((id) => CATALOG[id] && CATALOG[id].library !== true),
      ...c.sections.filter((s) => s.scene === 'screen' && typeof s.props?.src === 'string').map((s) => `screen:${s.props.src}`),
    ]),
  ];
  const long = estimateSeconds(cut) + c.tail >= 45;
  console.log(`  · custom scenes: ${custom.length ? custom.join(', ') : 'none'}`);
  if (long && custom.length < 3 && !c.allowGeneric) {
    err(cut, `only ${custom.length} custom scene(s) — a hero needs a world opener and ≥2 product screens built for this product (references/custom-scenes.md). Library scenes alone make a generic film.`);
  } else if (!long && custom.length === 0 && !c.allowGeneric && estimateSeconds(cut) + c.tail >= 20) {
    warn(cut, 'no custom scenes — reuse at least one product screen from the hero');
  }

  const holds = c.sections.reduce((a, s) => a + [s.hold, ...Object.values(s.holdAfter ?? {})].reduce((x, v) => x + (v > 0 ? v : 0), 0), 0);
  const est = estimateSeconds(cut) + holds + c.tail;
  const target = Number((c.title.match(/~?\s*(\d+)\s*(s|sec|seconds?)\b/i) ?? [])[1]);
  console.log(`  · ~${Math.round(est)} s estimated incl. ${holds ? `${holds} s holds + ` : ''}${c.tail} s tail${target ? ` (target ${target} s)` : ''}, ${spokenText(c.sections.map((s) => s.text).join(' ')).split(' ').length} words`);
  if (target && (est > target * 1.1 || est < target * 0.75)) warn(cut, `estimated ${Math.round(est)} s vs target ${target} s — trim or extend the script`);

  const tPath = join(ROOT, 'src', 'timings', `${cut}.json`);
  if (!existsSync(tPath)) warn(cut, 'not synced yet (npm run sync -- ' + cut + ')');
  else {
    const t = JSON.parse(readFileSync(tPath, 'utf8'));
    const missing = c.sections.filter((s) => !t.sections[s.id]).map((s) => s.id);
    const scriptWords = c.sections.flatMap((s) => spokenText(s.text).split(' ').filter((w) => normalize(w)).map((w) => w));
    if (missing.length || t.words.length !== scriptWords.length || t.words.some((w, i) => w.text !== scriptWords[i])) {
      warn(cut, `timings are stale (script changed since the last sync) — re-record/re-guide, then npm run sync -- ${cut}`);
    } else console.log(`  · timings: ${t.source}${t.aligned !== null && t.aligned !== undefined ? `, ${Math.round(t.aligned * 100)}% aligned` : ''}, ${t.duration}s voice${t.audio ? ` (${t.audio})` : ' (silent)'}`);
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
