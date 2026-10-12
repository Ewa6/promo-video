import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fade, pop } from '../components/anim';
import { useLayout } from '../components/layout';
import { DarkBackdrop, Footnote } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { C, DISPLAY } from '../brand';

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub?: string;
  /** The spoken word that starts the count-up, e.g. "seventy-five". */
  cue?: string;
  /** Gauge fill 0–100 (defaults to value, capped at 100). */
  fill?: number;
}

/**
 * Count-up gauges. props: { items: Stat[] (1–3), source: string (shown on screen — no number
 * without a source), only?: number[] (indexes to show in this cut) }
 */
export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue } = useScene();
  const { u, narrow } = useLayout();
  const all = (props.items as Stat[]) ?? [];
  const only = props.only as number[] | undefined;
  const stats = only ? all.filter((_, i) => only.includes(i)) : all.slice(0, 3);
  const portrait = narrow && stats.length > 1;
  const R = (stats.length === 3 && !portrait ? 160 : portrait && stats.length > 1 ? 150 : 200) * u;
  const CIRC = 2 * Math.PI * R;

  return (
    <DarkBackdrop>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: portrait ? 'column' : 'row', gap: (portrait ? 80 : stats.length === 3 ? 120 : 220) * u }}>
        {stats.map((s, i) => {
          const at = or(cue(s.cue), 20 + i * 40);
          const p = pop(frame, 4 + i * 6, fps);
          // the gauge runs up to the spoken number and lands just after it
          const t = interpolate(frame, [Math.max(2, at - 22), at + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
          const shown = s.value * t;
          const decimals = Number.isInteger(s.value) ? 0 : 1;
          const fill = Math.min(100, s.fill ?? s.value) * t;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: portrait ? 'row' : 'column',
                alignItems: 'center',
                gap: 34 * u,
                transform: `scale(${0.7 + 0.3 * Math.min(p, 1.05)})`,
                opacity: Math.min(1, p * 1.6),
              }}
            >
              <div style={{ position: 'relative', width: 2 * R + 40, height: 2 * R + 40 }}>
                <svg width={2 * R + 40} height={2 * R + 40} style={{ transform: 'rotate(-90deg)' }}>
                  <defs>
                    <linearGradient id={`g-${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor={C.primaryLight} />
                      <stop offset="1" stopColor={C.accent} />
                    </linearGradient>
                  </defs>
                  <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={28 * u} />
                  <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={`url(#g-${i})`} strokeWidth={28 * u} strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - fill / 100)} />
                </svg>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: R * 0.72, color: C.white, lineHeight: 1, whiteSpace: 'nowrap' }}>
                    {s.prefix ? <span style={{ fontSize: R * 0.38, color: C.highlight }}>{s.prefix}</span> : null}
                    {shown.toFixed(decimals)}
                    {s.suffix ? <span style={{ fontSize: R * 0.38, color: C.highlight }}>{s.suffix}</span> : null}
                  </div>
                </AbsoluteFill>
              </div>
              <div style={{ textAlign: portrait ? 'left' : 'center', fontFamily: DISPLAY, maxWidth: portrait ? 420 : 2 * R + 120 }}>
                <div style={{ fontWeight: 800, fontSize: 52 * u, color: C.white, lineHeight: 1.1 }}>{s.label}</div>
                {s.sub ? <div style={{ fontWeight: 600, fontSize: 34 * u, color: C.softLight, marginTop: 6 }}>{s.sub}</div> : null}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Footnote opacity={fade(frame, 20)}>{(props.source as string) ?? 'SOURCE MISSING'}</Footnote>
    </DarkBackdrop>
  );
};
