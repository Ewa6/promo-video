import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { or, useScene } from '../SceneContext';
import { enter, fade, pop } from '../components/anim';
import { Icon, type IconName } from '../components/icons';
import { Grid, Kinetic } from '../components/ui';
import { C, DISPLAY, UI } from '../theme';

const STAGES: { name: string; icon: IconName; re: RegExp; angle: number }[] = [
  { name: 'Plan', icon: 'plan', re: /^plan/, angle: -90 },
  { name: 'Inspection', icon: 'inspection', re: /^inspection/, angle: 0 },
  { name: 'Anomaly', icon: 'anomaly', re: /^anomaly/, angle: 90 },
  { name: 'Repair', icon: 'repair', re: /^repair/, angle: 180 },
];
const RING_R = 300;
const ROLES = ['AE', 'MP', 'RS', 'CC', 'IV', 'CL'];

const polar = (angle: number, r: number, cx = 960, cy = 540) => {
  const a = (angle * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};

const arc = (from: number, to: number) => {
  const [x1, y1] = polar(from + 20, RING_R);
  const [x2, y2] = polar(to - 20, RING_R);
  return `M ${x1} ${y1} A ${RING_R} ${RING_R} 0 0 1 ${x2} ${y2}`;
};

const Database: React.FC = () => (
  <svg width={240} height={280} viewBox="0 0 240 280">
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(0 ${i * 78})`}>
        <path d="M10 40 v58 a110 30 0 0 0 220 0 v-58" fill={C.base} />
        <ellipse cx={120} cy={40} rx={110} ry={30} fill={i === 0 ? C.baseMid : C.base} stroke={C.accent} strokeWidth={4} />
      </g>
    ))}
    <circle cx={200} cy={150} r={7} fill={C.highlight} />
    <circle cx={200} cy={228} r={7} fill={C.highlight} />
  </svg>
);

export const LifecycleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beat, word } = useScene();

  const cycleAt = or(beat('cycle'), 0);
  const dbAt = or(beat('database'), Infinity);
  const builtOut = beat('built') === null ? 1 : enter(frame, cycleAt - 8, fps, 16);
  const toSide = enter(frame, dbAt - 4, fps, 24);
  const ringIn = pop(frame, cycleAt - 4, fps);
  const lit = STAGES.map((s, i) => or(word(s.re, 'cycle'), cycleAt + 12 + i * 22));
  const closeLoop = lit[3] + 14;
  const tiles: { label: string; icon: IconName; at: number }[] = [
    { label: 'Pressure vessels', icon: 'vessel', at: or(word(/^pressure/, 'built'), 60) },
    { label: 'Pipework', icon: 'pipework', at: or(word(/^pressure/, 'built'), 60) + 6 },
    { label: 'Structures', icon: 'structure', at: or(word(/^structures/, 'built'), 80) },
  ];
  const versionAt = or(word(/^version/, 'database'), dbAt + 40);
  const whereverAt = or(word(/^wherever/, 'database'), dbAt + 70);
  const DB = { x: 1400, y: 560 };

  return (
    <Grid>
      {/* A — designed by engineers, for pressure systems and structures */}
      {builtOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - builtOut, transform: `translateX(${-240 * builtOut}px)` }}>
          <div style={{ position: 'absolute', left: 140, top: 240, width: 960 }}>
            <Kinetic
              text="Built for inspection teams"
              start={10}
              size={88}
              color={C.base}
              accent={C.primary}
              accentWords={['integrity', 'engineers']}
              align="left"
            />
            <div
              style={{
                marginTop: 34,
                fontFamily: DISPLAY,
                fontWeight: 600,
                fontSize: 40,
                color: C.white,
                opacity: fade(frame, or(word(/^entire/, 'built'), 50)),
              }}
            >
              The entire integrity management cycle.
            </div>
          </div>
          <div style={{ position: 'absolute', left: 1220, top: 210, display: 'flex', flexDirection: 'column', gap: 30 }}>
            {tiles.map((t) => {
              const p = pop(frame, t.at, fps);
              return (
                <div
                  key={t.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 28,
                    width: 520,
                    padding: '22px 30px',
                    borderRadius: 18,
                    background: C.base,
                    transform: `translateX(${(1 - p) * 120}px)`,
                    opacity: Math.min(1, p * 1.5),
                    boxShadow: '0 16px 36px rgba(0,30,60,0.25)',
                  }}
                >
                  <Icon name={t.icon} size={72} color={C.highlight} />
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 38, color: C.white }}>{t.label}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* B — the cycle; C — it moves aside for the database */}
      {frame >= cycleAt - 4 ? (
        <AbsoluteFill
          style={{
            transformOrigin: '960px 540px',
            transform: `translate(${(560 - 960) * toSide}px, ${(500 - 540) * toSide}px) scale(${(1 - 0.36 * toSide) * Math.min(1, 0.6 + 0.4 * ringIn)})`,
          }}
        >
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill={C.base} />
              </marker>
            </defs>
            <circle cx={960} cy={540} r={RING_R} fill="none" stroke={C.white} strokeWidth={3} strokeDasharray="6 14" opacity={0.6} />
            {STAGES.map((s, i) => {
              const next = STAGES[(i + 1) % STAGES.length];
              const to = next.angle <= s.angle ? next.angle + 360 : next.angle;
              const drawAt = i < 3 ? lit[i + 1] - 6 : closeLoop;
              const p = enter(frame, drawAt, fps, 16);
              return (
                <path
                  key={s.name}
                  d={arc(s.angle, to)}
                  fill="none"
                  stroke={C.base}
                  strokeWidth={7}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                  markerEnd={p > 0.95 ? 'url(#arrow)' : undefined}
                />
              );
            })}
          </svg>
          {STAGES.map((s, i) => {
            const [x, y] = polar(s.angle, RING_R);
            const on = pop(frame, lit[i], fps);
            const glow = frame >= lit[i] ? Math.max(0, 1 - (frame - lit[i]) / 30) : 0;
            return (
              <div key={s.name} style={{ position: 'absolute', left: x - 95, top: y - 95, width: 190, height: 190 }}>
                <div
                  style={{
                    width: 190,
                    height: 190,
                    borderRadius: 95,
                    background: frame >= lit[i] ? C.base : 'rgba(255,255,255,0.35)',
                    border: `6px solid ${frame >= lit[i] ? C.primary : 'rgba(255,255,255,0.6)'}`,
                    boxShadow: `0 0 0 ${glow * 26}px rgba(90,79,168,${0.35 * glow})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${frame >= lit[i] ? 0.85 + 0.15 * on : 0.85})`,
                    boxSizing: 'border-box',
                  }}
                >
                  <Icon name={s.icon} size={84} color={frame >= lit[i] ? C.white : C.base} />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: s.angle === 90 ? 200 : s.angle === -90 ? -60 : 200,
                    left: -60,
                    right: -60,
                    textAlign: 'center',
                    fontFamily: DISPLAY,
                    fontWeight: 800,
                    fontSize: 38,
                    color: C.base,
                    opacity: frame >= lit[i] ? 1 : 0.4,
                  }}
                >
                  {s.name}
                </div>
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: 760,
              top: 470,
              width: 400,
              textAlign: 'center',
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 46,
              lineHeight: 1.1,
              color: C.white,
              opacity: fade(frame, closeLoop),
            }}
          >
            One integrity cycle
          </div>
        </AbsoluteFill>
      ) : null}

      {frame >= dbAt - 4 ? (
        <AbsoluteFill>
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
            <line x1={760} y1={500} x2={DB.x - 120} y2={DB.y} stroke={C.base} strokeWidth={5} strokeDasharray="4 12" opacity={fade(frame, dbAt + 8)} />
            {[0, 1, 2].map((k) => {
              const t = (((frame - dbAt) / 36 + k / 3) % 1 + 1) % 1;
              return (
                <circle key={k} cx={760 + (DB.x - 120 - 760) * t} cy={500 + (DB.y - 500) * t} r={10} fill={C.accent} opacity={fade(frame, dbAt + 12)} />
              );
            })}
            {ROLES.map((r, i) => {
              const [x, y] = polar(-165 + i * 30, 330, DB.x, DB.y);
              const p = fade(frame, whereverAt + i * 3, 10);
              return <line key={r} x1={DB.x} y1={DB.y} x2={x} y2={y} stroke={C.base} strokeWidth={3} opacity={0.5 * p} />;
            })}
          </svg>
          <div
            style={{
              position: 'absolute',
              left: DB.x - 120,
              top: DB.y - 140,
              transform: `scale(${pop(frame, dbAt + 2, fps)})`,
            }}
          >
            <Database />
          </div>
          <div
            style={{
              position: 'absolute',
              left: DB.x - 300,
              top: DB.y + 175,
              width: 600,
              textAlign: 'center',
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 40,
              color: C.base,
              opacity: fade(frame, dbAt + 10),
            }}
          >
            One central cloud database
          </div>
          {ROLES.map((r, i) => {
            const [x, y] = polar(-165 + i * 30, 330, DB.x, DB.y);
            const p = pop(frame, whereverAt + i * 3, fps);
            return (
              <div
                key={r}
                style={{
                  position: 'absolute',
                  left: x - 44,
                  top: y - 44,
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  background: '#6E89A0',
                  boxShadow: `0 0 0 4px ${C.primary}, 0 10px 20px rgba(0,30,60,0.3)`,
                  color: C.white,
                  fontFamily: UI,
                  fontSize: 26,
                  fontWeight: 700,
                  display: frame >= whereverAt + i * 3 ? 'flex' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${p})`,
                }}
              >
                {r}
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 900 }}>
            {frame >= versionAt ? (
              <Kinetic text="One version of the truth." start={versionAt} size={70} color={C.base} accent={C.white} accentWords={['truth']} />
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}
    </Grid>
  );
};
