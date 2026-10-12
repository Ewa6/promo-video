# Scene catalogue

A section's `scene` picks the component; consecutive sections with the same scene play inside
**one** scene and their `props` are merged (that's how a scene gets several beats). For a
*separate shot* of the same scene type right after (e.g. two different `screen` screenshots), set
`break: true` on the second section — `npm run check` errors when merged sections set the same
prop differently.

Merging is **shallow** (`Object.assign`): a later section's `items` *replaces* the earlier
`items`, it doesn't append. Put a scene's list props (`items`, `steps`, `people`, `rows`, `fields`)
once, in its **first** section; cues inside them are matched against the words of *all* the
scene's sections, so a card can still appear on a word from a later section. Every scene works in landscape, portrait and square,
and keeps clear of burned-in captions automatically.

## Cues — making the picture move on the voice

Any prop called `cue` or ending in `Cue` is a **spoken cue**: the element appears when that word
is said.

| Cue | Means |
|---|---|
| `"repair"` | first word in this scene starting with "repair" (case-insensitive, punctuation ignored) |
| `"cycle/repair"` | …only within section `cycle` |
| `"repair#2"` | second occurrence |
| `"@cycle"` | the start of section `cycle` |

Rules of thumb:
- Cue the **noun the picture shows** ("spreadsheets" → the spreadsheet fragment).
- Don't cue the very first word of a scene; the scene starts 0.25 s before it, and the first
  item of list scenes shows at once anyway.
- A cue on the **last word** of a section barely shows (the next scene arrives 0.25 s before the
  next section). Cue an earlier word, give the beat its own short section, or give the scene room
  with `hold` / `minSeconds` (below).
- Cues that are never spoken are errors in `npm run check`. Missing cues fall back to a stagger.

Also on every section: `para: true` starts a new ElevenLabs paragraph (use it for a new idea or
mood tag).

## Giving a scene room — `hold` / `holdAfter` / `minSeconds`

A scene lasts as long as its voice: it ends 0.25 s before the next scene's first word. When the
picture needs longer than the line (a click, a form filling, the last card of a list), give it room
instead of rushing the animation or padding the script with words:

| Section prop | Means |
|---|---|
| `hold: 0.8` | 0.8 s of silence after this section's speech; everything after moves on by 0.8 s |
| `holdAfter: { joins: 0.7 }` | 0.7 s of silence after the word "joins" inside this section — a beat mid-line, usually at a `[short pause]`. Keys use the cue syntax (`"it#2"`) |
| `minSeconds: 4` | the scene this section belongs to lasts at least 4 s; the missing time becomes silence after the scene's last section |

The voice is still **one take per cut** (one continuous read keeps the intonation): it is split
only in the pauses after held words (`npm run sync` records the take's pauses with silencedetect)
and the pieces are placed on the timeline; cues and captions move with them. Holds apply at render time — change them freely, no re-record,
no re-sync. Prefer `minSeconds` when the scene has a known need ("the form needs 4 s"): it keeps
working when a new take reads faster or slower. Keep holds short (≤ ~1.5 s); a long silence in the
middle of a sentence's flow sounds like a mistake. `qa` lists every scene's length and the holds.

Tones: `dark` = brand background colour, `light` = soft secondary colour with grid,
`paper` = white. Alternate dark and light scenes to give the edit rhythm.

Icons (`icon` props): check, cross, plus, arrow, search, file, sheet, folder, mail, inbox, chat,
bell, calendar, clock, user, users, chart, trend, pie, gauge, database, cloud, sync, phone, tablet,
laptop, camera, pin, globe, shield, lock, gear, wrench, alert, flag, bolt, layers, link, eye,
target, star, sparkle, rocket, money, doc, checklist, workflow, robot, ai, vessel, pipework,
structure, scan, upload, download, home. Add more in `src/components/icons.tsx` (48×48 stroke paths).

---

## `title` — kinetic headline
Lines of big type, each revealed on its cue. Openers, chapter cards, "what if…" hooks.
```ts
props: {
  lines: [{ text: 'Every update.' }, { text: 'One place.', cue: 'one', accent: ['one'] },
          { text: 'No more chasing.', size: 'small' }],
  eyebrow?: 'FOR SITE TEAMS', tone?: 'dark' | 'light' | 'paper', align?: 'center' | 'left',
}
```

## `problem` — the messy "before"
Up to 12 fragments (spreadsheets, emails, notes, chats, PDFs) fly in and drift; the finale blows
them away. Make the fragment texts specific to the audience's world: file names, email
subjects, sticky-note complaints.
```ts
props: {
  items: [{ kind: 'sheet' | 'email' | 'note' | 'chat' | 'file', text: 'readings_FINAL_v3.xlsx', cue?: 'spreadsheets' }],
  headline?: 'Can you see the whole story?', headlineAccent?: ['whole'],   // shows first, lifts away
  finale?: "There's a simpler way.", finaleCue?: "there's", finaleAccent?: ['simpler'],
  scale?: 1.2,   // fragment size; raise to 1.4 with ≤6 items for phone-first cuts
}
```
Items without a cue follow the previous item of the same kind, so cue one item per kind.

## `reveal` — logo reveal
The clutter converges into a point that opens onto the colour logo. Use right after `problem`,
on the first mention of the product name.
```ts
props: { subtitle?: 'Brings it all together', subtitleCue?: 'together', accent?: ['together'], line2?: 'For the people who…', line2Cue?: 'people' }
```
The subtitle appears ~1 s after the logo, or on `subtitleCue` if that is later.
```ts
```

## `steps` — a process
2–6 steps on a ring (3+, default) or in a row; each lights on its cue; the ring closes; an
optional hub label pops in the middle ("One database").
```ts
props: {
  steps: [{ label: 'Plan', icon: 'checklist', cue: 'plan' }, …],
  layout?: 'ring' | 'row', title?: string, titleAccent?: string[],
  hub?: 'One database', hubIcon?: 'database', hubCue?: 'database', tone?: 'light' | 'dark',
}
```

## `features` — feature cards
2–6 white cards (icon, title, sub) popping in on cues. For "Risk assessments. Sign-off. Audit
trail." style lists.
```ts
props: { items: [{ title: 'Audit trail', sub: 'Every change, who and when', icon: 'shield', cue: 'audit' }],
         title?: string, titleAccent?: string[], columns?: number, tone?: 'dark' | 'light' }
```

## `stats` — numbers
1–3 count-up gauges that land on the spoken number. **`source` is required** and shown on screen;
only use figures the user or their public material states.
```ts
props: {
  items: [{ value: 75, suffix: '%', label: 'less planning', sub: 'time per campaign', cue: 'seventy-five', fill?: 75 }],
  source: 'Pilot results versus paper-based methods. Source: Acme Ltd.',
  only?: [1],   // show a subset in a shorter cut
}
```

## `screen` — the product itself
An app window. Two modes:

**Screenshot** (preferred when the app can be run with demo data): capture at **1600×1000**
(aspect 1.6) into `public/screens/`. `focus` zooms the camera to a point on a cue; `callouts`
pin labels to points. Coordinates are fractions (0–1) of the screenshot.
```ts
props: {
  src: 'screens/inbox.png', aspect?: 1.6, url?: string,
  focus?: [{ x: 0.3, y: 0.4, scale: 1.6, cue: 'inbox' }],
  callouts?: [{ x: 0.72, y: 0.18, text: 'Your tasks, by stage', cue: 'responsible' }],
  title?: 'Your own inbox', titleCue?: string, titleAccent?: string[], tone?: 'dark' | 'light',
}
```
**Mock list** (no screenshot): rows slide in, optional cursor click on a row.
```ts
props: {
  heading: 'My inbox', active?: 'Projects',   // highlighted menu item from BRAND.app.menu
  rows: [{ title: 'Review UT readings V-210', meta: 'Due Thu · Engineer review', status: 'New', statusColor: 'accent' | 'good' | 'warn' | 'bad' | 'primary', cue?: string }],
  clickCue?: 'exactly', clickRow?: 0,
}
```

## `roles` — everyone gets their own work
2–4 people (initials avatar + role) each receiving a task card on their cue.
```ts
props: {
  people: [{ role: 'Engineer', initials: 'EN', task: 'Review inspection results', stage: 'Engineer review', cue: 'engineer' }],
  title?: string, footer?: 'Everyone knows what comes next.', footerCue?: 'everyone', tone?: 'dark' | 'light',
}
```

## `device` — field / mobile work
A tablet or phone filling a form field by field, then syncing to a cloud bubble; pills pop in.
```ts
props: {
  device?: 'tablet' | 'phone', src?: 'screens/mobile.png',   // screenshot instead of the mock form
  heading?: 'Inspection · V-210',
  fields?: [{ label: 'Result', value: 'Satisfactory', cue: 'record' }],
  syncCue?: 'flows', syncLabel?: 'Acme Cloud',
  pills?: [{ text: 'No re-typing', cue: 're-typing' }],
  title?: string, tone?: 'light' | 'dark',
}
```

## `dashboard` — the answer
Optional big question first; on `answerCue` (default: start of the scene's second section) a
dashboard rises: KPI tiles count up, bars grow, donut fills; a cursor clicks a bar on `clickCue`.
Always labelled "Illustrative data" — use realistic but invented numbers, never client data.
```ts
props: {
  question?: "What's the condition of our plant, right now?", questionAccent?: ['right', 'now?'], answerCue?: 'answer',
  heading?: 'Condition dashboard', active?: 'Dashboards',
  kpis?: [{ label: 'Open anomalies', value: 17, suffix?: '', tone?: 'bad' }],     // ≤4
  bars?: [{ label: 'Module A', value: 12 }], barsTitle?: 'Open anomalies by area',  // ≤8
  donut?: [{ label: 'High risk', value: 10, tone: 'bad' }], donutTitle?: 'Risk ranking',
  clickCue?: 'click', clickBar?: 2, chip?: 'Live plant condition & risk', chipCue?: 'condition',
}
```

## `quote` — one big line
A question, a promise, or a customer quote (with attribution, only if real and approved).
```ts
props: { text: 'We cut our reporting time in half.', attribution?: 'Ops Manager, Acme', accent?: ['half'], cue?: string, tone?: 'dark' | 'light' | 'paper', marks?: boolean }
```

## `tagline` — the closing thought
```ts
props: { line1: 'Everything it needs to do', line2?: 'and no more.', line2Cue?: 'and', tickCue?: 'more', tick?: true }
```

## `logo` — logo + line
```ts
props: { line?: 'Simple by design.', lineCue?: 'design', accent?: ['simple'], showUrl?: true }
```

## `endcard` — call to action
White logo, stacked lines, CTA (defaults to `BRAND.cta`). The last line (or any with
`strong: true`) is white, the others soft.
```ts
props: { lines?: [{ text: 'Teams who own' }, { text: 'their operations' }, { text: 'choose Acme', cue: 'choose', strong?: true }], cta?: string, ctaSize?: 40 }
```

---

## Real footage instead of a scene

`src/footage.ts` → `FOOTAGE[sectionId or sceneId] = { src: 'footage/x.mp4', fit: 'screen' | 'full', title?, trimStart? }`.
The clip takes the scene's slot on the timeline. `screen` for app screen recordings (demo data
only), `full` for B-roll. Check PPE and plausibility in AI-generated B-roll.

## Writing a custom scene

When no library scene fits a beat that matters (e.g. the product's signature visual):
1. Copy the closest scene to `src/scenes/custom/<Name>Scene.tsx`.
2. Read timing only through `useScene()` (`cue`, `beat`, `word`, `props`, `duration`) and layout
   through `useLayout()` (`w`, `h`, `u`, `portrait`); wrap in a `Backdrop`; colours from `C`, fonts
   `DISPLAY`/`UI`; animation helpers from `components/anim.ts` (`enter`, `pop`, `fade`, `ramp`,
   `drift`). No CSS transitions or `Math.random()` — Remotion renders frames independently.
3. Register it in `src/scenes/index.ts` and `src/scenes/catalog.ts` (with its required props).
4. `npm run typecheck && npm run check`, then render a still to look at it:
   `npx remotion still <Composition> .qa/still.png --frame=<n>`.
