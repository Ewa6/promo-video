import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { enter, fade, pop } from '../components/anim';
import { Icon } from '../components/icons';
import { useLayout } from '../components/layout';
import { Backdrop, Kinetic, Pill } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { BRAND, C, DISPLAY, UI } from '../brand';

interface Field {
  label: string;
  value: string;
  cue?: string;
}

/**
 * Work on a phone or tablet, synced to the cloud.
 * props: { device?: 'phone'|'tablet' (default tablet), src?: 'screens/mobile.png' (else a mock form),
 * heading?: string, fields?: Field[], syncCue?: string, syncLabel?: string (default BRAND.name),
 * pills?: { text: string, cue?: string }[], title?: string, titleAccent?: string[], tone?: 'dark'|'light' }
 */
export const DeviceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue, duration } = useScene();
  const { w, h, u, portrait } = useLayout();
  const device = (props.device as 'phone' | 'tablet' | undefined) ?? 'tablet';
  const tone = (props.tone as 'dark' | 'light' | undefined) ?? 'light';
  const fields = (props.fields as Field[]) ?? [];
  const pills = (props.pills as { text: string; cue?: string }[]) ?? [];
  const title = props.title as string | undefined;
  const src = props.src as string | undefined;

  const devW = Math.min((device === 'phone' ? 420 : portrait ? 900 : 940) * u, portrait ? w - 120 : w * (device === 'phone' ? 0.4 : 0.55));
  const devH = Math.min((device === 'phone' ? 860 : portrait ? 640 : 680) * u * (devW / ((device === 'phone' ? 420 : portrait ? 900 : 940) * u)), h - (title ? 260 : 120));
  let prev = 14;
  const fieldAts = fields.map((f) => (prev = or(cue(f.cue), prev + 14)));
  const syncAt = or(cue(props.syncCue), Math.max(prev + 20, duration * 0.5));
  let pprev = syncAt + 10;
  const pillAts = pills.map((p) => (pprev = or(cue(p.cue), pprev + 14)));
  const rise = enter(frame, 0, fps, 22);
  const sync = enter(frame, syncAt, fps, 30);
  const cloud = pop(frame, syncAt - 6, fps);

  const devX = portrait ? (w - devW) / 2 : w * 0.34 - devW / 2;
  const devY = portrait ? h * 0.22 : (h - devH) / 2 + (title ? 60 : 0);
  const cloudX = portrait ? w / 2 : w * 0.78;
  const cloudY = portrait ? devY + devH + 220 * u : h / 2 + (title ? 60 : 0) - 60;

  return (
    <Backdrop tone={tone}>
      {title ? (
        <div style={{ position: 'absolute', top: portrait ? 130 : 50, left: 60, right: 60 }}>
          <Kinetic text={title} start={4} size={(portrait ? 60 : 64) * u} color={tone === 'dark' ? C.white : C.bg} accentColor={tone === 'dark' ? C.highlight : C.primary} accent={props.titleAccent as string[] | undefined} />
        </div>
      ) : null}

      {/* data packets flowing device → cloud */}
      {frame >= syncAt
        ? [0, 1, 2, 3, 4].map((k) => {
            const t = ((frame - syncAt) / 26 + k / 5) % 1;
            const sx = portrait ? w / 2 : devX + devW;
            const sy = portrait ? devY + devH : devY + devH / 2;
            const ex = cloudX;
            const ey = cloudY;
            return (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: sx + (ex - sx) * t - 9,
                  top: sy + (ey - sy) * t - 9,
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: C.highlight,
                  opacity: sync * Math.sin(t * Math.PI),
                }}
              />
            );
          })
        : null}

      <div
        style={{
          position: 'absolute',
          left: devX,
          top: devY,
          width: devW,
          height: devH,
          borderRadius: (device === 'phone' ? 56 : 40) * u,
          background: '#111',
          padding: (device === 'phone' ? 16 : 22) * u,
          boxSizing: 'border-box',
          boxShadow: '0 40px 80px rgba(0,16,40,0.45)',
          transform: `translateY(${(1 - rise) * 120}px)`,
        }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: (device === 'phone' ? 42 : 22) * u, overflow: 'hidden', background: C.paper, fontFamily: UI, position: 'relative' }}>
          {src ? (
            <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
          ) : (
            <>
              <div style={{ height: 84 * u, background: C.bg, borderTop: `4px solid ${C.primary}`, display: 'flex', alignItems: 'center', padding: '0 28px', color: C.white, fontWeight: 700, fontSize: 32 * u }}>
                {(props.heading as string) ?? BRAND.app.title}
              </div>
              <div style={{ padding: 28 * u, display: 'flex', flexDirection: 'column', gap: 18 * u }}>
                {fields.map((f, i) => {
                  const typed = Math.max(0, Math.min(f.value.length, Math.floor((frame - fieldAts[i]) / 1.5)));
                  return (
                    <div key={i} style={{ opacity: fade(frame, fieldAts[i] - 8, 8) }}>
                      <div style={{ fontSize: 22 * u, color: C.muted, fontWeight: 700, marginBottom: 6 }}>{f.label}</div>
                      <div style={{ height: 64 * u, borderRadius: 10, border: `2px solid ${frame >= fieldAts[i] && typed < f.value.length ? C.accent : C.hairline}`, background: C.white, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 30 * u, color: C.ink, fontWeight: 600 }}>
                        {f.value.slice(0, typed)}
                      </div>
                    </div>
                  );
                })}
                {frame >= syncAt ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.good, fontWeight: 700, fontSize: 28 * u, marginTop: 6, opacity: fade(frame, syncAt, 10) }}>
                    <Icon name="check" size={30 * u} color={C.good} /> Synced
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: cloudX - 130 * u,
          top: cloudY - 110 * u,
          width: 260 * u,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          transform: `scale(${cloud})`,
        }}
      >
        <div style={{ width: 200 * u, height: 200 * u, borderRadius: 100 * u, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,20,50,0.35)' }}>
          <Icon name="cloud" size={120 * u} color={C.white} />
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 32 * u, color: tone === 'dark' ? C.white : C.bg, whiteSpace: 'nowrap' }}>{(props.syncLabel as string) ?? BRAND.name}</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: portrait ? 40 : w * 0.62,
          right: portrait ? 40 : 60,
          top: portrait ? Math.min(h - 120, cloudY + 170 * u) : cloudY + 170 * u,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 18,
        }}
      >
        {pills.map((p, i) => {
          const a = pop(frame, pillAts[i], fps);
          return frame >= pillAts[i] ? (
            <div key={i} style={{ transform: `scale(${a})` }}>
              <Pill size={30 * u} bg={C.bg}>
                <Icon name="check" size={34 * u} color={C.highlight} />
                {p.text}
              </Pill>
            </div>
          ) : null;
        })}
      </div>
    </Backdrop>
  );
};
