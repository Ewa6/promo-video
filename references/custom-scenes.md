# Custom scenes — where the film is won

The library scenes (`title`, `problem`, `reveal`, `stats`, `tagline`, `logo`, `endcard`…) are
connective tissue. They look the same for every product. What makes a promo *this product's*
film is a handful of scenes built for it: its world, and its real screens doing real work.

**The specificity test**: for every frame of the storyboard ask *"could this frame appear, unchanged,
in a competitor's video?"* Icons on white cards, avatars with task cards, a generic form, a
generic dashboard: yes → generic. An offshore platform at dawn, vessel V-210 with its weld and
thickness readings, an inbox listing "Fabric Crew · DEF-0391 coating breakdown, deck 2": no →
specific. A hero cut where most frames fail the test is not done, however polished.

## Minimums

| Cut | Custom scenes |
|---|---|
| Hero (≥45 s) | ≥ 3: one **world opener** + ≥ 2 **product screens** (usually 3–5) |
| 30 s | ≥ 1 product screen (reuse the hero's) |
| 15 s | reuse one hero custom scene if it reads in 3 s; otherwise library is fine |

`npm run check` errors when a hero-length cut has fewer than 3 custom scenes. Only override with
`allowGeneric: true` on the cut (e.g. an API-only product with no UI), and say why in `brief.md`.

## Study the examples first

**The user's examples come first.** The interview asks for films, scenes or styles the user wants
to emulate (links, video files, their own earlier promos, competitor or reference videos, custom
scenes from another project). Recorded in `brief.md` under *Reference examples*, they set the bar
for pacing, tone, illustration style and type, and they win wherever they disagree with the
generic example below. Study them first: for video files, extract stills
(`ffmpeg -i ref.mp4 -vf fps=1/3 .qa/ref-%02d.jpg`) and look at them; for code, read the scenes.
Borrow ideas and craft, never their brand, logos, footage or copy.

**Generic example** (fallback and craft reference): `references/examples/asset-integrity/` holds
the custom scenes of a promo for a fictional asset-integrity product. Read `OffshoreScene` (world
opener), `VesselScene` (subject with callouts), `InboxScene`, `FieldScene`, `ControlScene` and
`DashboardScene` (product screens) before writing your own. Their API differs slightly from the
template (see the mapping in that folder's README) — copy the ideas and the craft, not the code
verbatim.

## Recipe 1 — the world opener

What: 4–8 s establishing shot of the place the product's work happens, drawn as flat vector
art in the brand palette, on the first line of the voice. Then (often) a second shot closing in
on **one concrete subject** with 2–4 callouts naming real attributes.

- Start from `WorldBackdrop` (`components/kit.tsx`): sky by time of day, sea / land / city ground.
- Draw the subject as SVG silhouettes standing on the horizon: platform, plant, warehouse,
  hospital, truck fleet, construction site, retail floor, server room… 10–40 primitives
  (`rect`, `polygon`, `line`, `circle`) in one dark colour reads as a confident illustration.
- Add life: a slow camera push (`ramp(frame, [0, duration], [1, 1.06])` as a scale), one or two
  moving lights (flare flicker, blinking beacon, water glints), nothing frantic.
- Subject close-up: the object the product manages (a pressure vessel, a machine, a shipment, a
  patient record, a building) with `Callout`s on the words that name its parts, each with a
  realistic identifier and value ("Wall thickness · 11.8 mm, nominal 12.7 mm").
- Ask the user whether they'd rather drop in real B-roll (`footage.ts`) — illustration is the
  default because it is always on-brand and costs nothing.

## Recipe 2 — product screens, recreated from the code

What: the app's real screens, rebuilt as React inside `AppWindow` (or `DeviceFrame` for mobile),
showing the exact moment the voice describes. Better than screenshots when the app can't be run
with clean demo data; as good as screen recordings and fully animatable.

1. **Find the screen in the code.** The research step lists component paths for the key screens.
   Read the component/template *and its CSS*: layout regions, column headers, status names,
   button labels, the menu/topbar, the sidebar, empty states, spacing and radii.
2. **Rebuild it at true size inside `AppFrame`** (kit): lay the screen out in the app's own
   virtual viewport (e.g. 1280×760 CSS px) exactly as the app does, and let `AppFrame` scale it
   into the frame. This is what makes a recreation look like the product rather than a sketch.
   `AppWindow` (ui.tsx) is only for products with a dark navbar + menu; don't bend the product to
   fit it. Put shared chrome (topbar, sidebar, icons) in a `custom/app.tsx` module that every
   product scene imports, so the screens are consistent.
   Use the app's own words verbatim (stage names, roles, entity names), its UI font and colours.
   If the app uses an icon library (Lucide, Material, Heroicons), install the same one
   (`npm i lucide-react`) instead of approximating icons.
3. **Invent the data, realistically**: IDs in the product's own format (DEF-0391, JP-4812,
   INV-10442), plausible names of things in the domain, believable dates and quantities. Never
   real client, customer or person names; never figures that look like real results.
4. **Animate the beat**, on cues: rows slide in, a status flips, a cursor clicks and a detail
   panel opens, a value types itself in, a `Stamp` lands ("SIGNED OFF ✓"), an `AuditLog` writes
   itself, a `RiskMatrix` fills and its cell pulses. One clear action per sentence.
5. **Frame it** with `cameraAt` + `Camera` (kit): open on the whole window, push in to the region
   the voice is talking about, pull back for the result. Aim with `appToScene`. **Never crop text
   mid-word or cut a header in half** — keep the zoom so whole regions fit. A short title above
   ("Every team. Its own queue.") only if the voice doesn't already say it.

Screenshots (`screen` with `src`) are the alternative when the app runs locally with demo data —
capture at 1600×1000 and add `focus`/`callouts`. Recreated screens usually animate better.

## Recipe 3 — the mechanism

What: the idea behind the product, drawn — e.g. the integrity cycle turning, then sliding aside
to reveal one central database that every stage writes to. Start from a library scene (`steps`)
only if it says exactly the thing; otherwise draw the diagram yourself with SVG and move it in
2–3 cued stages.

## Craft rules

- One scene file per idea in `src/scenes/custom/`, registered in `scenes/index.ts` and
  `scenes/catalog.ts` (with its required props, `library: false`).
- Timing only through `useScene()`: `cue(props.x)`, `word(/^thickness/)`, `beat('cycle')`; every
  cue needs a fallback (`or(word(...), 40)`) so the scene works in every cut.
- Layout through `useLayout()`. Design for landscape; for portrait/square either stack the same
  elements (flex column, smaller sizes) or simplify (fewer rows, one panel). Check each format
  the scene appears in.
- Wrap content in a `Backdrop` (or `WorldBackdrop`) so it respects the caption band.
- No `Math.random()`, no CSS transitions, no `useEffect` timers — everything is a pure function of
  the frame.
- Start every custom `.tsx` file with `import React from 'react';`. JSX outside a component (e.g. an
  icon map constant) otherwise fails at render with `React is not defined`, although
  `npm run typecheck` passes.
- Give each cued beat room: two cues in one scene less than ~0.6 s apart blur into one (`qa` warns).
  When the animation needs longer than the voice gives the scene, set `minSeconds` (or `hold`) on
  its section (references/scenes.md) instead of squeezing the animation.
- Keep the dark/light rhythm across *all* scenes, custom ones included: avoid two dark scenes in a row.
- After each new scene: `npm run typecheck`, render a still at its busiest moment
  (`npx remotion still <Composition> .qa/x.png --frame=<n>`), look at it, fix, then move on.
