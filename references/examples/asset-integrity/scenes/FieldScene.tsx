import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { or, useScene } from '../SceneContext';
import { enter, fade, pop } from '../components/anim';
import { Icon } from '../components/icons';
import { Grid, LogoMark, Logo, Pill } from '../components/ui';
import { C, DISPLAY, UI } from '../theme';

const READINGS = [
  ['TML-01', '12.4'],
  ['TML-02', '12.1'],
  ['TML-03', '11.8'],
];

// tablet → database, as a cubic Bézier
const P0 = [1150, 760];
const P1 = [1330, 760];
const P2 = [1300, 520];
const P3 = [1440, 520];
const bezier = (t: number) =>
  [0, 1].map((k) => (1 - t) ** 3 * P0[k] + 3 * (1 - t) ** 2 * t * P1[k] + 3 * (1 - t) * t ** 2 * P2[k] + t ** 3 * P3[k]);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', gap: 20, fontSize: 22 }}>
    <div style={{ width: 150, color: C.muted }}>{label}</div>
    <div style={{ color: C.ink, fontWeight: 700 }}>{value}</div>
  </div>
);

/** Inspector on site: results captured on the tablet and synced into the same database. */
export const FieldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { word } = useScene();

  const tabletIn = enter(frame, 0, fps, 22);
  const typeAt = (i: number) => 10 + i * 7;
  const syncAt = or(word(/^(flows|data)/), 46);
  const synced = frame >= syncAt + 30;
  const press = frame >= syncAt && frame < syncAt + 6;
  const chips = [
    { text: 'No re-typing', at: word(/^re-?typing/) },
    { text: 'No lost paperwork', at: word(/^paperwork/) },
  ];

  return (
    <Grid>
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 170,
          width: 1000,
          height: 700,
          padding: 26,
          borderRadius: 46,
          background: '#0b1a2e',
          boxShadow: '0 40px 80px rgba(0,20,45,0.45)',
          transform: `translateY(${(1 - tabletIn) * 160}px) rotate(${(1 - tabletIn) * -4}deg)`,
          opacity: tabletIn,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: 20, overflow: 'hidden', background: C.white, fontFamily: UI, position: 'relative' }}>
          <div style={{ height: 70, background: C.base, borderTop: `5px solid ${C.primary}`, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 22 }}>
            <Logo width={130} variant="white" />
            <div style={{ color: C.white, fontSize: 22, opacity: 0.85 }}>Inspection · V-210</div>
            <div style={{ flex: 1 }} />
            <div
              style={{
                padding: '8px 18px',
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 700,
                background: synced ? C.low : 'rgba(255,255,255,0.15)',
                color: C.white,
              }}
            >
              {synced ? 'Synced ✓' : 'Ready to sync'}
            </div>
          </div>
          <div style={{ padding: '26px 34px', display: 'flex', gap: 40 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Row label="Equipment" value="V-210 · Test Separator" />
              <Row label="Inspection" value="GVI + UT thickness" />
              <div style={{ marginTop: 14, fontSize: 20, fontWeight: 700, color: C.base }}>Thickness readings (mm)</div>
              <div style={{ border: `1px solid ${C.hairline}`, borderRadius: 8, overflow: 'hidden' }}>
                {READINGS.map(([tml, mm], i) => {
                  const shown = Math.max(0, Math.min(mm.length, Math.floor((frame - typeAt(i)) / 2)));
                  return (
                    <div key={tml} style={{ display: 'flex', fontSize: 22, padding: '12px 16px', borderTop: i ? `1px solid ${C.hairline}` : undefined, background: i % 2 ? '#f8f9fa' : C.white }}>
                      <div style={{ width: 140, color: C.muted }}>{tml}</div>
                      <div style={{ fontWeight: 700, color: C.ink }}>
                        {mm.slice(0, shown)}
                        {shown > 0 && shown < mm.length ? '|' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 10, alignItems: 'center' }}>
                <div style={{ fontSize: 20, color: C.muted, width: 140 }}>Condition</div>
                {['Good', 'Fair', 'Poor'].map((c) => {
                  const selected = c === 'Fair' && frame >= typeAt(3) + 4;
                  return (
                    <div
                      key={c}
                      style={{
                        padding: '8px 20px',
                        borderRadius: 8,
                        fontSize: 20,
                        border: `2px solid ${selected ? C.medium : C.hairline}`,
                        background: selected ? '#fff4e0' : C.white,
                        fontWeight: selected ? 700 : 400,
                      }}
                    >
                      {c}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.base }}>Photos</div>
              {[0, 1].map((i) => {
                const p = pop(frame, typeAt(3) + 8 + i * 5, fps);
                return (
                  <div
                    key={i}
                    style={{
                      height: 150,
                      borderRadius: 10,
                      background: i ? 'linear-gradient(135deg,#9fb6c9,#6e89a0)' : 'linear-gradient(135deg,#cdd9da,#9aaeb0)',
                      transform: `scale(${p})`,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ position: 'absolute', left: 30, bottom: 0, width: 0, height: 0, borderLeft: '60px solid transparent', borderRight: '60px solid transparent', borderBottom: '80px solid rgba(255,255,255,0.45)' }} />
                    <div style={{ position: 'absolute', right: 30, top: 26, width: 30, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.7)' }} />
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 34,
              bottom: 30,
              padding: '18px 34px',
              borderRadius: 10,
              background: press ? C.baseDeep : C.blue,
              color: C.white,
              fontSize: 24,
              fontWeight: 700,
              transform: `scale(${press ? 0.94 : 1})`,
            }}
          >
            Submit &amp; sync
          </div>
          {frame >= syncAt && frame < syncAt + 18 ? (
            <div
              style={{
                position: 'absolute',
                right: 34 + 110 - ((frame - syncAt) / 18) * 50,
                bottom: 30 + 32 - ((frame - syncAt) / 18) * 50,
                width: ((frame - syncAt) / 18) * 100,
                height: ((frame - syncAt) / 18) * 100,
                borderRadius: '50%',
                border: `4px solid ${C.accent}`,
                opacity: 1 - (frame - syncAt) / 18,
              }}
            />
          ) : null}
        </div>
      </div>

      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <path
          d={`M ${P0} C ${P1} ${P2} ${P3}`}
          fill="none"
          stroke={C.base}
          strokeWidth={5}
          strokeDasharray="4 12"
          opacity={fade(frame, syncAt - 6)}
        />
        {frame >= syncAt
          ? [0, 1, 2, 3].map((k) => {
              const t = (frame - syncAt - k * 7) / 26;
              if (t < 0 || t > 1) return null;
              const [x, y] = bezier(t);
              return <rect key={k} x={x - 14} y={y - 14} width={28} height={28} rx={7} fill={C.accent} />;
            })
          : null}
      </svg>

      <div style={{ position: 'absolute', left: 1440, top: 390, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: 130,
            background: C.base,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${pop(frame, 8, fps) * (frame >= syncAt + 26 && frame < syncAt + 34 ? 1.06 : 1)})`,
            boxShadow: `0 0 0 ${synced ? 10 : 0}px rgba(34,181,216,0.35), 0 24px 50px rgba(0,30,60,0.35)`,
          }}
        >
          <LogoMark size={150} variant="white" />
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, color: C.base, opacity: fade(frame, 12) }}>Same database</div>
      </div>

      <div style={{ position: 'absolute', left: 1240, top: 790, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {chips.map((c) => {
          if (c.at === null || frame < c.at) return null;
          const p = pop(frame, c.at, fps);
          return (
            <div key={c.text} style={{ transform: `translateX(${(1 - p) * 80}px)`, opacity: Math.min(1, p * 1.5) }}>
              <Pill>
                <Icon name="check" size={40} color={C.highlight} stroke={5} />
                {c.text}
              </Pill>
            </div>
          );
        })}
      </div>
    </Grid>
  );
};
