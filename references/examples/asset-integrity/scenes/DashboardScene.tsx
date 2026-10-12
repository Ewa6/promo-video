import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { or, useScene } from '../SceneContext';
import { enter, fade, pop } from '../components/anim';
import { AppWindow, Cursor, Grid, Kinetic, DarkGrid, Pill } from '../components/ui';
import { C, DISPLAY, UI } from '../theme';

// Window geometry, so the cursor can find the bar it clicks.
const WIN = { left: 180, top: 200, width: 1560, height: 820 };
const CONTENT_TOP = WIN.top + 40 + 68;
const BAR_CARD = { left: 470, top: 225, width: 620 };
const BARS = [
  [140, 60, 20],
  [110, 40, 10],
  [150, 100, 50],
  [80, 30, 10],
  [130, 90, 30],
  [120, 45, 15],
];
const GROUPS = ['HC-1', 'HC-2', 'HC-3', 'NHC-1', 'NHC-2', 'Util.'];
const CLICKED = 2;
const barX = (i: number) => 30 + i * 90;
const target = {
  x: WIN.left + BAR_CARD.left + 24 + barX(CLICKED) + 30,
  y: CONTENT_TOP + BAR_CARD.top + 70 + 340 - (BARS[CLICKED][0] + BARS[CLICKED][1] + BARS[CLICKED][2]) / 2,
};
const TREND = [42, 44, 41, 45, 47, 46, 43, 40, 38, 36, 35, 33];
const DRILL = [
  ['V-210 Inlet Scrubber', 'RA-1231'],
  ['4"-P-2210 Process gas', 'RA-1198'],
  ['E-415 Lube Oil Cooler', 'RA-1207'],
  ['V-330 Flash Drum', 'RA-1244'],
];

const ChartCard: React.FC<{ title: string; left: number; width: number; children: ReactNode }> = ({ title, left, width, children }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top: 225,
      width,
      height: 460,
      background: C.white,
      borderRadius: 12,
      boxShadow: '0 4px 14px rgba(0,30,60,0.08)',
      padding: 24,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 700, color: C.base }}>{title}</div>
    {children}
  </div>
);

const count = (frame: number, at: number, value: number) =>
  Math.round(interpolate(frame, [at, at + 30], [0, value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }));

/** "What's the condition of our plant?" answered by the live Condition / RBI dashboards, with a click-through. */
export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, word, beat, has } = useScene();
  const question = props.question as string | undefined;

  const dashAt = question ? or(beat('answer'), 70) : 0;
  const d = frame - dashAt;
  const windowIn = enter(frame, dashAt, fps, 24);
  const clickAt = or(word(/^click/), dashAt + 50);
  const drill = enter(frame, clickAt + 4, fps, 18);
  const chips = has('answer')
    ? [
        { text: 'Live dashboards', at: or(word(/^dashboards/, 'answer'), dashAt + 60) },
        { text: 'Real risk', at: or(word(/^risk/, 'answer'), dashAt + 75) },
        { text: 'Real data', at: or(word(/^data/, 'answer'), dashAt + 90) },
      ]
    : [{ text: (props.chip as string) ?? 'Live visibility', at: or(word(/^(live|visibility)/), dashAt + 10) }];

  const total = [87, 14, 41, 32];
  const donut = [
    { v: 14, c: C.high },
    { v: 41, c: C.medium },
    { v: 32, c: C.low },
  ];
  const donutP = enter(frame, dashAt + 14, fps, 30);

  return (
    <AbsoluteFill>
      {frame >= dashAt - 2 ? (
        <DarkGrid>
          <AppWindow
            width={WIN.width}
            height={WIN.height}
            active="Dashboards"
            style={{
              position: 'absolute',
              left: WIN.left,
              top: WIN.top,
              transform: `translateY(${(1 - windowIn) * 120}px) scale(${0.94 + 0.06 * windowIn})`,
              opacity: windowIn,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, fontFamily: UI }}>
              <div style={{ position: 'absolute', left: 30, top: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 30, fontWeight: 700, color: C.base, marginRight: 16 }}>Condition Dashboard</div>
                {['All systems', 'Hydrocarbon', 'SCE'].map((f, i) => (
                  <div
                    key={f}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 999,
                      fontSize: 18,
                      border: `2px solid ${i === 1 ? C.base : C.hairline}`,
                      color: i === 1 ? C.base : C.muted,
                      fontWeight: i === 1 ? 700 : 400,
                    }}
                  >
                    {f}
                  </div>
                ))}
              </div>
              {[
                ['Total equipment items', 4812, C.base],
                ['Risk-based assessments', 1236, C.primary],
                ['Open anomalies', total[0], C.high],
                ['Overdue < 90 days', 12, C.medium],
              ].map(([label, value, colour], i) => (
                <div
                  key={label as string}
                  style={{
                    position: 'absolute',
                    left: 30 + i * 380,
                    top: 80,
                    width: 360,
                    height: 120,
                    background: C.white,
                    borderRadius: 12,
                    borderTop: `5px solid ${colour as string}`,
                    boxShadow: '0 4px 14px rgba(0,30,60,0.08)',
                    padding: '16px 22px',
                    boxSizing: 'border-box',
                    opacity: fade(frame, dashAt + 6 + i * 3),
                  }}
                >
                  <div style={{ fontSize: 19, color: C.muted }}>{label}</div>
                  <div style={{ fontSize: 46, fontWeight: 700, color: C.ink, marginTop: 6 }}>
                    {count(frame, dashAt + 8 + i * 3, value as number).toLocaleString('en-GB')}
                  </div>
                </div>
              ))}

              <ChartCard title="Anomalies by risk" left={30} width={420}>
                <svg width={372} height={360} viewBox="0 0 372 360">
                  {(() => {
                    let acc = 0;
                    const sum = donut.reduce((a, s) => a + s.v, 0);
                    const r = 120;
                    const circ = 2 * Math.PI * r;
                    return donut.map((s) => {
                      const len = (s.v / sum) * circ * donutP;
                      const el = (
                        <circle
                          key={s.c}
                          cx={186}
                          cy={190}
                          r={r}
                          fill="none"
                          stroke={s.c}
                          strokeWidth={46}
                          strokeDasharray={`${len} ${circ}`}
                          strokeDashoffset={-acc}
                          transform="rotate(-90 186 190)"
                        />
                      );
                      acc += len;
                      return el;
                    });
                  })()}
                  <text x={186} y={190} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={52} fill={C.ink}>
                    {count(frame, dashAt + 14, total[0])}
                  </text>
                  <text x={186} y={224} textAnchor="middle" fontFamily={UI} fontSize={20} fill={C.muted}>
                    open
                  </text>
                </svg>
              </ChartCard>

              <ChartCard title="Risk distribution by system group" left={BAR_CARD.left} width={BAR_CARD.width}>
                <div style={{ position: 'absolute', left: 24, top: 70, width: 572, height: 340, borderBottom: `2px solid ${C.hairline}` }}>
                  {BARS.map((stack, i) => {
                    const g = enter(frame, dashAt + 16 + i * 3, fps, 22);
                    const highlighted = i === CLICKED && frame >= clickAt;
                    return (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          left: barX(i),
                          bottom: 0,
                          width: 60,
                          display: 'flex',
                          flexDirection: 'column-reverse',
                          outline: highlighted ? `4px solid ${C.accent}` : undefined,
                          outlineOffset: 4,
                        }}
                      >
                        {[C.low, C.medium, C.high].map((col, k) => (
                          <div key={col} style={{ height: stack[k] * g, background: col }} />
                        ))}
                        <div style={{ position: 'absolute', top: '100%', marginTop: 8, width: 80, left: -10, textAlign: 'center', fontSize: 16, color: C.muted }}>
                          {GROUPS[i]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ChartCard>

              <ChartCard title="Risk trend" left={1110} width={420}>
                <svg width={372} height={360} viewBox="0 0 372 360" style={{ marginTop: 10 }}>
                  {[0, 1, 2, 3].map((k) => (
                    <line key={k} x1={0} x2={372} y1={60 + k * 80} y2={60 + k * 80} stroke={C.hairline} strokeWidth={2} />
                  ))}
                  <polyline
                    points={TREND.map((v, i) => `${10 + i * 32},${340 - (v - 25) * 11}`).join(' ')}
                    fill="none"
                    stroke={C.primary}
                    strokeWidth={6}
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - enter(frame, dashAt + 20, fps, 36)}
                  />
                </svg>
              </ChartCard>

              {frame >= clickAt ? (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: 560,
                    background: C.white,
                    boxShadow: '-20px 0 40px rgba(0,30,60,0.2)',
                    transform: `translateX(${(1 - drill) * 600}px)`,
                    padding: 30,
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ fontSize: 18, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Drill-down</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.base, margin: '6px 0 20px' }}>High risk · HC-3</div>
                  {DRILL.map(([item, rbi], i) => (
                    <div
                      key={rbi}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '18px 0',
                        borderTop: `1px solid ${C.hairline}`,
                        opacity: fade(frame, clickAt + 10 + i * 4),
                      }}
                    >
                      <div style={{ width: 16, height: 16, borderRadius: 8, background: C.high }} />
                      <div style={{ flex: 1, fontSize: 22, color: C.ink, fontWeight: 700 }}>{item}</div>
                      <div style={{ fontSize: 19, color: C.blue }}>{rbi}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </AppWindow>
          <Cursor
            path={[
              { x: 1500, y: 1000, at: dashAt + 24 },
              { x: target.x + 10, y: target.y, at: clickAt - 18 },
            ]}
            clicks={[clickAt]}
          />
          <div style={{ position: 'absolute', top: 64, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 26 }}>
            {chips.map((c) => {
              if (frame < c.at) return null;
              const p = pop(frame, c.at, fps);
              return (
                <div key={c.text} style={{ transform: `scale(${p})` }}>
                  <Pill bg={C.white} color={C.base} style={{ fontSize: 36 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 8, background: d % 30 < 18 ? C.low : '#9be0b4' }} />
                    {c.text}
                  </Pill>
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', right: WIN.left + 10, top: WIN.top - 34, fontFamily: DISPLAY, fontSize: 18, color: C.white, opacity: 0.5 }}>
            Illustrative data
          </div>
        </DarkGrid>
      ) : null}

      {question && frame < dashAt + 12 ? (
        <AbsoluteFill style={{ opacity: 1 - fade(frame, dashAt - 4, 14) }}>
          <Grid>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: 1360,
                  padding: '70px 80px',
                  background: C.white,
                  borderRadius: 40,
                  boxShadow: '0 30px 60px rgba(0,30,60,0.25)',
                  transform: `scale(${0.8 + 0.2 * Math.min(1.05, pop(frame, 4, fps))})`,
                }}
              >
                <Kinetic text={`“${question}”`} start={12} size={84} color={C.base} accent={C.primary} accentWords={['condition', 'now']} stagger={3} />
                <div
                  style={{
                    position: 'absolute',
                    left: 180,
                    bottom: -60,
                    width: 0,
                    height: 0,
                    borderLeft: '40px solid transparent',
                    borderRight: '40px solid transparent',
                    borderTop: `70px solid ${C.white}`,
                  }}
                />
              </div>
            </AbsoluteFill>
          </Grid>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
