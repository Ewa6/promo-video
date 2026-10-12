/**
 * Scene catalogue: every scene id the script may use, what it shows and the props it needs.
 * `npm run check` validates src/script.ts against this. Plain data (imported by Node scripts):
 * keep it free of JSX and React imports. Full prop docs: the skill's references/scenes.md.
 *
 * Library scenes (library: true) are generic connective tissue. Product-specific scenes live in
 * src/scenes/custom/, are registered in src/scenes/index.ts and get an entry here with
 * library: false, e.g.
 *   offshore: { about: 'Platform at dawn, world opener.', required: [], library: false },
 * A hero-length cut needs at least three of them (npm run check); see references/custom-scenes.md.
 */
export const CATALOG = {
  title: { about: 'Kinetic headline lines, each revealed on a spoken cue.', required: ['lines'], library: true },
  problem: { about: 'The messy "before": spreadsheets, emails, notes, chats pile up, then blow away.', required: ['items'], library: true },
  reveal: { about: 'Clutter converges to a point that opens onto the logo and a subtitle.', required: [], library: true },
  steps: { about: 'A process as a ring or a row of steps lighting up on cues, optional hub.', required: ['steps'], library: true },
  features: { about: 'Grid of feature cards (icon, title, sub) popping in on cues.', required: ['items'], library: true },
  stats: { about: 'Count-up gauges for 1–3 numbers, with a mandatory source line.', required: ['items', 'source'], library: true },
  screen: { about: 'App window: real screenshot with pan/zoom + callouts, or a mock list/table.', required: [], library: true },
  roles: { about: 'People/roles each receiving their own task card.', required: ['people'], library: true },
  device: { about: 'Phone/tablet doing field work, data syncing to the cloud.', required: [], library: true },
  dashboard: { about: 'Question → live dashboard (KPIs, bars, donut), cursor drill-down. Illustrative data.', required: [], library: true },
  quote: { about: 'One big line: a question, a customer quote or a promise.', required: ['text'], library: true },
  tagline: { about: 'Two-line tagline, second line on a cue, with an animated tick.', required: ['line1'], library: true },
  logo: { about: 'Colour logo on paper with a line under it, optional URL.', required: [], library: true },
  endcard: { about: 'White logo, stacked closing lines and a call to action.', required: [], library: true },
} as const;

export type SceneId = keyof typeof CATALOG;
export const SCENE_IDS = Object.keys(CATALOG) as SceneId[];
