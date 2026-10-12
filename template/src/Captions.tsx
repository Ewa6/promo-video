import { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { BRAND, C, DISPLAY } from './brand';
import type { WordTiming } from './timings';

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** "seventy-five" → 75, "ten" → 10, else null. */
const wordsToNumber = (w: string): number | null => {
  const [a, b] = w.toLowerCase().split('-');
  const t = TENS.indexOf(a);
  if (t >= 2) {
    if (!b) return t * 10;
    const o = ONES.indexOf(b);
    return o > 0 && o < 10 ? t * 10 + o : null;
  }
  const o = ONES.indexOf(a);
  return o >= 0 && !b ? o : null;
};

interface Token {
  text: string;
  start: number;
  end: number;
}

/**
 * Captions read the script, not the transcript, so spelling is always right. Only the display
 * differs from the voice text: BRAND.captionReplace maps voice spellings back ("Kora" → "KORA"),
 * ElevenLabs emphasis CAPS go back to lower case, and "seventy-five percent" becomes "75%".
 */
const toDisplay = (words: WordTiming[]): Token[] => {
  const out: Token[] = [];
  const replace = Object.entries(BRAND.captionReplace as Record<string, string>);
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let text = w.text;
    const bare = text.replace(/[^A-Za-z-]/g, '');
    const num = wordsToNumber(bare);
    if (num !== null && /^percent/i.test(words[i + 1]?.text ?? '')) {
      const next = words[++i];
      out.push({ text: `${text.replace(/[A-Za-z-]+/, String(num))}%${next.text.replace(/^percent/i, '')}`, start: w.start, end: next.end });
      continue;
    }
    const hit = replace.find(([from]) => from.toLowerCase() === bare.toLowerCase());
    if (hit) text = text.replace(bare, hit[1]);
    else if (/^[A-Z]{2,}(-[A-Z]+)*$/.test(bare) && bare.length > 3) {
      // ElevenLabs emphasis back to normal case, keeping a sentence-initial capital
      const sentenceStart = out.length === 0 || /[.?!…]$/.test(out[out.length - 1].text);
      text = text.toLowerCase();
      if (sentenceStart) text = text.replace(/[a-z]/, (ch) => ch.toUpperCase());
    }
    out.push({ text, start: w.start, end: w.end });
  }
  return out;
};

const chunk = (tokens: Token[], maxWords: number): Token[][] => {
  const chunks: Token[][] = [];
  let current: Token[] = [];
  tokens.forEach((t, i) => {
    current.push(t);
    const next = tokens[i + 1];
    const sentenceEnd = /[.?!]$/.test(t.text) || /\.\.\.$/.test(t.text);
    const gap = next ? next.start - t.end : 0;
    if (!next || current.length >= maxWords || sentenceEnd || gap > 0.55) {
      chunks.push(current);
      current = [];
    }
  });
  return chunks;
};

export const Captions: React.FC<{ words: WordTiming[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const t = frame / fps;
  const chunks = useMemo(() => chunk(toDisplay(words), portrait ? 4 : 6), [words, portrait]);

  const index = chunks.findIndex((c, i) => {
    const from = c[0].start - 0.08;
    const until = Math.min(chunks[i + 1]?.[0].start ?? Infinity, c[c.length - 1].end + 0.7);
    return t >= from && t < until;
  });
  if (index < 0) return null;

  return (
    // portrait: keep clear of the bottom UI of Reels/Stories/TikTok
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: portrait ? 380 : 50, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          maxWidth: portrait ? width - 120 : 1500,
          padding: '14px 30px 18px',
          borderRadius: 18,
          background: `${C.bgDeep}d1`,
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: portrait ? 58 : 50,
          lineHeight: 1.2,
          textAlign: 'center',
          color: C.white,
        }}
      >
        {chunks[index].map((tok, i) => {
          const spoken = t >= tok.start;
          const current = spoken && t < tok.end + 0.05;
          return (
            <span key={i} style={{ color: current ? C.highlight : C.white, opacity: spoken ? 1 : 0.45 }}>
              {(i ? ' ' : '') + tok.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
