/**
 * Single source of truth for the voiceover and the edit.
 *
 * Each cut is a list of sections. A section is one spoken beat, written exactly as it is pasted
 * into ElevenLabs v4 (inline [audio tags] included). Consecutive sections that share a `scene`
 * play inside one scene component; `props` configure that scene (see the scene catalogue in the
 * skill's references/scenes.md, or src/scenes/catalog.ts).
 *
 *   npm run script -- <cut>     prints the ElevenLabs-ready text
 *   npm run sync -- <cut>       re-times the video to public/voiceover/<cut>.mp3
 *
 * Imported by the Node scripts too, so keep it to erasable TypeScript (no enums, no JSX).
 */
import type { SceneId } from './scenes/catalog';

export type Format = 'landscape' | 'portrait' | 'square';

export interface Section {
  id: string;
  scene: SceneId;
  text: string;
  /** Starts a new paragraph in the ElevenLabs text (otherwise joined with a space). */
  para?: boolean;
  /** Scene configuration; merged across consecutive sections of the same scene. */
  props?: Record<string, unknown>;
  /** Start a fresh instance of the scene even though the previous section uses the same scene. */
  break?: boolean;
  /**
   * Seconds of silence after this section's speech, so its picture can finish before the voice
   * goes on. The take is split in the pause after the section; no re-recording, no re-sync.
   */
  hold?: number;
  /**
   * Silence after a word inside this section, e.g. { joins: 0.7 } — for a beat in the middle of a
   * line (usually at a [short pause]). Keys use the cue syntax: "joins", "it#2".
   */
  holdAfter?: Record<string, number>;
  /**
   * Minimum length of the scene this section belongs to, in seconds. When the voice moves on
   * sooner, silence is added after the scene's last section. Survives a new take, unlike `hold`.
   */
  minSeconds?: number;
}

export interface Cut {
  /** Remotion composition id and output file stem, e.g. 'Hero' → out/<slug>-hero.mp4 */
  composition: string;
  title: string;
  format: Format;
  /** Seconds the last scene holds after the voice ends. */
  tail: number;
  /** Burn word-by-word captions in (for muted autoplay on social). */
  captions: boolean;
  /** Reuse another cut's voice recording (same words, other format), e.g. 'cut15' for cut15v. */
  voiceFrom?: string;
  /** Skip the custom-scene minimum (e.g. an API product with no UI). Say why in brief.md. */
  allowGeneric?: boolean;
  sections: Section[];
}

/** ElevenLabs settings, printed by `npm run script` for generating takes (elevenlabs.io or a connector). */
export const VOICE = {
  model: 'eleven_v4',
  /** Voice ID from ElevenLabs (Voices → ⋯ → Copy voice ID). */
  voiceId: '',
  voiceName: '',
  stability: 0.5,
  similarity: 0.75,
  /** Fix once a take is liked, so re-generated lines keep the same read. */
  seed: null as number | null,
};

/** Output file stem: out/<SLUG>-<cut>.mp4 */
export const SLUG = 'promo';

export const CUTS: Record<string, Cut> = {
  hero: {
    composition: 'Hero',
    title: 'Demo',
    format: 'landscape',
    tail: 2,
    captions: false,
    allowGeneric: true,
    sections: [
      { id: 'hook', scene: 'title', para: true, text: 'What if every project update lived in one place?',
        props: { lines: [{ text: 'Every update.' }, { text: 'One place.', cue: 'lived', accent: ['one'] }] } },
      { id: 'mess', scene: 'problem', para: true, text: 'Today it hides in spreadsheets, emails, notes and chats.',
        props: { items: [
          { kind: 'sheet', text: 'status_FINAL_v3.xlsx', cue: 'spreadsheets' }, { kind: 'email', text: 'RE: RE: where are we?', cue: 'emails' },
          { kind: 'note', text: 'Ask Sam about the deadline', cue: 'notes' }, { kind: 'chat', text: 'who has the latest file?', cue: 'chats' },
          { kind: 'sheet', text: 'budget_q3_copy.xlsx' }, { kind: 'email', text: 'Fwd: client feedback' } ] } },
      { id: 'reveal', scene: 'reveal', para: true, text: 'Acme Cloud brings it all together.', props: { subtitle: 'Brings it all together', accent: ['together'] } },
      { id: 'inbox', scene: 'screen', para: true, text: 'Every task shows up in your own inbox, exactly when it is yours.',
        props: { heading: 'My inbox', active: 'Projects', rows: [
          { title: 'Approve launch plan', meta: 'Due Thu · Marketing', status: 'New', statusColor: 'accent', cue: 'task' },
          { title: 'Review budget Q3', meta: 'Due Fri · Finance', status: 'In review', statusColor: 'warn', cue: 'inbox' },
          { title: 'Sign off homepage copy', meta: 'Due Mon · Web', status: 'Done', statusColor: 'good', cue: 'yours' } ], clickCue: 'exactly', clickRow: 0 } },
      { id: 'flow', scene: 'steps', para: true, text: 'Plan, assign, review and ship in one flow.',
        props: { steps: [ { label: 'Plan', icon: 'checklist', cue: 'plan' }, { label: 'Assign', icon: 'users', cue: 'assign' }, { label: 'Review', icon: 'eye', cue: 'review' }, { label: 'Ship', icon: 'rocket', cue: 'ship' } ], hub: 'One flow', hubCue: 'flow' } },
      { id: 'ask', scene: 'dashboard', para: true, text: 'How are we doing right now?', props: { question: 'How are we doing right now?', questionAccent: ['right', 'now?'], heading: 'Project dashboard', active: 'Dashboards',
          kpis: [ { label: 'Open tasks', value: 42 }, { label: 'Due this week', value: 9, tone: 'warn' }, { label: 'Done', value: 128, tone: 'good' } ],
          bars: [ { label: 'Web', value: 12 }, { label: 'Ads', value: 8 }, { label: 'Events', value: 5 }, { label: 'PR', value: 9 } ], barsTitle: 'Open tasks by team',
          donut: [ { label: 'On track', value: 30, tone: 'good' }, { label: 'At risk', value: 9, tone: 'warn' }, { label: 'Late', value: 3, tone: 'bad' } ], donutTitle: 'Status' } },
      { id: 'answer', scene: 'dashboard', text: 'The answer is live, for the whole team.' },
      { id: 'logo', scene: 'endcard', para: true, text: 'Acme Cloud. Work, simplified.',
        props: { lines: [{ text: 'Work,' }, { text: 'simplified.', cue: 'simplified', strong: true }], cta: 'Book a demo · acme.example' } },
    ],
  },
  vertical: {
    composition: 'Vertical',
    title: 'Demo vertical',
    format: 'portrait',
    tail: 2,
    captions: true,
    allowGeneric: true,
    sections: [
      { id: 'hook', scene: 'title', para: true, text: 'Every update. One place.', props: { lines: [{ text: 'Every update.' }, { text: 'One place.', cue: 'one', accent: ['one'] }] } },
      { id: 'reveal', scene: 'reveal', para: true, text: 'Acme Cloud brings it all together.', props: { subtitle: 'Brings it all together', accent: ['together'] } },
    ],
  },
};
export type CutId = keyof typeof CUTS & string;
export const CUT_IDS = Object.keys(CUTS) as CutId[];

/** Strips [audio tags] and collapses whitespace: what is actually spoken. */
export const spokenText = (text: string): string =>
  text.replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();

/** The text to paste into ElevenLabs v4: tags kept, paragraphs separated by a blank line. */
export const elevenLabsText = (cut: CutId): string =>
  CUTS[cut].sections
    .map((s, i) => (i === 0 ? '' : s.para ? '\n\n' : ' ') + s.text)
    .join('');
