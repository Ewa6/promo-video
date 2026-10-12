// Builds a robotic *guide* voiceover with macOS `say`, so a cut can be previewed and timed
// before the real ElevenLabs take exists: npm run vo:guide -- [cut…] [--voice Daniel]
//
// Writes public/voiceover/<cut>.guide.mp3. `npm run sync` prefers <cut>.mp3 when it exists.
// Not on macOS? Skip this and run `npm run sync -- <cut> --estimate` (silent, estimated timings).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CUTS, ROOT, ffmpeg, flagValue, parseCutsArg } from './lib.mjs';

if (process.platform !== 'darwin') {
  console.error('The guide voice uses macOS `say`. Elsewhere use `npm run sync -- <cut> --estimate`, or record any rough read as public/voiceover/<cut>.mp3.');
  process.exit(1);
}

const voice = flagValue('voice', 'Daniel');
const silence = (ms) => ` [[slnc ${ms}]] `;
const toSay = (text) =>
  text
    .replace(/\[(short )?pause\]/gi, silence(400))
    .replace(/\[long pause\]/gi, silence(900))
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\.\.\./g, `,${silence(250)}`)
    // `say` spells some all-caps words out; the emphasis only matters to ElevenLabs
    .replace(/\b[A-Z]{2,}(-[A-Z]+)?\b/g, (w) => w.toLowerCase());

for (const cut of parseCutsArg(['voice'])) {
  if (CUTS[cut].voiceFrom) {
    console.log(`[${cut}] uses the voice of ${CUTS[cut].voiceFrom}`);
    continue;
  }
  const text = CUTS[cut].sections.map((s, i) => (i > 0 && s.para ? silence(650) : ' ') + toSay(s.text)).join('');
  const tmp = mkdtempSync(join(tmpdir(), 'promo-guide-'));
  try {
    const txt = join(tmp, 'vo.txt');
    const wav = join(tmp, 'vo.wav');
    writeFileSync(txt, `[[slnc 300]] ${text}`);
    // rate 188 lands within a few percent of a measured Eleven v4 narrator, so guide timings are realistic
    execFileSync('say', ['-v', voice, '-r', '188', '-f', txt, '-o', wav, '--file-format=WAVE', '--data-format=LEI16@22050'], { stdio: 'inherit' });
    const out = join(ROOT, 'public', 'voiceover', `${cut}.guide.mp3`);
    const [bin, ...pre] = ffmpeg();
    execFileSync(bin, [...pre, '-y', '-loglevel', 'error', '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-ac', '1', '-b:a', '128k', out], { cwd: ROOT, stdio: 'inherit' });
    console.log(`[${cut}] Guide voiceover written: public/voiceover/${cut}.guide.mp3`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
console.log('Next: npm run sync');
