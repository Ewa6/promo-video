import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { or, useScene } from '../SceneContext';
import { enter, fade, pop } from '../components/anim';
import { Card, Grid } from '../components/ui';
import { C, DISPLAY } from '../theme';

interface Callout {
  at: number;
  marker: [number, number];
  card: { left: number; top: number; width: number };
  title: string;
  detail: string;
  accent: string;
}

/** Horizontal pressure vessel on saddles, drawn in a flat illustration style. */
const Vessel: React.FC = () => (
  <g>
    <line x1={260} y1={760} x2={1660} y2={760} stroke={C.white} strokeWidth={4} opacity={0.6} />
    {[600, 1320].map((x) => (
      <polygon key={x} points={`${x - 60},680 ${x + 60},680 ${x + 92},760 ${x - 92},760`} fill={C.primary} />
    ))}
    {/* nozzles */}
    {[560, 1360].map((x) => (
      <g key={x}>
        <rect x={x - 24} y={334} width={48} height={50} fill={C.baseMid} />
        <rect x={x - 40} y={322} width={80} height={16} rx={3} fill={C.baseMid} />
      </g>
    ))}
    <rect x={372} y={500} width={52} height={60} fill={C.baseMid} />
    <rect x={358} y={488} width={16} height={84} rx={3} fill={C.baseMid} />
    {/* shell */}
    <rect x={420} y={380} width={1080} height={300} rx={150} fill={C.base} />
    <rect x={500} y={402} width={920} height={34} rx={17} fill={C.white} opacity={0.08} />
    {[620, 960, 1300].map((x) => (
      <line key={x} x1={x} y1={384} x2={x} y2={676} stroke={C.white} strokeWidth={4} strokeDasharray="10 9" opacity={0.35} />
    ))}
    <rect x={900} y={600} width={120} height={42} rx={6} fill={C.white} opacity={0.92} />
    <text x={960} y={629} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize={24} fill={C.base}>
      V-210
    </text>
  </g>
);

export const VesselScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { word, duration } = useScene();

  const callouts: Callout[] = [
    {
      at: or(word(/^weld/), 20),
      marker: [620, 450],
      card: { left: 150, top: 110, width: 420 },
      title: 'Weld W-03',
      detail: 'MPI · no recordable indications',
      accent: C.teal,
    },
    {
      at: or(word(/^thickness/), 45),
      marker: [1180, 470],
      card: { left: 1330, top: 110, width: 440 },
      title: 'Wall thickness',
      detail: '11.8 mm · nominal 12.7 mm',
      accent: C.primary,
    },
    {
      at: or(word(/^inspection/), 70),
      marker: [960, 540],
      card: { left: 750, top: 70, width: 420 },
      title: 'Last inspection',
      detail: 'GVI · fair condition',
      accent: C.accent,
    },
  ];

  const storyAt = or(word(/^story/), duration - 60);
  const history = ['2009 · Installed', '2014 · CVI', '2019 · UT survey', '2024 · GVI'];
  const intro = enter(frame, 0, fps, 24);

  return (
    <Grid>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g transform={`translate(960 560) scale(${0.9 + 0.1 * intro}) translate(-960 -560)`} opacity={intro}>
          <Vessel />
        </g>
        {callouts.map((c) => {
          const p = fade(frame, c.at, 14);
          const cx = c.card.left + c.card.width / 2;
          const cy = c.card.top + 108;
          const ring = ((frame - c.at) % 40) / 40;
          return (
            <g key={c.title} opacity={p}>
              <line
                x1={cx}
                y1={cy}
                x2={c.marker[0]}
                y2={c.marker[1]}
                stroke={C.white}
                strokeWidth={3}
                strokeDasharray={400}
                strokeDashoffset={400 * (1 - p)}
              />
              <circle cx={c.marker[0]} cy={c.marker[1]} r={14} fill={c.accent} stroke={C.white} strokeWidth={4} />
              {frame > c.at ? (
                <circle cx={c.marker[0]} cy={c.marker[1]} r={14 + ring * 34} fill="none" stroke={c.accent} strokeWidth={3} opacity={1 - ring} />
              ) : null}
            </g>
          );
        })}
      </svg>
      {callouts.map((c) => {
        const p = pop(frame, c.at, fps);
        return (
          <Card
            key={c.title}
            accent={c.accent}
            style={{
              position: 'absolute',
              left: c.card.left,
              top: c.card.top,
              width: c.card.width,
              opacity: Math.min(1, p * 1.5),
              transform: `translateY(${(1 - p) * 30}px) scale(${0.85 + 0.15 * p})`,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 32, color: C.base }}>{c.title}</div>
            <div style={{ fontWeight: 500, fontSize: 25, color: C.muted, marginTop: 6 }}>{c.detail}</div>
          </Card>
        );
      })}
      {/* the asset's history, read as one story */}
      <div style={{ position: 'absolute', left: 260, right: 260, top: 860, height: 120 }}>
        <div
          style={{
            position: 'absolute',
            top: 22,
            left: 0,
            height: 5,
            borderRadius: 3,
            background: C.base,
            width: `${enter(frame, storyAt, fps, 30) * 100}%`,
          }}
        />
        {history.map((label, i) => {
          const p = pop(frame, storyAt + 6 + i * 6, fps);
          return (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: `${(i / (history.length - 1)) * 100}%`,
                transform: `translateX(-50%) scale(${p})`,
                opacity: Math.min(1, p),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 24, background: C.white, border: `6px solid ${C.base}` }} />
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, color: C.base, whiteSpace: 'nowrap' }}>{label}</div>
            </div>
          );
        })}
      </div>
    </Grid>
  );
};
