import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { fade } from '../components/anim';
import { useLayout } from '../components/layout';
import { Backdrop, Kinetic } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { C, DISPLAY } from '../brand';

interface Line {
  text: string;
  /** Spoken cue that reveals this line (see useScene().cue). Default: staggered after the previous. */
  cue?: string;
  accent?: string[];
  /** 'big' (default) or 'small' for a supporting line. */
  size?: 'big' | 'small';
}

/**
 * Kinetic headline. props: { lines: Line[], eyebrow?: string, tone?: 'dark'|'light'|'paper',
 * align?: 'center'|'left' }
 */
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { props, cue } = useScene();
  const { u, w, portrait } = useLayout();
  const lines = (props.lines as Line[]) ?? [];
  const tone = (props.tone as 'dark' | 'light' | 'paper') ?? 'dark';
  const align = (props.align as 'center' | 'left') ?? 'center';
  const eyebrow = props.eyebrow as string | undefined;
  const onLight = tone !== 'dark';
  const longest = Math.max(...lines.map((l) => l.text.length), 8);
  const big = Math.min(130, ((portrait ? 1.5 : 2.3) * w) / longest) * u;

  let prev = 4;
  const starts = lines.map((l, i) => {
    const at = or(cue(l.cue), i === 0 ? 4 : prev + 14);
    prev = at;
    return at;
  });

  return (
    <Backdrop tone={tone}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: align === 'left' ? 'flex-start' : 'center',
          padding: portrait ? '0 70px' : '0 150px',
          gap: 8 * u,
        }}
      >
        {eyebrow ? (
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 34 * u,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: onLight ? C.primary : C.accent,
              opacity: fade(frame, 0, 14),
              marginBottom: 20 * u,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        {lines.map((l, i) =>
          frame >= starts[i] ? (
            <Kinetic
              key={i}
              text={l.text}
              start={starts[i]}
              size={l.size === 'small' ? big * 0.45 : big}
              weight={l.size === 'small' ? 600 : 800}
              color={onLight ? (l.size === 'small' ? C.ink : C.bg) : l.size === 'small' ? C.softLight : C.white}
              accentColor={onLight ? C.primary : C.highlight}
              accent={l.accent}
              align={align}
              style={{ maxWidth: w - (portrait ? 140 : 300) }}
            />
          ) : (
            <div key={i} style={{ height: (l.size === 'small' ? big * 0.45 : big) * 1.25 }} />
          ),
        )}
      </AbsoluteFill>
    </Backdrop>
  );
};
