import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { enter, fade, pop, ramp } from '../components/anim';
import { useLayout } from '../components/layout';
import { AppWindow, Backdrop, Cursor, Kinetic } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { C, DISPLAY, UI } from '../brand';

interface Callout {
  /** Position on the screenshot, as fractions 0–1 of its width/height. */
  x: number;
  y: number;
  text: string;
  cue?: string;
}
interface Focus {
  x: number;
  y: number;
  scale: number;
  cue?: string;
}
interface Row {
  title: string;
  meta?: string;
  status?: string;
  statusColor?: 'good' | 'warn' | 'bad' | 'accent' | 'primary';
  cue?: string;
}

const statusBg = (c: Row['statusColor']) =>
  c === 'good' ? C.good : c === 'warn' ? C.warn : c === 'bad' ? C.bad : c === 'primary' ? C.primary : C.accent;

/**
 * The product itself. Two modes:
 *  - screenshot: props { src: 'screens/x.png', aspect?: number (w/h, default 1.6), focus?: Focus[],
 *    callouts?: Callout[], url?: string }. Capture at 1600×1000 with demo data only.
 *  - mock list:  props { rows: Row[], heading?: string, active?: string (menu item), clickCue?: string,
 *    clickRow?: number }
 * Shared: { title?: string, titleCue?: string, titleAccent?: string[], tone?: 'dark'|'light' }
 */
export const ScreenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue, duration } = useScene();
  const { w, h, u, portrait } = useLayout();
  const title = props.title as string | undefined;
  const tone = (props.tone as 'dark' | 'light' | undefined) ?? 'dark';
  const src = props.src as string | undefined;
  const titleAt = or(cue(props.titleCue), 4);

  const titleSpace = title ? (portrait ? 330 : 170) : portrait ? 120 : 60;
  const aspect = (props.aspect as number | undefined) ?? 1.6;
  const chromeH = src ? 40 : 104;
  const maxW = portrait ? w - 80 : Math.min(1600, w - 220);
  // a screenshot keeps its aspect: shrink the window until it fits the free height
  const winW = src ? Math.min(maxW, (h - titleSpace - 60 - chromeH) * aspect) : maxW;
  const contentH = src ? winW / aspect : Math.min(h - titleSpace - (portrait ? 140 : 60), portrait ? 1100 : 820) - chromeH;
  const winH = contentH + chromeH;
  const top = Math.max(titleSpace, titleSpace + (h - titleSpace - winH) / 2);
  const rise = enter(frame, 0, fps, 22);

  let body: React.ReactNode;
  let overlay: React.ReactNode = null;

  if (src) {
    const focus = ((props.focus as Focus[]) ?? []).map((f) => ({ ...f, at: or(cue(f.cue), 30) }));
    let sx = 0.5;
    let sy = 0.5;
    let scale = ramp(frame, [0, duration], [1, 1.04]);
    for (const f of focus) {
      const p = enter(frame, f.at, fps, 30);
      sx += (f.x - sx) * p;
      sy += (f.y - sy) * p;
      scale += (f.scale - scale) * p;
    }
    const callouts = ((props.callouts as Callout[]) ?? []).map((c, i) => ({ ...c, at: or(cue(c.cue), 30 + i * 30) }));
    // zooming about the focus point keeps it fixed on screen while everything else grows away from it
    body = (
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: `${sx * 100}% ${sy * 100}%` }}>
        <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left' }} />
        {callouts.map((c, i) => {
          if (frame < c.at) return null;
          const p = pop(frame, c.at, fps);
          const ring = ((frame - c.at) % 40) / 40;
          const left = c.x > 0.6;
          return (
            <div key={i} style={{ position: 'absolute', left: `${c.x * 100}%`, top: `${c.y * 100}%` }}>
              <div style={{ position: 'absolute', left: -30 - 20 * ring, top: -30 - 20 * ring, width: 60 + 40 * ring, height: 60 + 40 * ring, borderRadius: '50%', border: `4px solid ${C.accent}`, opacity: 1 - ring }} />
              <div style={{ position: 'absolute', left: -12, top: -12, width: 24, height: 24, borderRadius: 12, background: C.accent, transform: `scale(${p})` }} />
              <div
                style={{
                  position: 'absolute',
                  top: -34,
                  [left ? 'right' : 'left']: 46,
                  padding: '14px 24px',
                  borderRadius: 14,
                  background: C.bg,
                  color: C.white,
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 30 / scale,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 16px 36px rgba(0,20,50,0.35)',
                  opacity: Math.min(1, p * 1.5),
                  transform: `translateX(${(1 - p) * (left ? 30 : -30)}px)`,
                }}
              >
                {c.text}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    );
  } else {
    const rows = (props.rows as Row[]) ?? [];
    let prev = 8;
    const ats = rows.map((r) => (prev = or(cue(r.cue), prev + 8)));
    const clickAt = or(cue(props.clickCue), Infinity);
    const clickRow = (props.clickRow as number | undefined) ?? 0;
    const rowH = Math.min(96, (contentH - 110) / Math.max(rows.length, 1));
    const sel = enter(frame, clickAt + 4, fps, 10);
    body = (
      <div style={{ padding: '28px 36px', fontFamily: UI, height: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: C.ink, marginBottom: 20 }}>{(props.heading as string) ?? ''}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map((r, i) => {
            const p = enter(frame, ats[i], fps, 14);
            const active = i === clickRow ? sel : 0;
            return (
              <div
                key={i}
                style={{
                  height: rowH,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: '0 24px',
                  borderRadius: 12,
                  background: C.white,
                  border: `2px solid ${active > 0.5 ? C.accent : C.hairline}`,
                  boxShadow: active > 0.5 ? `0 0 0 6px ${C.accent}33` : '0 2px 6px rgba(0,0,0,0.05)',
                  opacity: p,
                  transform: `translateX(${(1 - p) * 60}px)`,
                }}
              >
                <div style={{ width: 10, alignSelf: 'stretch', margin: '14px 0', borderRadius: 5, background: statusBg(r.statusColor) }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: Math.min(26, rowH * 0.32), fontWeight: 700, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                  {r.meta ? <div style={{ fontSize: Math.min(19, rowH * 0.24), color: C.muted, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.meta}</div> : null}
                </div>
                {r.status ? (
                  <div style={{ padding: '8px 16px', borderRadius: 999, background: statusBg(r.statusColor), color: C.white, fontSize: 17, fontWeight: 700, whiteSpace: 'nowrap' }}>{r.status}</div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
    if (Number.isFinite(clickAt) && rows.length) {
      const rowY = top + chromeH + 28 + 50 + clickRow * (rowH + 12) + rowH / 2;
      const winLeft = (w - winW) / 2;
      overlay = (
        <Cursor
          path={[
            { x: winLeft + winW * 0.85, y: top + winH * 0.95, at: clickAt - 26 },
            { x: winLeft + winW * 0.45, y: rowY, at: clickAt - 18 },
          ]}
          clicks={[clickAt]}
        />
      );
    }
  }

  return (
    <Backdrop tone={tone}>
      {title && frame >= titleAt ? (
        <div style={{ position: 'absolute', top: portrait ? 140 : 46, left: 60, right: 60 }}>
          <Kinetic text={title} start={titleAt} size={(portrait ? 60 : 62) * u} color={tone === 'dark' ? C.white : C.bg} accentColor={tone === 'dark' ? C.highlight : C.primary} accent={props.titleAccent as string[] | undefined} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', top, left: (w - winW) / 2, transform: `translateY(${(1 - rise) * 80}px)`, opacity: fade(frame, 0, 10) }}>
        <AppWindow width={winW} height={winH} chrome={!src} active={props.active as string | undefined}>
          {body}
        </AppWindow>
      </div>
      {overlay}
    </Backdrop>
  );
};
