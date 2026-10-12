import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { enter, mix, pop, ramp } from '../components/anim';
import { useLayout } from '../components/layout';
import { DarkBackdrop, Kinetic, Logo, PaperBackdrop } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { C } from '../brand';

const DOTS = Array.from({ length: 14 }, (_, i) => ({
  x: ((i * 137) % 100) / 100,
  y: ((i * 61 + 23) % 100) / 100,
  w: [380, 440, 250, 300][i % 4],
  h: [240, 112, 210, 110][i % 4],
  rot: ((i * 7) % 13) - 6,
  note: i % 4 === 2,
}));

/**
 * Clutter converges into one point that opens onto the logo. Best right after `problem`.
 * props: { subtitle?: string, subtitleCue?: string, accent?: string[], line2?: string, line2Cue?: string }
 */
export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue, duration } = useScene();
  const { w, h, fullH, u, portrait } = useLayout();
  const subtitle = props.subtitle as string | undefined;
  const line2 = props.line2 as string | undefined;

  const converge = enter(frame, 0, fps, 16);
  const open = enter(frame, 12, fps, 22);
  const logo = pop(frame, 20, fps);
  const zoom = ramp(frame, [20, duration], [1, 1.05]);
  const subtitleAt = Math.max(32, or(cue(props.subtitleCue), 32));
  const line2At = line2 ? or(cue(props.line2Cue), 50) : 0;

  return (
    <AbsoluteFill>
      <DarkBackdrop>
        {DOTS.map((d, i) => {
          const s = mix(converge, 0.5, 0.05);
          const x = mix(converge, d.x * w, w / 2);
          const y = mix(converge, d.y * h, h / 2);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - (d.w * s) / 2,
                top: y - (d.h * s) / 2,
                width: d.w * s,
                height: d.h * s,
                borderRadius: 8,
                background: d.note ? C.highlight : C.white,
                opacity: 1 - open,
                transform: `rotate(${d.rot * (1 - converge)}deg)`,
              }}
            />
          );
        })}
      </DarkBackdrop>
      <PaperBackdrop style={{ clipPath: `circle(${open * Math.hypot(w, fullH) * 0.6}px at 50% 50%)` }}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 36 * u, transform: `scale(${zoom})`, padding: 60 }}>
          <div style={{ transform: `scale(${0.7 + 0.3 * logo})`, opacity: Math.min(1, logo * 1.5) }}>
            <Logo width={(portrait ? 0.8 : 0.47) * w} />
          </div>
          {subtitle ? (
            <Kinetic text={subtitle} start={subtitleAt} size={(portrait ? 58 : 64) * u} color={C.bg} weight={700} accentColor={C.primary} accent={props.accent as string[] | undefined} style={{ maxWidth: w * 0.85 }} />
          ) : null}
          {line2 && frame >= line2At ? <Kinetic text={line2} start={line2At} size={40 * u} color={C.muted} weight={600} stagger={2} style={{ maxWidth: w * 0.85 }} /> : null}
        </AbsoluteFill>
      </PaperBackdrop>
    </AbsoluteFill>
  );
};
