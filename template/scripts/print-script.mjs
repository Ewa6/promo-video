// Prints the ElevenLabs v4 text for a cut, ready to paste: npm run script -- <cut> [--json]
import { CUTS, VOICE, elevenLabsText, estimateSeconds, hasFlag, parseCutArg } from './lib.mjs';

const cut = parseCutArg('[--json]');
const text = elevenLabsText(cut);
if (hasFlag('json')) {
  console.log(JSON.stringify({ cut, text, voice: VOICE }, null, 2));
} else {
  console.log(text);
  console.error(
    `\n— ${CUTS[cut].title}: ${text.length} characters (v4 limit 10,000), ~${Math.round(estimateSeconds(cut))} s at a measured pace.\n` +
      `— ElevenLabs: model ${VOICE.model}, voice ${VOICE.voiceName || VOICE.voiceId || '(not set)'}, stability ${VOICE.stability}, similarity ${VOICE.similarity}` +
      (VOICE.seed !== null ? `, seed ${VOICE.seed}` : '') +
      `\n— Save the take, then: npm run vo:import -- ${cut} <path-to-download.mp3>`,
  );
}
