# Documentation plan: promo video skill

This file records how the user documentation in `docs/` was designed. It's part of the documentation development record, not end-user documentation.

## 1. Target audiences

| Audience | Needs | Covered by |
|---|---|---|
| **Primary: non-technical requester** (founder, product manager, marketer) who wants a product video and works through Claude Code | Know what they'll get, what to prepare, what to decide, and how to fix problems, without reading code | All pages in `docs/` |
| **Secondary: helper who installs tools** (a colleague or developer who sets up the computer) | Exact install commands and checks | `prerequisites.md`, `getting-started.md` |
| **Out of scope: skill maintainers and Claude itself** | Scene props, cue syntax, script structure, custom-scene craft | Existing `SKILL.md`, `references/`, `template/README.md` (unchanged) |

Key insight from the analysis: **the user never runs the video tools directly.** Claude runs every `npm run` command. The user's real actions are installing prerequisites, answering the interview, approving twice, generating voice takes in ElevenLabs, sending files, and asking for changes. The docs are organized around those actions, and the command-level detail stays in the developer documentation.

## 2. Main user goals

1. Decide whether the skill fits (what it makes, what it costs, limits).
2. Get a computer ready (install the skill and required tools).
3. Get a first finished video with default settings.
4. Approve the storyboard and the final videos with confidence.
5. Produce the voiceover in ElevenLabs.
6. Change a video later (words, voice, length, format, brand, captions).
7. Add real material (screenshots, footage, music).
8. Understand and fix an error or warning Claude reports.

## 3. Documentation structure

```
docs/
├── README.md                    Landing page and navigation
├── overview.md                  What the skill does (Understand)
├── prerequisites.md             Before you begin (Prepare)
├── getting-started.md           Set up the skill (Set up)
├── quick-start.md               Make your first video (First success)
├── how-it-works.md              Stages and approval points (Understand, concept)
├── how-to/
│   ├── prepare-for-your-video.md
│   ├── review-the-storyboard.md
│   ├── create-the-voiceover.md
│   ├── review-the-final-videos.md
│   ├── change-a-video.md
│   ├── add-screenshots-footage-music.md
│   └── continue-or-save-a-project.md
├── troubleshooting.md           Problem → cause → solution (Resolve)
├── faq.md                       Short answers (Learn more)
├── glossary.md                  Terms (Reference)
└── documentation-plan.md        This file
```

The root `README.md` gets a short "Documentation" section that links to `docs/README.md`.

## 4. Rationale for the structure

- **Journey order.** The landing page lists pages in the order Discover → Understand → Prepare → Set up → First success → Perform tasks → Resolve → Learn more.
- **One concept page, linked everywhere.** The seven stages and two approval points are explained once in `how-it-works.md`. Procedures link to it instead of repeating it.
- **How-to pages follow the user's real touchpoints,** not repository components. There are no pages named after `script.ts`, `brand.ts`, or `sync.mjs`. Each user touchpoint in `SKILL.md` (interview, approval 1, voice, approval 2, wrap-up, change requests) maps to one page.
- **The quick start uses the manual voice route,** because it's always available. The connector route is in the voiceover how-to.
- **Prerequisites are separate from setup.** Users can check readiness before they install anything, and a helper can follow `getting-started.md` alone.
- **Troubleshooting versus FAQ.** Troubleshooting contains only problems with a basis in the code (an error, warning, or documented symptom). FAQ contains decision and expectation questions (cost, language, platform, data, where files are).
- **Change requests are grouped on one page** with a table that answers the most important question first: "Do I need a new voice recording?"

## 5. Main user journeys

1. **First video:** README → overview → prerequisites → getting-started → quick-start → (review-the-storyboard, create-the-voiceover, review-the-final-videos).
2. **Returning user, change request:** change-a-video → (continue-or-save-a-project) → create-the-voiceover if the words change.
3. **Error recovery:** a message from Claude → troubleshooting (searchable by quoted message) → linked how-to.
4. **Evaluation only:** overview → faq (cost, platform, language) → prerequisites.

## 6. Terminology decisions

| Use | Don't use | Reason |
|---|---|---|
| cut | version, edit, composition | The skill uses "cut" throughout. Defined in `overview.md` and the glossary. |
| hero, main video | hero cut only | "Hero" is unfamiliar. First use pairs it with "main video." |
| take | recording only | ElevenLabs and the skill both use "take." Defined at first use. |
| voiceover | VO | Avoid abbreviations. |
| storyboard | contact sheet | "Contact sheet" is an internal QA term. The user sees a storyboard image. |
| check report | QA report | Avoid abbreviations. |
| guide voice, robotic preview voice | `say` | Describe what the user hears. |
| audio tag, voice direction | SSML, prompt | Match ElevenLabs v4 wording. |
| match the voice to the script, alignment | sync, whisper | `npm run sync` and whisper.cpp are internal. "Alignment" appears only because Claude reports it as a percentage. |
| custom scene, library scene | component, scene id | Users need the distinction to understand the three-custom-scene rule. |
| render | build, export | Matches Claude's messages. |

## 7. Assumptions

- Users work in **Claude Code** on their own computer with the product's repository open. Inferred from `SKILL.md` (Paths, Install) and the `~/.claude/skills` install path.
- Users talk to Claude in natural language. They don't run `npm` commands. Exact commands appear only for installing prerequisites and the skill.
- The ElevenLabs web interface uses the labels **Eleven v4**, **Stability**, **Similarity**, **Voices → ⋯ → Copy voice ID**. The last comes from a code comment in `template/src/script.ts`. The others come from setting names in `references/elevenlabs-v4.md`. The exact UI labels weren't verified against the live site.
- Fonts must come from Google Fonts. Inferred from `template/src/brand.ts`, which loads fonts through `@remotion/google-fonts`.
- Default output file names use a short product name chosen by Claude (`SLUG` in `script.ts`). Example names such as `acme-hero.mp4` are illustrative.
- The default cut IDs (`hero`, `cut30`, `cut15`, `cut15v`) are inferred from the `brief.md` template and `references/script-writing.md`. The template itself contains only a 10-second example `hero` cut.

## 8. Unresolved questions (need SME confirmation)

1. **Install URL.** The root `README.md` clones `git@github.com:krzjablonski/promo-video.git`, but this repository is `github.com/Ewa6/promo-video`. The docs use `https://github.com/Ewa6/promo-video.git` (HTTPS, so no SSH key is needed). Confirm the canonical URL.
2. **Platform support.** No statement about Windows or Linux. `bin/new-project.sh` needs bash, and ffmpeg detection checks Unix paths only. The FAQ says Windows support isn't confirmed.
3. **Language support.** The speech-timing model is `base.en` (English only), and number-to-word handling is English only (`template/scripts/lib.mjs`, `sync.mjs`). The FAQ says only English is supported reliably. Confirm whether other languages are intended.
4. **Products without code access.** `SKILL.md` assumes a repository and asks "if the repo isn't the product's." It's unclear whether a website-only run is supported. The FAQ tells users to ask Claude.
5. **Updating a per-repo installation.** The README documents updating only the personal installation. The docs tell per-repo users to delete and clone again. Confirm, or document the submodule option.
6. **Skill discovery.** The check "type `/` and look for promo-video" assumes that Claude Code lists skills in the slash menu, which the README implies (`/promo-video`). Confirm for the current Claude Code version.
7. **Own recordings.** The scripts accept any MP3, WAV, or M4A file, and `guide-voiceover.mjs` suggests "record any rough read." It's not clear whether non-ElevenLabs final voices are supported. The FAQ presents this cautiously.
8. **Time and cost.** The repository gives no total time per video or credit cost per take. The docs don't estimate them.

## 9. Known limitations (documented for users)

- ElevenLabs account required. Eleven v4 model. No API key handling.
- Robotic guide voice only on macOS. Elsewhere drafts are silent with estimated timing.
- Remotion Company License required for companies with more than three employees.
- Colors must be six-digit hex codes.
- Screenshots and footage must use demo data only.
- Numbers on screen need a source.
- The hero cut needs at least three custom scenes, unless an exception is recorded.
- Changing spoken words requires a new take.
- `out/` and `.qa/` aren't committed. Voice takes are.

## 10. Review process

The brief asked for parallel subagent reviews (repository analyst, information architect, non-technical user advocate, troubleshooting analyst, documentation editor). The repository analyst and troubleshooting analyst subagents were started, but both stopped immediately because of an account usage limit, before returning any findings. The lead author performed all five roles in sequence instead:

- **Repository analysis:** read `SKILL.md`, `README.md`, `bin/new-project.sh`, all of `references/`, and every script in `template/scripts/`, plus `script.ts`, `brand.ts`, `footage.ts`, `timings.ts`, `timeline.ts` signatures, `Root.tsx`, `PromoCut.tsx`, and `scenes/catalog.ts`.
- **Troubleshooting map:** built from every `✗`, `⚠`, `throw`, and `console.error` message in the scripts and from the Troubleshooting table in `SKILL.md`.
- **Information architecture:** see sections 3–5.
- **Beginner review:** removed command-line instructions from all task pages, defined terms at first use, and explained hidden folders and file paths.
- **Microsoft style edit:** second person, active voice, sentence-case headings, imperative steps with one action each, no "simply," "just," or "easy," no unexplained acronyms. LUFS appears only in the glossary and inside quoted messages.

## 11. Major source files

| File | Used for |
|---|---|
| `SKILL.md` | Workflow, interview topics, approval points, voice routes, wrap-up, troubleshooting table, licensing |
| `README.md` | Install methods, requirements, licensing |
| `bin/new-project.sh` | Folder overwrite protection, Node version warning, whisper build message |
| `references/script-writing.md` | Default cuts, lengths, captions, vertical and square formats, sourcing rules |
| `references/elevenlabs-v4.md` | Model, settings, takes, audio tags, pronunciation, word budgets, music level |
| `references/custom-scenes.md` | Custom-scene minimums, specificity rule, reference examples |
| `references/scenes.md` | Screenshot size, footage replacement |
| `template/scripts/*.mjs` | Exact messages, thresholds (70% and 80% alignment, −13 to −18 LUFS), outputs, file locations |
| `template/src/script.ts` | Voice defaults (stability 0.5, similarity 0.75), voice ID location, cut options |
| `template/src/brand.ts`, `footage.ts` | Brand settings, logos, fonts, footage and music options |
| `template/src/PromoCut.tsx` | Video dimensions |
| `template/.gitignore` | What isn't saved |

## 12. Suggestions for future improvements

- Add a sample storyboard image and a short sample video, so users see the result before they start.
- Add screenshots of the ElevenLabs settings for the manual voice route.
- Confirm the open questions above and remove the cautious wording in the FAQ.
- Add an estimate of ElevenLabs credits per cut, based on character counts.
- Consider a printable one-page checklist based on `how-to/prepare-for-your-video.md`.
