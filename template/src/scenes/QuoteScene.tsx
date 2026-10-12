import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { fade } from '../components/anim';
import { useLayout } from '../components/layout';
import { Backdrop, Kinetic } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { C, DISPLAY } from '../brand';

/**
 * One big line. props: { text, accent?: string[], attribution?: string, cue?: string,
 * tone?: 'dark'|'light'|'paper', marks?: boolean (quotation marks, default true when attribution) }
 */
export const QuoteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { props, cue } = useScene();
  const { u, w, portrait } = useLayout();
  const text = (props.text as string) ?? '';
  const tone = (props.tone as 'dark' | 'light' | 'paper') ?? 'dark';
  const attribution = props.attribution as string | undefined;
  const marks = (props.marks as boolean | undefined) ?? Boolean(attribution);
  const at = or(cue(props.cue), 6);
  const onLight = tone !== 'dark';
  const size = Math.min(104, ((portrait ? 3.2 : 4.6) * w) / Math.max(text.length, 20)) * u;

  return (
    <Backdrop tone={tone}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: portrait ? 70 : 160, gap: 30 * u }}>
        {marks ? (
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 220 * u, lineHeight: 0.6, color: onLight ? C.primary : C.highlight, opacity: fade(frame, at - 6, 10) }}>
            “
          </div>
        ) : null}
        <Kinetic
          text={text}
          start={at}
          size={size}
          stagger={2}
          color={onLight ? C.bg : C.white}
          accentColor={onLight ? C.primary : C.highlight}
          accent={props.accent as string[] | undefined}
          style={{ maxWidth: w - (portrait ? 140 : 320) }}
        />
        {attribution ? (
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 36 * u, color: onLight ? C.muted : C.softLight, opacity: fade(frame, at + 20, 16) }}>
            — {attribution}
          </div>
        ) : null}
      </AbsoluteFill>
    </Backdrop>
  );
};
