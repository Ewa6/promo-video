import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { enter, fade, pop } from '../components/anim';
import { useLayout } from '../components/layout';
import { AppWindow, Cursor, DarkBackdrop, Footnote, Kinetic, Pill } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { C, UI } from '../brand';

type Tone = 'good' | 'warn' | 'bad' | 'accent' | 'primary';
const tone = (t: Tone | undefined, i: number) =>
  t === 'good' ? C.good : t === 'warn' ? C.warn : t === 'bad' ? C.bad : t === 'primary' ? C.primary : t === 'accent' ? C.accent : [C.primary, C.accent, C.good, C.warn, C.bad][i % 5];

interface Kpi {
  label: string;
  value: number;
  suffix?: string;
  tone?: Tone;
}
interface Datum {
  label: string;
  value: number;
  tone?: Tone;
}

const DEFAULT_KPIS: Kpi[] = [
  { label: 'Open items', value: 128 },
  { label: 'Due this month', value: 34, tone: 'warn' },
  { label: 'Overdue', value: 6, tone: 'bad' },
  { label: 'Completed', value: 92, suffix: '%', tone: 'good' },
];
const DEFAULT_BARS: Datum[] = ['North', 'South', 'East', 'West', 'Central', 'Offsite'].map((label, i) => ({ label, value: [62, 45, 78, 30, 54, 40][i] }));
const DEFAULT_DONUT: Datum[] = [
  { label: 'Low', value: 58, tone: 'good' },
  { label: 'Medium', value: 30, tone: 'warn' },
  { label: 'High', value: 12, tone: 'bad' },
];

/**
 * A question, answered by a live dashboard. Data is illustrative and labelled so on screen.
 * props: { question?: string, questionAccent?: string[], answerCue?: string, heading?: string,
 * active?: string (menu item), kpis?: Kpi[] (≤4), bars?: Datum[] (≤8), barsTitle?: string,
 * donut?: Datum[] (≤5), donutTitle?: string, clickCue?: string, clickBar?: number,
 * chip?: string, chipCue?: string }
 */
export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue, sectionIds, beat } = useScene();
  const { w, h, u, portrait } = useLayout();
  const question = props.question as string | undefined;
  const kpis = ((props.kpis as Kpi[]) ?? DEFAULT_KPIS).slice(0, portrait ? 2 : 4);
  const bars = ((props.bars as Datum[]) ?? DEFAULT_BARS).slice(0, portrait ? 5 : 8);
  const donut = ((props.donut as Datum[]) ?? DEFAULT_DONUT).slice(0, 5);
  const maxBar = Math.max(...bars.map((b) => b.value), 1);
  const donutTotal = donut.reduce((s, d) => s + d.value, 0) || 1;

  const answerAt = question ? or(cue(props.answerCue), or(sectionIds.length > 1 ? beat(sectionIds[1]) : null, 70)) : 0;
  const clickAt = or(cue(props.clickCue), Infinity);
  const clickBar = Math.min((props.clickBar as number | undefined) ?? 0, bars.length - 1);
  const chipAt = props.chip ? or(cue(props.chipCue), answerAt + 30) : Infinity;
  const qOut = question ? enter(frame, answerAt - 6, fps, 16) : 1;
  const win = enter(frame, answerAt, fps, 22);
  const grow = (start: number) => interpolate(frame, [start, start + 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const g = grow(answerAt + 8);
  const sel = enter(frame, clickAt + 3, fps, 10);

  const chipRoom = props.chip ? 100 : 0;
  const winW = portrait ? w - 80 : Math.min(1560, w - 260);
  const winH = Math.min(portrait ? 1180 : 860, h - 120 - chipRoom);
  const winX = (w - winW) / 2;
  const winY = Math.max(90, (h - chipRoom - winH) / 2 + 20);
  const pad = 30;
  const fixed = 104 + 2 * pad + 40 + 130 + 40; // chrome, padding, heading, KPI row, gaps
  const chartW = portrait ? winW - 2 * pad : (winW - 3 * pad) * 0.6;
  const chartH = portrait ? Math.max(260, (winH - fixed - pad) * 0.56) : Math.max(260, winH - fixed);
  const donutH = portrait ? Math.max(220, (winH - fixed - pad) * 0.44) : chartH;
  const barW = (chartW - 60) / bars.length;

  // cursor target: the clicked bar's top
  const plotTop = winY + 104 + pad + 40 + 20 + 130 + 20 + 20 + 30;
  const barTopY = plotTop + (chartH - 110) * (1 - bars[clickBar].value / maxBar);
  const barX = winX + pad + 30 + barW * clickBar + barW / 2;

  return (
    <DarkBackdrop>
      {question && qOut < 1 ? (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80, opacity: 1 - qOut, transform: `translateY(${-120 * qOut}px)` }}>
          <Kinetic text={question} start={6} size={(portrait ? 84 : 96) * u} stagger={3} accent={props.questionAccent as string[] | undefined} style={{ maxWidth: w * 0.85 }} />
        </AbsoluteFill>
      ) : null}
      {frame >= answerAt - 2 ? (
        <div style={{ position: 'absolute', left: winX, top: winY, opacity: win, transform: `translateY(${(1 - win) * 100}px) scale(${0.94 + 0.06 * win})` }}>
          <AppWindow width={winW} height={winH} active={(props.active as string | undefined) ?? 'Dashboards'}>
            <div style={{ padding: pad, fontFamily: UI, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.ink }}>{(props.heading as string) ?? 'Overview'}</div>
              <div style={{ display: 'flex', gap: 20 }}>
                {kpis.map((k, i) => (
                  <div key={i} style={{ flex: 1, background: C.white, borderRadius: 12, padding: '18px 22px', borderTop: `5px solid ${tone(k.tone, i)}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', opacity: fade(frame, answerAt + 4 + i * 4, 10) }}>
                    <div style={{ fontSize: 18, color: C.muted, fontWeight: 700 }}>{k.label}</div>
                    <div style={{ fontSize: 50, color: C.ink, fontWeight: 700, marginTop: 4 }}>
                      {Math.round(k.value * g)}
                      {k.suffix ?? ''}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: portrait ? 'column' : 'row', gap: pad }}>
                <div style={{ width: chartW, height: chartH, background: C.white, borderRadius: 12, padding: 20, boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 10 }}>{(props.barsTitle as string) ?? 'By area'}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', height: chartH - 110, gap: barW * 0.25, padding: '0 10px' }}>
                    {bars.map((b, i) => {
                      const hi = i === clickBar ? sel : 0;
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                          <div style={{ width: '100%', height: `${(b.value / maxBar) * 100 * grow(answerAt + 10 + i * 3)}%`, background: hi > 0.5 ? C.highlight : tone(b.tone, 0), borderRadius: '6px 6px 0 0', opacity: sel > 0.5 && i !== clickBar ? 0.45 : 1 }} />
                          <div style={{ fontSize: 15, color: C.muted, marginTop: 8, whiteSpace: 'nowrap' }}>{b.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {!portrait || donut.length ? (
                  <div style={{ flex: 1, height: donutH, background: C.white, borderRadius: 12, padding: 20, boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>{(props.donutTitle as string) ?? 'By risk'}</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
                      <svg width={Math.min(220, donutH - 70)} height={Math.min(220, donutH - 70)} viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
                        {(() => {
                          let acc = 0;
                          const R = 80;
                          const circ = 2 * Math.PI * R;
                          return donut.map((d, i) => {
                            const frac = (d.value / donutTotal) * g;
                            const el = <circle key={i} cx={110} cy={110} r={R} fill="none" stroke={tone(d.tone, i)} strokeWidth={36} strokeDasharray={`${frac * circ} ${circ}`} strokeDashoffset={-acc * circ} />;
                            acc += frac;
                            return el;
                          });
                        })()}
                      </svg>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {donut.map((d, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: C.ink }}>
                            <div style={{ width: 14, height: 14, borderRadius: 3, background: tone(d.tone, i) }} />
                            {d.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </AppWindow>
        </div>
      ) : null}
      {Number.isFinite(clickAt) ? (
        <Cursor
          path={[
            { x: winX + winW * 0.9, y: winY + winH * 0.95, at: clickAt - 26 },
            { x: barX, y: barTopY + 20, at: clickAt - 18 },
          ]}
          clicks={[clickAt]}
        />
      ) : null}
      {frame >= chipAt ? (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', justifyContent: 'center', transform: `scale(${pop(frame, chipAt, fps)})` }}>
          <Pill bg={C.primary}>{props.chip as string}</Pill>
        </div>
      ) : null}
      {frame >= answerAt ? <Footnote opacity={fade(frame, answerAt + 10)} position="top">Illustrative data</Footnote> : null}
    </DarkBackdrop>
  );
};
