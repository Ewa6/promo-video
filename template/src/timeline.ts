/**
 * Lays one voice take out on the video timeline. The take is recorded in one piece (one
 * continuous read sounds natural); where the script asks for room (`hold`, `holdAfter`,
 * `minSeconds` in src/script.ts) the take is split in the pause after that word and everything
 * later moves on by that much. Without holds the take plays straight through, exactly as recorded.
 *
 * Pure and type-only imports: the Node scripts (qa, check) use it too.
 */
import type { Section } from './script';
import type { CutTimings } from './timings';

/** Pictures change slightly before the voice, which reads as "on the beat". */
export const LEAD_SECONDS = 0.25;

export interface SceneGroup {
  scene: Section['scene'];
  sections: Section[];
}

/** Consecutive sections of one scene play inside one scene component (unless `break`). */
export const groupSections = (sections: Section[]): SceneGroup[] =>
  sections.reduce<SceneGroup[]>((groups, s) => {
    const last = groups[groups.length - 1];
    if (last && last.scene === s.scene && !s.break) last.sections.push(s);
    else groups.push({ scene: s.scene, sections: [s] });
    return groups;
  }, []);

/** A piece of the take: audio seconds [from, to) played from video second `at`. */
export interface AudioSegment {
  from: number;
  to: number;
  at: number;
}

export interface Timeline {
  /** The sync timings moved onto the video timeline (`duration` = voice + all holds). */
  timings: CutTimings;
  segments: AudioSegment[];
  /** Seconds of silence inserted, by where: "unlock" (after the section) or "unlock/joins". */
  holds: Record<string, number>;
}

const seconds = (x: unknown): number => (typeof x === 'number' && Number.isFinite(x) && x > 0 ? x : 0);
const clean = (w: string) => w.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9'-]/g, '');

/**
 * Index into `words` of a `holdAfter` key inside one section: "joins" (first word starting with
 * "joins"), "it#2" (second occurrence) — the cue syntax, scoped to the section. -1 if not spoken.
 */
export const wordInSection = (words: { text: string; section: string }[], sectionId: string, spec: string): number => {
  const [w, nthRaw] = spec.split('#');
  const prefix = clean(w);
  let n = Math.max(1, Number(nthRaw) || 1);
  return words.findIndex((x) => x.section === sectionId && clean(x.text).startsWith(prefix) && --n === 0);
};

/**
 * Where the take may be split between two words: the middle of the pause (`sync` found them with
 * silencedetect) that best covers the gap whisper reports — its word edges can be ~0.1–0.5 s off —
 * else the middle of that gap.
 */
const cutPoint = (end: number, next: number, silences: [number, number][] = []): number => {
  const lo = Math.min(end, next) - 0.3;
  const hi = Math.max(end, next) + 0.3;
  let best: { overlap: number; at: number } | null = null;
  for (const [a, b] of silences) {
    const overlap = Math.min(hi, b) - Math.max(lo, a);
    if (overlap > 0 && (!best || overlap > best.overlap)) best = { overlap, at: (Math.max(lo, a) + Math.min(hi, b)) / 2 };
  }
  return best ? best.at : (end + next) / 2;
};

export const buildTimeline = (sections: Section[], raw: CutTimings, tail: number): Timeline => {
  const words = raw.words;
  const firstWord = (id: string) => words.findIndex((w) => w.section === id);
  const lastWord = (id: string) => words.map((w) => w.section).lastIndexOf(id);
  // seconds of silence after word i, and what asked for it
  const extra = new Array<number>(words.length).fill(0);
  const label = new Map<number, string>();
  const add = (i: number, s: number, why: string) => {
    if (i < 0 || !s) return;
    extra[i] += s;
    if (!label.has(i)) label.set(i, why);
  };
  for (const s of sections) {
    for (const [spec, sec] of Object.entries(s.holdAfter ?? {})) add(wordInSection(words, s.id, spec), seconds(sec), `${s.id}/${spec}`);
    add(lastWord(s.id), seconds(s.hold), s.id);
  }
  const shiftBefore = (i: number) => (i <= 0 ? 0 : extra.slice(0, i).reduce((a, b) => a + b, 0));

  // minSeconds: grow the hold after a scene's last word until the scene is long enough
  const groups = groupSections(sections);
  const startOf = (gi: number) => {
    if (gi === 0) return 0;
    const i = firstWord(groups[gi].sections[0].id);
    return words[i].start + shiftBefore(i) - LEAD_SECONDS;
  };
  groups.forEach((g, gi) => {
    const want = Math.max(...g.sections.map((s) => seconds(s.minSeconds)));
    if (!want) return;
    const until = gi + 1 < groups.length ? startOf(gi + 1) : raw.duration + shiftBefore(words.length) + tail;
    const last = g.sections[g.sections.length - 1].id;
    add(lastWord(last), Math.max(0, want - (until - startOf(gi))), last);
  });

  const holds: Record<string, number> = {};
  const segments: AudioSegment[] = [];
  let from = 0;
  let shift = 0;
  extra.forEach((s, i) => {
    if (!s) return;
    holds[label.get(i)!] = Math.round(s * 1000) / 1000;
    if (i + 1 < words.length) {
      const to = cutPoint(words[i].end, words[i + 1].start, raw.silences);
      segments.push({ from, to, at: from + shift });
      from = to;
      shift += s;
    }
  });
  segments.push({ from, to: raw.duration, at: from + shift });

  const timings: CutTimings = {
    ...raw,
    duration: raw.duration + shiftBefore(words.length),
    sections: Object.fromEntries(
      Object.entries(raw.sections).map(([id, t]) => [id, { start: t.start + shiftBefore(firstWord(id)), end: t.end + shiftBefore(lastWord(id)) }]),
    ),
    words: words.map((w, i) => ({ ...w, start: w.start + shiftBefore(i), end: w.end + shiftBefore(i) })),
  };
  return { timings, segments, holds };
};
