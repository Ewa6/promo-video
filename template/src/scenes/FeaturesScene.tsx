import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { pop } from '../components/anim';
import { Icon } from '../components/icons';
import { useLayout } from '../components/layout';
import { Backdrop, Kinetic } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { C, DISPLAY } from '../brand';

interface Feature {
  title: string;
  sub?: string;
  icon?: string;
  cue?: string;
}

/**
 * Feature cards. props: { items: Feature[] (2–6), title?: string, titleAccent?: string[],
 * columns?: number, tone?: 'dark'|'light' (default dark) }
 */
export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue } = useScene();
  const { w, h, u, narrow } = useLayout();
  const items = ((props.items as Feature[]) ?? []).slice(0, 6);
  const title = props.title as string | undefined;
  const tone = (props.tone as 'dark' | 'light' | undefined) ?? 'dark';
  const GAP = 36;
  // as many columns as fit at ≥420 px a card, but rows of 2 rather than 3+1
  const fit = Math.max(1, Math.floor((w - 120 + GAP) / (420 + GAP)));
  const wanted = (props.columns as number | undefined) ?? (items.length === 4 ? 2 : Math.min(3, items.length));
  const cols = Math.min(fit, wanted, items.length || 1);
  const rows = Math.ceil(items.length / cols);
  const cardW = Math.min(narrow ? 900 : 540, (w - 120 - (cols - 1) * GAP) / cols);
  // stacked single column: horizontal cards; grid: tiles with the icon on top
  const horizontal = cols === 1;
  const avail = h - (title ? 220 : 80);
  const cardH = Math.min(horizontal ? 190 : 380, (avail - (rows - 1) * GAP) / rows);
  let prev = title ? 18 : 4;
  // the first card never waits on its cue, so the scene is not empty while the voice catches up
  const ats = items.map((it, i) => (prev = i === 0 && !title ? Math.min(or(cue(it.cue), 4), 4) : or(cue(it.cue), prev + 10)));
  const k = Math.min(1, cardH / (horizontal ? 190 : 380));

  return (
    <Backdrop tone={tone}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 60 * u, padding: 60 }}>
        {title ? (
          <Kinetic text={title} start={4} size={(narrow ? 66 : 76) * u} color={tone === 'dark' ? C.white : C.bg} accentColor={tone === 'dark' ? C.highlight : C.primary} accent={props.titleAccent as string[] | undefined} style={{ maxWidth: w * 0.85 }} />
        ) : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: GAP, width: cols * cardW + (cols - 1) * GAP }}>
          {items.map((it, i) => {
            const p = pop(frame, ats[i], fps);
            if (frame < ats[i]) return <div key={i} style={{ width: cardW, height: cardH }} />;
            return (
              <div
                key={i}
                style={{
                  width: cardW,
                  height: cardH,
                  boxSizing: 'border-box',
                  padding: `${36 * k}px ${40 * k}px`,
                  borderRadius: 26,
                  background: C.white,
                  boxShadow: '0 22px 50px rgba(0,20,50,0.3)',
                  display: 'flex',
                  flexDirection: horizontal ? 'row' : 'column',
                  alignItems: horizontal ? 'center' : 'flex-start',
                  justifyContent: horizontal ? 'flex-start' : 'center',
                  gap: 28 * k,
                  transform: `translateY(${(1 - Math.min(p, 1)) * 60}px) scale(${0.85 + 0.15 * Math.min(p, 1.05)})`,
                  opacity: Math.min(1, p * 1.6),
                }}
              >
                <div style={{ width: 120 * k, height: 120 * k, borderRadius: 28 * k, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={it.icon ?? 'check'} size={72 * k} color={C.white} />
                </div>
                <div style={{ fontFamily: DISPLAY, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 48 * k * u, color: C.ink, lineHeight: 1.08 }}>{it.title}</div>
                  {it.sub ? <div style={{ fontWeight: 500, fontSize: 32 * k * u, color: C.muted, marginTop: 10, lineHeight: 1.25 }}>{it.sub}</div> : null}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};
