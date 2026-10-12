import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { enter, fade, pop, ramp } from '../components/anim';
import { useLayout } from '../components/layout';
import { DarkBackdrop, Kinetic, Logo, PaperBackdrop } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { BRAND, C, DISPLAY } from '../brand';

/**
 * Two-line tagline with a tick drawing itself on the last word.
 * props: { line1: string, line2?: string, line2Cue?: string, tickCue?: string, tick?: boolean (default true) }
 */
export const TaglineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue } = useScene();
  const { u, w, portrait } = useLayout();
  const line1 = (props.line1 as string) ?? '';
  const line2 = props.line2 as string | undefined;
  const showTick = (props.tick as boolean | undefined) ?? true;
  const secondAt = or(cue(props.line2Cue), 40);
  const tickAt = or(cue(props.tickCue), secondAt + 14);
  const tick = enter(frame, tickAt, fps, 14);
  const size = Math.min(112, ((portrait ? 1.6 : 2.4) * w) / Math.max(line1.length, (line2 ?? '').length + 3, 10)) * u;

  return (
    <DarkBackdrop>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 10, padding: 60 }}>
        <Kinetic text={line1} start={6} size={size} stagger={4} style={{ maxWidth: w * 0.88 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 * u, minHeight: size * 1.35, flexWrap: 'wrap', justifyContent: 'center' }}>
          {line2 && frame >= secondAt ? <Kinetic text={line2} start={secondAt} size={size} color={C.highlight} stagger={4} /> : null}
          {showTick ? (
            <svg width={size * 1.15} height={size * 1.15} viewBox="0 0 48 48" style={{ opacity: fade(frame, tickAt - 6, 8) }}>
              <rect x={4} y={4} width={40} height={40} rx={6} fill="none" stroke={C.white} strokeWidth={3} />
              <path d="M12 25l8 8 18-20" fill="none" stroke={C.highlight} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
            </svg>
          ) : null}
        </div>
      </AbsoluteFill>
    </DarkBackdrop>
  );
};

/**
 * Colour logo on paper with a line under it.
 * props: { line?: string, lineCue?: string, accent?: string[], showUrl?: boolean }
 */
export const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue, duration } = useScene();
  const { u, w, portrait } = useLayout();
  const line = props.line as string | undefined;
  const logo = pop(frame, 4, fps);
  const lineAt = or(cue(props.lineCue), 40) - 6;
  const zoom = ramp(frame, [0, duration], [1, 1.04]);

  return (
    <PaperBackdrop>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 56 * u, transform: `scale(${zoom})`, padding: 60 }}>
        <div style={{ transform: `scale(${0.75 + 0.25 * logo})`, opacity: Math.min(1, logo * 1.6) }}>
          <Logo width={(portrait ? 0.82 : 0.52) * w} />
        </div>
        <div style={{ minHeight: 90 * u }}>
          {line && frame >= lineAt ? (
            <Kinetic text={line} start={lineAt} size={(portrait ? 62 : 72) * u} color={C.bg} accentColor={C.primary} accent={props.accent as string[] | undefined} weight={700} style={{ maxWidth: w * 0.88 }} />
          ) : null}
        </div>
      </AbsoluteFill>
      {props.showUrl ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 70 * u, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 700, fontSize: 34 * u, color: C.muted, opacity: fade(frame, lineAt + 20) }}>
          {BRAND.url}
        </div>
      ) : null}
    </PaperBackdrop>
  );
};

/**
 * End card: white logo, stacked closing lines, call to action.
 * props: { lines?: { text: string, cue?: string, strong?: boolean }[], cta?: string (default BRAND.cta), ctaSize?: number (default 40) }
 */
export const EndCardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue } = useScene();
  const { u, w, narrow: portrait } = useLayout();
  const lines = (props.lines as { text: string; cue?: string; strong?: boolean }[]) ?? [];
  const cta = (props.cta as string | undefined) ?? BRAND.cta;
  let prev = -2;
  const ats = lines.map((l) => (prev = or(cue(l.cue), prev + 8)));
  const lastAt = ats.length ? ats[ats.length - 1] : 20;
  const size = (portrait ? 70 : 78) * u;

  return (
    <DarkBackdrop>
      <AbsoluteFill style={{ flexDirection: portrait ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: (portrait ? 70 : 90) * u, padding: 60 }}>
        <div style={{ opacity: fade(frame, 2, 18) }}>
          <Logo width={(portrait ? 0.7 : 0.32) * w} variant="white" />
        </div>
        {lines.length ? <div style={portrait ? { width: 300, height: 4, background: 'rgba(255,255,255,0.25)' } : { width: 4, height: 300, background: 'rgba(255,255,255,0.25)', borderRadius: 2 }} /> : null}
        {lines.length ? (
          <div style={{ textAlign: portrait ? 'center' : 'left', fontFamily: DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.08, maxWidth: portrait ? w * 0.85 : w * 0.45 }}>
            {lines.map((l, i) => {
              const p = enter(frame, ats[i], fps, 18);
              return (
                <div key={i} style={{ color: l.strong || i === lines.length - 1 ? C.white : C.softLight, opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
                  {l.text}
                </div>
              );
            })}
          </div>
        ) : null}
      </AbsoluteFill>
      {cta ? (
        <div style={{ position: 'absolute', left: 40, right: 40, bottom: 80 * u, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 700, fontSize: ((props.ctaSize as number | undefined) ?? 40) * u, color: C.white, opacity: fade(frame, lastAt + 16, 20) }}>
          {cta}
        </div>
      ) : null}
    </DarkBackdrop>
  );
};
