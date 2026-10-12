import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { or, useScene } from '../SceneContext';
import { enter, fade, pop } from '../components/anim';
import { Grid } from '../components/ui';
import { C, DISPLAY, UI } from '../theme';

const riskColour = (r: number, c: number) => (r + c >= 7 ? C.high : r + c >= 4 ? C.medium : C.low);

const Panel: React.FC<{ title: string; at: number; left: number; children: ReactNode; lift: number }> = ({ title, at, left, children, lift }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, at, fps);
  if (frame < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: 130 - 40 * lift,
        width: 500,
        height: 470,
        background: C.white,
        borderRadius: 20,
        boxShadow: '0 24px 50px rgba(0,30,60,0.25)',
        padding: 30,
        boxSizing: 'border-box',
        transform: `translateY(${(1 - p) * 60}px) scale(${(0.8 + 0.2 * Math.min(p, 1.05)) * (1 - 0.1 * lift)})`,
        transformOrigin: '50% 0',
        opacity: Math.min(1, p * 1.5),
        fontFamily: UI,
      }}
    >
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 33, color: C.base, marginBottom: 22 }}>{title}</div>
      {children}
    </div>
  );
};

/** RBI, anomaly risk ranking and inspection certificates under one controlled workflow with sign-off, revisions and audit trail. */
export const ControlScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { word, beat } = useScene();

  const rbiAt = or(word(/^risk-based/), 6);
  const rankAt = or(word(/^ranking/), rbiAt + 30);
  const coeAt = or(word(/^certificates/), rankAt + 30);
  const auditBeat = beat('audit');
  const lift = auditBeat === null ? 0 : enter(frame, auditBeat, fps, 22);
  const signAt = word(/^sign-off/);
  const revisionAt = word(/^revision/);
  // "audit trail" closes the sentence, so start typing it from "history" to give it screen time
  const historyAt = word(/^history/);
  const trailAt = historyAt === null ? word(/^audit/) : historyAt + 6;
  const marker = enter(frame, rbiAt + 10, fps, 20);
  const ranked = frame >= rankAt + 16;

  const trail = [
    ['09:41', 'Integrity Lead', 'approved RA-1231'],
    ['10:02', 'Site Supervisor', 'closed DEF-0388'],
    ['10:15', 'Operator', 'endorsed DEF-0417'],
  ];

  return (
    <Grid>
      <Panel title="Risk-Based Inspection" at={rbiAt} left={150} lift={lift}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 64px)', gap: 6, position: 'relative', marginLeft: 40 }}>
          {Array.from({ length: 25 }, (_, k) => {
            const r = 4 - Math.floor(k / 5);
            const c = k % 5;
            return <div key={k} style={{ height: 56, borderRadius: 6, background: riskColour(r, c), opacity: 0.85 }} />;
          })}
          <div
            style={{
              position: 'absolute',
              left: 70 * (0.5 + 2.6 * marker) - 18,
              top: 62 * (4.4 - 2.4 * marker) - 18,
              width: 36,
              height: 36,
              borderRadius: 18,
              background: C.base,
              border: `5px solid ${C.white}`,
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            }}
          />
        </div>
        <div style={{ marginTop: 16, marginLeft: 40, fontSize: 19, color: C.muted }}>Consequence × likelihood</div>
      </Panel>

      <Panel title="Anomaly Risk Ranking" at={rankAt} left={710} lift={lift}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>DEF-0417</div>
        <div style={{ fontSize: 20, color: C.muted, marginTop: 4 }}>Coating breakdown at flange</div>
        {[
          ['Consequence', 0.6],
          ['Likelihood', 0.55],
        ].map(([label, v], i) => (
          <div key={label as string} style={{ marginTop: 26 }}>
            <div style={{ fontSize: 19, color: C.muted, marginBottom: 8 }}>{label}</div>
            <div style={{ height: 16, borderRadius: 8, background: '#e9edf1', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(v as number) * 100 * enter(frame, rankAt + 6 + i * 5, fps, 18)}%`, background: C.medium }} />
            </div>
          </div>
        ))}
        <div
          style={{
            marginTop: 34,
            display: 'inline-block',
            padding: '12px 26px',
            borderRadius: 999,
            fontSize: 24,
            fontWeight: 700,
            color: ranked ? C.ink : C.muted,
            background: ranked ? C.medium : '#e9edf1',
            transform: `scale(${ranked ? pop(frame, rankAt + 16, fps) : 1})`,
          }}
        >
          {ranked ? 'Medium risk' : 'Unranked'}
        </div>
      </Panel>

      <Panel title="Inspection Certificate" at={coeAt} left={1270} lift={lift}>
        <div style={{ position: 'relative', height: 330, borderRadius: 10, border: `2px solid ${C.hairline}`, padding: 22, boxSizing: 'border-box' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.base }}>CRT-1098 · V-330</div>
          {[0.9, 0.75, 0.85, 0.6].map((w, i) => (
            <div key={i} style={{ height: 10, borderRadius: 5, background: '#e2e7ec', width: `${w * 100}%`, marginTop: 18 }} />
          ))}
          <div style={{ marginTop: 26, fontSize: 20, color: C.ink }}>Fit for continued service</div>
          <svg width={92} height={92} style={{ position: 'absolute', right: 20, bottom: 20 }}>
            <circle cx={46} cy={46} r={40} fill="none" stroke={C.primary} strokeWidth={5} />
            <circle cx={46} cy={46} r={30} fill="none" stroke={C.primary} strokeWidth={2} />
            <text x={46} y={53} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize={20} fill={C.primary}>
              CERT
            </text>
          </svg>
          {signAt !== null && frame >= signAt ? (
            <div
              style={{
                position: 'absolute',
                left: 40,
                top: 140,
                padding: '10px 22px',
                border: `5px solid ${C.low}`,
                borderRadius: 10,
                color: C.low,
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 36,
                letterSpacing: 2,
                background: 'rgba(255,255,255,0.85)',
                transform: `rotate(-9deg) scale(${2 - pop(frame, signAt, fps)})`,
                opacity: fade(frame, signAt, 6),
              }}
            >
              SIGNED OFF ✓
            </div>
          ) : null}
        </div>
      </Panel>

      {auditBeat !== null ? (
        <>
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
            <line
              x1={400}
              y1={600}
              x2={400 + 1120 * enter(frame, auditBeat + 6, fps, 24)}
              y2={600}
              stroke={C.base}
              strokeWidth={6}
            />
            {[400, 960, 1520].map((x, i) => (
              <circle key={x} cx={x} cy={600} r={16} fill={C.base} stroke={C.white} strokeWidth={5} opacity={fade(frame, auditBeat + 6 + i * 10)} />
            ))}
          </svg>
          <div
            style={{
              position: 'absolute',
              top: 570,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: fade(frame, auditBeat + 10),
            }}
          >
            <span style={{ background: C.base, color: C.white, fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, padding: '8px 26px', borderRadius: 999 }}>
              One workflow
            </span>
          </div>
          <div style={{ position: 'absolute', left: 150, right: 150, top: 680, display: 'flex', gap: 40 }}>
            <div
              style={{
                width: 520,
                background: C.base,
                borderRadius: 18,
                padding: '24px 30px',
                fontFamily: UI,
                color: C.white,
                opacity: revisionAt === null ? 0 : fade(frame, revisionAt),
              }}
            >
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, marginBottom: 16 }}>Revision history</div>
              {['Rev 0 · Issued', 'Rev 1 · Approved ✓'].map((r, i) => (
                <div key={r} style={{ fontSize: 24, padding: '8px 0', opacity: revisionAt === null ? 0 : fade(frame, revisionAt + 6 + i * 10) }}>
                  {r}
                </div>
              ))}
            </div>
            <div
              style={{
                flex: 1,
                background: C.base,
                borderRadius: 18,
                padding: '24px 30px',
                fontFamily: UI,
                color: C.white,
                opacity: trailAt === null ? 0 : fade(frame, trailAt),
              }}
            >
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, marginBottom: 16 }}>Audit trail</div>
              {trail.map(([time, who, what], i) => {
                const line = `${who} ${what}`;
                const start = (trailAt ?? 0) + 4 + i * 6;
                const shown = Math.max(0, Math.min(line.length, Math.floor((frame - start) * 3)));
                return (
                  <div key={time} style={{ fontSize: 24, padding: '6px 0', display: 'flex', gap: 22 }}>
                    <span style={{ color: C.accent, opacity: shown > 0 ? 1 : 0 }}>{time}</span>
                    <span>{line.slice(0, shown)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </Grid>
  );
};
