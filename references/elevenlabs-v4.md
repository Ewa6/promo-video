# Writing for ElevenLabs Eleven v4

The script in `src/script.ts` *is* the ElevenLabs text. `npm run script -- <cut>` prints it with
paragraphs; that output is what gets pasted into elevenlabs.io or sent through an ElevenLabs connector. Write for the ear first.

## Model and settings

| Setting | Value |
|---|---|
| Model | `eleven_v4` (not the turbo variant — it ignores most tags) |
| Stability | ~0.50 for hero cuts (controlled). Drop to ~0.35 if it sounds flat. ElevenLabs publishes no v4 numbers; these are starting points. |
| Similarity | ~0.75 |
| Seed | Leave unset for the first takes; once a take is liked, fix its seed so regenerated lines match. |
| Takes | Generate 3–4 per cut and pick. v4 varies run to run. |

v4 has **no SSML, no style field and no speed slider**. All direction lives inline as
`[audio tags]`, punctuation and CAPS.

Generate each cut in **one request** (all cuts sit far below the 10,000-character limit).
Splitting by paragraph makes the prosody drift between parts.

## Voice brief (when the user has no voice yet)

Ask what the brand should sound like; default to a warm, confident, mid-low narrator, "premium
documentary, not hard-sell advert". A Professional Voice Clone performs best on v4; Voice Design
voices can be less expressive. Voice Design prompt template:

> A warm, assured [British/American/…] [male/female] narrator in their [forties], smooth mid-low
> voice. Calm authority, quietly confident, slightly smiling delivery. Clear diction, unhurried
> pace, like a high-end [industry] documentary. Studio quality, close mic, no background noise.

Record the chosen voice name and ID in `VOICE` in `src/script.ts`.

## Audio tags

- Put one tag at the **start of each paragraph** to set its mood: `[Quiet, measured narration]`,
  `[Building, curious]`, `[Warm, assured]`, `[Steady, conversational pace]`,
  `[Lighter, energised]`, `[Clear, confident]`, `[Softening, reflective]`, `[Warm, proud]`,
  `[Lower, sincere]`.
- Pauses: `[short pause]`, `[pause]`, `[long pause]`; or `...` for a breath inside a sentence.
- Keep tags short and descriptive of *voice*. If a take reads a tag aloud or turns it into a
  sound effect, swap it for a plainer one (`[confident]` instead of `[Gradually building energy]`).
- Tags are stripped from captions and alignment automatically.

## Words

- **Numbers as words**: "twenty-five percent", "three hundred". Digits read unreliably, and the
  alignment and the captions ("75%") expect words. `npm run check` flags digits.
- **Brand names that are acronyms but said as a word**: write them in title case so v4 doesn't
  spell them out ("Kora", not "KORA"), then map them back for captions with
  `BRAND.captionReplace = { Kora: 'KORA' }`. If a take still spells it out, use inline IPA: `/ˈkɔːrə/`.
- **Acronyms the audience doesn't know**: cut them. They read badly aloud and mean nothing to a
  new buyer. Spell out what the thing does instead.
- **CAPS for emphasis**, sparingly: one or two words per cut (`WHOLE`, `SEVENTY-FIVE`). More
  flattens the effect.
- Short sentences. Fragments are fine ("No re-typing. No lost paperwork.").
- Lists of three land well, and give the picture three beats to cut on.

## Pace and length

A measured narration runs at about **2.4–2.7 words per second** plus pauses. Budget:

| Cut | Words | Paragraphs |
|---|---|---|
| ~15 s | 28–35 | 3–4 |
| ~30 s | 60–75 | 5–7 |
| ~60 s | 130–150 | 8–10 |
| ~90 s | 190–230 | 10–14 |

`npm run check` estimates each cut and warns when it is off the target in its title.

## After the take

1. `npm run vo:import -- <cut> ~/Downloads/<file>.mp3` — normalises to −16 LUFS (ElevenLabs
   exports land around −22) and saves `public/voiceover/<cut>.mp3`. Timing is unchanged.
2. `npm run sync -- <cut>` — transcribes locally with whisper.cpp, aligns to the script.
   Under 80% aligned usually means the take doesn't match the current script, or a word was
   mispronounced badly. Over 90% is normal.
3. If one line is wrong, regenerate just that line (same voice, same seed) in ElevenLabs and
   splice it in an audio editor, or regenerate the whole cut and re-import.

## Music

Optional. Keep it 18–20 dB under the voice (`MUSIC.volume` 0.1–0.15 for a full-scale track) and
leave a gap before the end tagline so it can breathe over the logo. Only use tracks the user has a
licence for; ask where it comes from.
