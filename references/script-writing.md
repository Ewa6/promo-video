# Writing the script and the edit

## Story shapes

**Hero (60–90 s)** — website, LinkedIn, trade-show loop. No captions by default (sound on).
1. Hook: a concrete scene from the audience's world (`title`, or footage). 1–2 sentences.
2. Problem: where the work lives today, said in their words (`problem`). Question or list of three.
3. Reveal: product name + one-line promise (`reveal`).
4. How it works: the core loop or workflow, 3–4 steps (`steps`).
5. Two or three proof beats, each one idea with one picture: field/mobile (`device`), roles and
   inboxes (`roles`/`screen`), control and compliance (`features`), numbers (`stats`, sourced).
6. Payoff: the question a manager asks, answered by the product (`dashboard`/`screen`).
7. Close: tagline (`tagline`) → logo + line (`logo`) → optional CTA (`endcard`).

**30 s** — paid social, pre-roll. Captions ON. Problem (2 lines) → reveal → 3 fast proof beats →
tagline/logo. One number at most.

**15 s** — stories, event loops. Captions ON. Question hook → reveal with the promise → one proof
picture → logo.

**Vertical** — any cut can be `format: 'portrait'` (1080×1920) or `'square'` (1080×1080); every
library scene adapts. Vertical-only: just write the cut with `format: 'portrait'`. Both a
landscape and a vertical copy of the same words: after the `CUTS` object literal, add
`CUTS.cut15v = { ...CUTS.cut15, composition: 'Cut15Vertical', title: '15-second vertical (~15 s)', format: 'portrait', voiceFrom: 'cut15' };`
`voiceFrom` reuses cut15's recording (no second take); `npm run sync` times both.

**Length**: the film is voice + `tail` (1.5–2.5 s on the logo). For a strict 30 s slot aim for
~27 s of voice; for 15 s, ~13 s. `npm run check` estimates voice + tail against the `~N s` in the
cut's title.

Every cut must stand alone. Reuse the same sections and props across cuts where the words are the
same, so the cuts feel like one campaign.

## Rules for the words

- Every claim traces to a source: the product's code/UI, its website or docs, or the user's
  answer. Keep a "where the lines come from" table in `brief.md`. Nothing invented. No
  competitor names. No client or asset names from sample data.
- Speak benefits in the buyer's words; name features only when the picture shows them.
- One idea per section; a section is 1–2 sentences. Short sections give more cut points.
- Numbers: only published or user-provided figures, written as words, with a `source` on screen.
- Taglines: reuse the company's existing ones before writing new ones (ask).
- See `elevenlabs-v4.md` for tags, pronunciation and length budgets.

## Rules for the picture

- One scene per idea; 3–8 s per scene on screen. Longer than ~10 s needs internal beats (cues).
- Alternate dark / light scenes for rhythm; end on paper (logo) and dark (end card).
- On-screen text says less than the voice — 2–6 words — and never contradicts it.
- Show the real product wherever it's possible: screenshots of the running app with demo data
  (`screen` with `src`) beat mock UI. Use the product's own words for menus, stages and roles.
- Mock data must look real but be invented and harmless; dashboards say "Illustrative data".
- Brand: colours from the product's CSS/design tokens or logo, official logo files, display
  font close to the logo's. Never invent a palette when one exists. When the product's UI
  palette and the company's corporate palette differ, ask which one the video should wear
  (default: the product's own UI, since that is what the screens show) and record the choice in
  `brief.md`.
- Product name: when the code uses several (repo name, package name, page title), use the name a
  customer sees — the UI heading or website — and confirm it in the interview.

## Section ids

Lower-case, short, meaningful (`hook`, `scattered`, `reveal`, `cycle`, `field`, `stats`, `inbox`,
`audit`, `question`, `answer`, `tagline`, `logo`). Ids are referenced by cues (`"cycle/repair"`)
and by `FOOTAGE`, so keep them stable once the voice is recorded.
