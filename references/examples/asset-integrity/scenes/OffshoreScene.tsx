import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { or, useScene } from '../SceneContext';
import { Kinetic } from '../components/ui';
import { ramp } from '../components/anim';
import { C } from '../theme';

const HORIZON = 700;
const STEEL = '#0a1a33';

/** Flat silhouette of a fixed production platform: jacket, decks, modules, derrick, crane, flare. */
const Platform: React.FC<{ frame: number }> = ({ frame }) => {
  const flicker = 1 + Math.sin(frame / 2.3) * 0.08 + Math.sin(frame / 5.1) * 0.06;
  const blink = Math.floor(frame / 20) % 2 === 0 ? 1 : 0.25;
  const legs: [number, number][] = [
    [790, 830],
    [905, 922],
    [1115, 1098],
    [1230, 1190],
  ];
  return (
    <g>
      {/* jacket legs and bracing */}
      {legs.map(([bottom, top], i) => (
        <line key={i} x1={bottom} y1={HORIZON + 60} x2={top} y2={470} stroke={STEEL} strokeWidth={16} />
      ))}
      {[
        [470, 560],
        [560, 650],
        [650, HORIZON + 40],
      ].map(([y1, y2], row) =>
        [0, 1, 2].map((k) => {
          const xa = (y: number, leg: number) => legs[leg][0] + ((legs[leg][1] - legs[leg][0]) * (HORIZON + 60 - y)) / (HORIZON + 60 - 470);
          return (
            <g key={`${row}-${k}`} stroke={STEEL} strokeWidth={6}>
              <line x1={xa(y1, k)} y1={y1} x2={xa(y2, k + 1)} y2={y2} />
              <line x1={xa(y2, k)} y1={y2} x2={xa(y1, k + 1)} y2={y1} />
              <line x1={xa(y1, k)} y1={y1} x2={xa(y1, k + 1)} y2={y1} />
            </g>
          );
        }),
      )}
      {/* decks */}
      <rect x={760} y={440} width={500} height={34} fill={STEEL} />
      <rect x={775} y={398} width={470} height={24} fill={STEEL} />
      <rect x={790} y={420} width={12} height={22} fill={STEEL} />
      <rect x={1225} y={420} width={12} height={22} fill={STEEL} />
      {/* modules */}
      <rect x={790} y={322} width={140} height={78} fill={STEEL} />
      <rect x={942} y={350} width={120} height={50} fill={STEEL} />
      <rect x={1072} y={296} width={92} height={104} fill={STEEL} />
      <rect x={1174} y={338} width={66} height={62} fill={STEEL} />
      {/* derrick */}
      <polygon points="985,324 1065,324 1036,140 1014,140" fill="none" stroke={STEEL} strokeWidth={9} />
      {[180, 225, 270].map((y) => (
        <line key={y} x1={985 + (y - 140) * 0.0} x2={1065} y1={y} y2={y + 44} stroke={STEEL} strokeWidth={4} />
      ))}
      {/* helideck */}
      <rect x={1235} y={326} width={120} height={14} fill={STEEL} />
      <line x1={1250} y1={340} x2={1240} y2={398} stroke={STEEL} strokeWidth={6} />
      <line x1={1340} y1={340} x2={1240} y2={420} stroke={STEEL} strokeWidth={6} />
      {/* crane */}
      <rect x={1180} y={272} width={18} height={70} fill={STEEL} />
      <line x1={1189} y1={284} x2={1390} y2={182} stroke={STEEL} strokeWidth={8} />
      <line x1={1390} y1={182} x2={1390} y2={250} stroke={STEEL} strokeWidth={2} />
      {/* flare boom and flame */}
      <line x1={792} y1={380} x2={610} y2={236} stroke={STEEL} strokeWidth={9} />
      <line x1={792} y1={410} x2={640} y2={250} stroke={STEEL} strokeWidth={3} />
      <g transform={`translate(604 222) scale(${flicker})`}>
        <ellipse cx={0} cy={-12} rx={16} ry={30} fill="#ffb347" opacity={0.9} />
        <ellipse cx={0} cy={-4} rx={9} ry={18} fill="#ffe3a3" />
      </g>
      {/* lights */}
      <circle cx={1025} cy={136} r={5} fill="#ff4d4d" opacity={blink} />
      <circle cx={1390} cy={180} r={4} fill="#ff4d4d" opacity={1.25 - blink} />
      {[800, 860, 920, 980, 1040, 1100, 1160, 1220].map((x) => (
        <circle key={x} cx={x} cy={457} r={3} fill="#ffd27a" opacity={0.85} />
      ))}
    </g>
  );
};

export const OffshoreScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration, word } = useScene();
  const zoom = ramp(frame, [0, duration], [1, 1.14]);
  const sunY = ramp(frame, [0, duration], [HORIZON + 30, HORIZON - 25]);

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%', transform: `scale(${zoom})`, transformOrigin: '1010px 420px' }}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.baseDeep} />
            <stop offset="0.42" stopColor={C.baseMid} />
            <stop offset="0.72" stopColor={C.primary} />
            <stop offset="0.9" stopColor="#d98f86" />
            <stop offset="1" stopColor="#f2c48f" />
          </linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#24406e" />
            <stop offset="1" stopColor={C.baseDeep} />
          </linearGradient>
          <radialGradient id="sun">
            <stop offset="0" stopColor="#fff1c9" />
            <stop offset="0.35" stopColor="#ffd59a" stopOpacity={0.9} />
            <stop offset="1" stopColor="#ffb37a" stopOpacity={0} />
          </radialGradient>
          <clipPath id="sky-clip">
            <rect x={0} y={0} width={1920} height={HORIZON} />
          </clipPath>
          <clipPath id="sea-clip">
            <rect x={0} y={HORIZON} width={1920} height={1080 - HORIZON} />
          </clipPath>
        </defs>
        <rect width={1920} height={HORIZON} fill="url(#sky)" />
        <g clipPath="url(#sky-clip)">
          <circle cx={1090} cy={sunY} r={420} fill="url(#sun)" opacity={0.75} />
          <circle cx={1090} cy={sunY} r={95} fill="#ffe2ad" />
        </g>
        <rect y={HORIZON} width={1920} height={1080 - HORIZON} fill="url(#sea)" />
        <g clipPath="url(#sea-clip)">
          {/* sun glitter */}
          {Array.from({ length: 14 }, (_, i) => {
            const y = HORIZON + 12 + i * 24;
            const w = 220 - i * 10 + Math.sin((frame + i * 13) / 6) * 30;
            return <rect key={i} x={1090 - w / 2} y={y} width={w} height={5} rx={2.5} fill="#ffd59a" opacity={0.5 - i * 0.03} />;
          })}
          {/* swell */}
          {Array.from({ length: 16 }, (_, i) => {
            const y = HORIZON + 20 + i * 24;
            const x = ((i * 211 + frame * (0.6 + (i % 3) * 0.3)) % 2200) - 200;
            return <rect key={i} x={x} y={y} width={140 + (i % 4) * 60} height={3} rx={1.5} fill={C.white} opacity={0.1} />;
          })}
          {/* reflection */}
          <g transform={`translate(0 ${HORIZON * 2 + 60}) scale(1 -1)`} opacity={0.22}>
            <Platform frame={frame} />
          </g>
        </g>
        <Platform frame={frame} />
      </svg>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(0,20,45,0.55))' }} />
      <div style={{ position: 'absolute', left: 120, bottom: 110 }}>
        <Kinetic text="Somewhere offshore…" start={or(word(/somewhere/), 8)} size={58} weight={700} align="left" stagger={4} />
      </div>
    </AbsoluteFill>
  );
};
