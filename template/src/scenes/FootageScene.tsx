import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { enter, ramp } from '../components/anim';
import { useLayout } from '../components/layout';
import { DarkBackdrop, Kinetic } from '../components/ui';
import type { Footage } from '../footage';
import { useScene } from '../SceneContext';
import { C } from '../brand';

/** A real clip in a scene's slot: full-bleed B-roll, or a screen recording framed on the backdrop. */
export const FootageScene: React.FC<{ footage: Footage }> = ({ footage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { duration } = useScene();
  const { w, h, u, portrait } = useLayout();
  const trimBefore = Math.round((footage.trimStart ?? 0) * fps);

  if (footage.fit === 'full') {
    return (
      <AbsoluteFill style={{ backgroundColor: C.bgDeep }}>
        <AbsoluteFill style={{ transform: `scale(${ramp(frame, [0, duration], [1, 1.08])})` }}>
          <OffthreadVideo src={staticFile(footage.src)} trimBefore={trimBefore} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(0,20,45,0.6))' }} />
        {footage.title ? (
          <div style={{ position: 'absolute', left: 100, right: 100, bottom: 110 }}>
            <Kinetic text={footage.title} start={8} size={58 * u} weight={700} align="left" />
          </div>
        ) : null}
      </AbsoluteFill>
    );
  }

  const p = enter(frame, 0, fps, 22);
  const boxW = portrait ? w - 80 : Math.min(1600, w - 220);
  const boxH = portrait ? boxW * 1.6 : (boxW * 9) / 16;
  return (
    <DarkBackdrop>
      {footage.title ? (
        <div style={{ position: 'absolute', top: 40, left: 60, right: 60 }}>
          <Kinetic text={footage.title} start={4} size={60 * u} />
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: (w - boxW) / 2,
          top: Math.max(footage.title ? 170 : 80, (h - boxH) / 2 + (footage.title ? 50 : 0)),
          width: boxW,
          height: boxH,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 40px 90px rgba(0,16,40,0.45)',
          transform: `translateY(${(1 - p) * 80}px) scale(${ramp(frame, [0, duration], [1, 1.03])})`,
          opacity: p,
        }}
      >
        <OffthreadVideo src={staticFile(footage.src)} trimBefore={trimBefore} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </DarkBackdrop>
  );
};
