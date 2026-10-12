import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ReactNode } from 'react';
import { C } from './brand';
import { Captions } from './Captions';
import { CaptionSafeContext, captionSafe } from './components/layout';
import { FOOTAGE, MUSIC } from './footage';
import { SceneProvider } from './SceneContext';
import { FootageScene } from './scenes/FootageScene';
import { SCENES } from './scenes';
import { CUTS, type CutId } from './script';
import { LEAD_SECONDS, buildTimeline, groupSections } from './timeline';
import { TIMINGS, assertTimingsMatchScript } from './timings';

export const FPS = 30;
export const DIMENSIONS = {
  landscape: { width: 1920, height: 1080 },
  portrait: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
} as const;

/** Each scene fades in over the end of the previous one. */
const CROSSFADE = 10;

const timelineOf = (cut: CutId) => buildTimeline(CUTS[cut].sections, TIMINGS[cut], CUTS[cut].tail);

export const cutDurationInFrames = (cut: CutId) => {
  assertTimingsMatchScript(cut);
  return Math.ceil((timelineOf(cut).timings.duration + CUTS[cut].tail) * FPS);
};

const FadeIn: React.FC<{ frames: number; children: ReactNode }> = ({ frames, children }) => {
  const frame = useCurrentFrame();
  const opacity = frames ? interpolate(frame, [0, frames], [0, 1], { extrapolateRight: 'clamp' }) : 1;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const PromoCut: React.FC<{ cut: CutId }> = ({ cut }) => {
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const { timings, segments } = timelineOf(cut);
  const groups = groupSections(CUTS[cut].sections);
  const starts = groups.map((g, i) => (i === 0 ? 0 : Math.round((timings.sections[g.sections[0].id].start - LEAD_SECONDS) * fps)));
  const tailStart = Math.round(timings.duration * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <CaptionSafeContext.Provider value={CUTS[cut].captions ? captionSafe(width, height) : 0}>
      {groups.map((group, i) => {
        const from = Math.max(0, starts[i] - (i > 0 ? CROSSFADE : 0));
        const until = i + 1 < groups.length ? starts[i + 1] : durationInFrames;
        const Scene = SCENES[group.scene];
        if (!Scene) throw new Error(`Unknown scene "${group.scene}" in cut ${cut}. Register it in src/scenes/index.ts.`);
        const footage = FOOTAGE[group.sections[0].id] ?? FOOTAGE[group.scene];
        return (
          <Sequence key={`${group.scene}-${i}`} name={`${group.scene} (${group.sections.map((s) => s.id).join(', ')})`} from={from} durationInFrames={until - from}>
            <SceneProvider
              value={{
                fromSec: from / fps,
                duration: until - from,
                sectionIds: group.sections.map((s) => s.id),
                timings,
                props: Object.assign({}, ...group.sections.map((s) => s.props ?? {})),
              }}
            >
              <FadeIn frames={i > 0 ? CROSSFADE : 0}>{footage ? <FootageScene footage={footage} /> : <Scene />}</FadeIn>
            </SceneProvider>
          </Sequence>
        );
      })}
      </CaptionSafeContext.Provider>
      {timings.audio
        ? segments.map((seg, i) => {
            // one take, split only where a section asked for a hold; the last piece runs to its end
            const len = Math.round((seg.to - seg.from) * fps);
            return (
              <Sequence key={`vo-${i}`} name={`voice ${seg.from.toFixed(2)}–${seg.to.toFixed(2)}s`} from={Math.round(seg.at * fps)} durationInFrames={i + 1 < segments.length ? len : undefined} layout="none">
                <Audio src={staticFile(timings.audio!)} trimBefore={Math.round(seg.from * fps)} />
              </Sequence>
            );
          })
        : null}
      {MUSIC ? (
        <Audio
          src={staticFile(MUSIC.src)}
          volume={MUSIC.volume * interpolate(frame, [tailStart, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      ) : null}
      {CUTS[cut].captions ? <Captions words={timings.words} /> : null}
    </AbsoluteFill>
  );
};
