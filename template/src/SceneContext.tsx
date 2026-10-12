import { createContext, useContext } from 'react';
import { useVideoConfig } from 'remotion';
import type { CutTimings } from './timings';

export interface SceneTiming {
  /** Absolute second at which this scene's <Sequence> starts (frame 0 inside the scene). */
  fromSec: number;
  /** Length of the scene's <Sequence> in frames. */
  duration: number;
  sectionIds: string[];
  timings: CutTimings;
  props: Record<string, unknown>;
}

const Ctx = createContext<SceneTiming | null>(null);
export const SceneProvider = Ctx.Provider;

const clean = (w: string) => w.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9'-]/g, '');
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Voice-driven timing inside a scene. Every lookup returns a frame relative to the scene's own
 * frame 0, or null when that section / word is not spoken in this cut — scenes are shared by
 * several cuts and simply skip the beats a shorter cut does not have.
 */
export const useScene = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useScene() used outside a scene');
  const { fps } = useVideoConfig();
  const toFrame = (sec: number) => Math.round((sec - ctx.fromSec) * fps);
  const has = (id: string) => ctx.sectionIds.includes(id);

  const word = (re: RegExp, sectionId?: string, after = -Infinity): number | null => {
    const hit = ctx.timings.words.find(
      (w) => has(w.section) && (!sectionId || w.section === sectionId) && re.test(clean(w.text)) && toFrame(w.start) > after,
    );
    return hit ? toFrame(hit.start) : null;
  };

  /**
   * A cue written in script.ts props: "repair" (first word starting with "repair" in this scene),
   * "cycle/repair" (only in section "cycle"), "repair#2" (second occurrence), "@cycle" (start of
   * section "cycle"). Returns null when the cue is absent or not spoken.
   */
  const cue = (spec: unknown): number | null => {
    if (typeof spec !== 'string' || !spec) return null;
    if (spec.startsWith('@')) {
      const id = spec.slice(1);
      return has(id) ? toFrame(ctx.timings.sections[id].start) : null;
    }
    const [scoped, nthRaw] = spec.split('#');
    const [sectionId, w] = scoped.includes('/') ? scoped.split('/') : [undefined, scoped];
    const re = new RegExp(`^${escape(clean(w))}`);
    let at: number | null = -Infinity;
    for (let n = Math.max(1, Number(nthRaw) || 1); n > 0 && at !== null; n--) at = word(re, sectionId, at);
    return at;
  };

  return {
    props: ctx.props,
    duration: ctx.duration,
    sectionIds: ctx.sectionIds,
    has,
    /** First frame of a section's speech. */
    beat: (id: string): number | null => (has(id) ? toFrame(ctx.timings.sections[id].start) : null),
    /** Last frame of a section's speech. */
    beatEnd: (id: string): number | null => (has(id) ? toFrame(ctx.timings.sections[id].end) : null),
    /** Last frame of speech in this scene. */
    speechEnd: (): number => toFrame(Math.max(...ctx.sectionIds.map((id) => ctx.timings.sections[id].end))),
    word,
    cue,
  };
};

/** `frame ?? fallback`, for beats that may be missing from a cut. */
export const or = (frame: number | null, fallback: number) => (frame === null ? fallback : frame);
