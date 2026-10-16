# Troubleshooting

Use this page when something goes wrong while you make a video. Problems are grouped by when they usually happen. Each one lists what you see, why it happens, and what to do.

Claude fixes most problems by itself and tells you only about the ones that need you. Many of the messages below come from the project's checking tools, and Claude might quote them to you.

**Jump to:** [Setup](#setup) · [Voiceover](#voiceover) · [Pictures and timing](#pictures-and-timing) · [Captions and names](#captions-and-names) · [Script and content](#script-and-content)

## Setup

### The skill doesn't appear in Claude Code

**Problem:** When you type `/`, **promo-video** isn't in the list, or Claude doesn't recognize a request for a promo video.

**Likely cause:** The skill is in the wrong folder, or Claude Code was already open when you installed it.

**Solution:**

1. Check that the folder exists. For a personal installation, it's `~/.claude/skills/promo-video`. For a single product, it's `.claude/skills/promo-video` inside the product's folder.
2. Check that the folder contains a file named `SKILL.md`. If the file is one level deeper, for example in `promo-video/promo-video/SKILL.md`, move the inner folder up one level.
3. Start a new Claude Code session.

### Your version of Node.js is too old

**Problem:** Claude reports a message like:

```text
⚠ Node v20.11.0: the scripts import TypeScript directly and need Node 22.18+.
```

**Likely cause:** Your computer has an older version of Node.js.

**Solution:** Install the current version from [nodejs.org](https://nodejs.org), and then ask Claude to try again.

### The project folder already exists

**Problem:** Claude reports:

```text
✗ marketing/promo-video exists and is not empty — not overwriting.
```

**Likely cause:** A folder with that name already exists, so Claude won't overwrite it.

**Solution:** Choose one of these options:

- If it's an earlier promo video project, ask Claude to continue it. For details, see [Continue a project](how-to/continue-or-save-a-project.md#continue-a-project).
- If it's something else, tell Claude to use a different folder name.

### The speech-timing tool doesn't build

**Problem:** The first time Claude times a video to its voice, the step fails while it builds a tool called whisper.cpp.

**Likely cause:** git or make isn't installed. The speech-timing tool is built from source the first time and needs both.

**Solution:**

1. Install git and make. On a Mac, run `xcode-select --install` in a terminal. For details, see [Install the required tools](getting-started.md#step-1-install-the-required-tools).
2. Ask Claude to try again.

Until it's fixed, Claude can keep working with estimated timing, so you can still review the storyboard.

## Voiceover

### The draft video has no sound

**Problem:** The draft video is silent, or Claude reports:

```text
The guide voice uses macOS `say`. Elsewhere use `npm run sync -- <cut> --estimate` …
```

**Likely cause:** The robotic preview voice works only on a Mac. On other computers, drafts are silent and their timing is estimated.

**Solution:** No action is needed. Review the draft for its pictures and order. The final video uses your real voice recording.

### The voice take doesn't match the script

**Problem:** Claude reports that only part of the script was recognized, for example:

```text
⚠ Under 70% of the script was recognised. Check the audio is this cut, read from the current src/script.ts.
```

or

```text
⚠ only 64% of script words aligned — does the take match the script?
```

**Likely cause:** One of these:

- The file is the take for a different cut.
- The take was generated from an older version of the script.
- The voice read a direction aloud, such as "warm, assured."
- The voice badly mispronounced a word, often the product name.

**Solution:**

1. Check that you sent the take for the right cut.
2. Ask Claude for the current script for that cut, and generate a new take from it. For details, see [Create the voiceover](how-to/create-the-voiceover.md).
3. If the voice read a direction aloud, ask Claude to replace that direction with a plainer one, and then generate the take again.

A match above 90% is normal.

### Claude can't find the voice file

**Problem:** Claude reports `file not found` when it tries to import your take.

**Likely cause:** The path you gave doesn't point to the file, for example because the file is still downloading or has a different name.

**Solution:** Check the file name and folder, and then send Claude the full path again, for example `~/Downloads/hero-take.mp3`.

### The voice is too loud or too quiet

**Problem:** Claude reports a message like:

```text
⚠ loudness -21.4 LUFS is outside −13…−18: re-import the take with npm run vo:import
```

**Likely cause:** The take wasn't brought in through the project's import step, which sets a standard volume for web and social video.

**Solution:** Ask Claude to import the take again. You don't need a new recording.

### The final video still has the robotic voice

**Problem:** The check report says `guide voice, not the real take`.

**Likely cause:** Claude doesn't have a real ElevenLabs take for that cut yet.

**Solution:** Generate the take and send it to Claude. For details, see [Create the voiceover](how-to/create-the-voiceover.md).

## Pictures and timing

### A scene ends before its animation finishes

**Problem:** A scene changes before its animation completes, or Claude reports:

```text
⚠ spoken <0.6 s before the scene ends — the beat barely shows …
```

**Likely cause:** The voice moves on to the next line before the picture has time to finish.

**Solution:** Ask Claude to give the scene more time. Claude adds a short pause to the voice at that point. You don't need a new recording. For details, see [Give a scene more time](how-to/change-a-video.md#give-a-scene-more-time).

### A scene is empty at the start

**Problem:** A scene starts with a blank screen for a moment.

**Likely cause:** The scene's first element waits for a word that comes late in the line.

**Solution:** Tell Claude which scene it is. Claude moves the picture's trigger to an earlier word.

### A pause sounds clipped or starts in the middle of a word

**Problem:** After Claude adds time to a scene, the voice sounds cut off at that point.

**Likely cause:** The timing was made before the pause was added, or the take has no natural pause in that place.

**Solution:** Ask Claude to re-time that cut to its voice. If the problem stays, generate a new take with a clearer pause at that point.

### Text overlaps or is cut off

**Problem:** On-screen text runs off the edge or covers other elements, often in the vertical cut.

**Likely cause:** The on-screen text is too long, or there are too many items in one scene.

**Solution:** Tell Claude which scene it is. Claude shortens the on-screen text, usually to two to six words, or shows fewer items.

### The video stops with an error about timings

**Problem:** Claude reports a message like:

```text
No src/timings/hero.json yet. Run: npm run sync -- hero
```

or reports that a cut was `skipped: not synced`.

**Likely cause:** The script changed after the video was last timed to its voice.

**Solution:** No action is needed from you. Claude times the cut again before it renders. If the spoken words changed, record a new take for that cut.

### The logo or font looks wrong

**Problem:** The logo has a white or colored box around it, or the headline font doesn't match your brand.

**Likely cause:** The logo file has a solid background, or the brand font isn't set.

**Solution:**

- Send Claude a PNG logo with a transparent background, or an SVG file.
- Tell Claude the name of your brand font. The font must be available from Google Fonts.

## Captions and names

### The product name is spelled wrong in the captions

**Problem:** The captions show the product name differently from how you write it, for example "Kora" instead of "KORA."

**Likely cause:** To make the voice say the name as one word, Claude wrote it in the script the way it sounds. The captions follow the script.

**Solution:** Tell Claude how the name should look on screen. Claude maps the spoken spelling back to your spelling in the captions.

### The voice spells out the product name letter by letter

**Problem:** The voice says "K-O-R-A" instead of "Kora," or Claude warns that a word in capitals might be spelled out.

**Likely cause:** ElevenLabs reads short words in capitals as abbreviations.

**Solution:**

1. Ask Claude to write the name in the script with only the first letter capitalized.
2. Generate the take again.
3. If the voice still spells it out, ask Claude to add a pronunciation guide for the name.

## Script and content

### The video is longer or shorter than planned

**Problem:** Claude warns that a cut's estimated length doesn't match its target, for example `estimated 38 s vs target 30 s`.

**Likely cause:** The script has too many or too few words for the length.

**Solution:** Claude usually adjusts the script before you see it. If you prefer to keep the words, tell Claude to change the target length instead.

### A number can't be shown without a source

**Problem:** Claude says that a statistic needs a source, or reports `stats need a real "source" line`.

**Likely cause:** Every number on screen must show where it comes from.

**Solution:** Give Claude the source of the number, such as a report title or a customer study. If you can't name one, ask Claude to remove the number.

### The main video needs more custom scenes

**Problem:** Claude reports that the main video has too few custom scenes.

**Likely cause:** The main video must include at least three scenes built for your product, so it doesn't look generic.

**Solution:** Claude builds more custom scenes. If your product has no screens to show, such as a product that other software connects to, tell Claude. Claude can then skip this rule and record why in `brief.md`.

## Related topics

- [Frequently asked questions](faq.md)
- [Glossary](glossary.md)
