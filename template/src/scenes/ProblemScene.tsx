import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { drift, enter, mix, pop } from '../components/anim';
import { useLayout } from '../components/layout';
import { DarkBackdrop, Kinetic } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { C, DISPLAY, UI } from '../brand';

type Kind = 'sheet' | 'email' | 'note' | 'chat' | 'file';

interface Item {
  kind: Kind;
  /** File name, e-mail subject, note text… keep it short and true to the audience's world. */
  text: string;
  /** Spoken cue. Items without one follow the previous item of the same kind (or the previous item). */
  cue?: string;
}

// Centre points (fractions of the frame), spread round the edges first so the middle stays readable.
const SLOTS_LANDSCAPE = [
  [0.15, 0.38], [0.83, 0.34], [0.42, 0.7], [0.71, 0.72], [0.15, 0.8], [0.47, 0.34],
  [0.8, 0.55], [0.2, 0.59], [0.86, 0.88], [0.34, 0.49], [0.61, 0.46], [0.52, 0.88],
];
const SLOTS_PORTRAIT = [
  [0.3, 0.22], [0.72, 0.28], [0.3, 0.44], [0.72, 0.5], [0.28, 0.68], [0.72, 0.72],
  [0.5, 0.36], [0.5, 0.6], [0.3, 0.88], [0.72, 0.92], [0.5, 0.14], [0.5, 0.8],
];
const ROT = [-6, 5, 3, -4, 4, -2, 4, -3, -5, 6, -5, 3];

const size = (kind: Kind) =>
  kind === 'sheet' ? { w: 380, h: 240 } : kind === 'email' ? { w: 440, h: 112 } : kind === 'chat' ? { w: 400, h: 120 } : kind === 'file' ? { w: 320, h: 110 } : { w: 250, h: 210 };

const Sheet: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ width: '100%', height: '100%', background: C.white, borderRadius: 10, overflow: 'hidden', fontFamily: UI }}>
    <div style={{ background: '#1f7a4a', color: C.white, fontSize: 18, fontWeight: 700, padding: '10px 14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
    <div
      style={{
        height: '100%',
        backgroundImage: 'linear-gradient(#d7dde3 1px, transparent 1px), linear-gradient(90deg, #d7dde3 1px, transparent 1px)',
        backgroundSize: '76px 28px',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', left: 77, top: 57, width: 75, height: 27, background: '#ffd9d6' }} />
      <div style={{ position: 'absolute', left: 229, top: 113, width: 75, height: 27, background: '#fff1b8' }} />
    </div>
  </div>
);

const Row: React.FC<{ text: string; icon: React.ReactNode; sub?: boolean }> = ({ text, icon, sub = true }) => (
  <div style={{ width: '100%', height: '100%', background: C.white, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', fontFamily: UI, boxSizing: 'border-box' }}>
    {icon}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <div style={{ fontSize: 21, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</div>
      {sub ? <div style={{ height: 9, width: 200, borderRadius: 5, background: '#dde3ea' }} /> : null}
    </div>
  </div>
);

const MailIcon = () => (
  <svg width={54} height={40} viewBox="0 0 54 40" style={{ flexShrink: 0 }}>
    <rect x={2} y={2} width={50} height={36} rx={5} fill={C.bg} />
    <path d="M4 6 L27 23 L50 6" stroke={C.white} strokeWidth={3.5} fill="none" />
  </svg>
);
const ChatIcon = () => (
  <svg width={50} height={46} viewBox="0 0 50 46" style={{ flexShrink: 0 }}>
    <path d="M4 4h42v28H20l-10 10V32H4z" fill={C.primary} />
    <circle cx={16} cy={18} r={3} fill={C.white} />
    <circle cx={25} cy={18} r={3} fill={C.white} />
    <circle cx={34} cy={18} r={3} fill={C.white} />
  </svg>
);
const FileIcon = () => (
  <svg width={40} height={50} viewBox="0 0 40 50" style={{ flexShrink: 0 }}>
    <path d="M2 2h24l12 12v34H2z" fill={C.bad} />
    <text x={20} y={38} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.white} fontFamily="Arial">PDF</text>
  </svg>
);

const Note: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ width: '100%', height: '100%', background: C.highlight, borderRadius: 4, padding: 22, boxSizing: 'border-box', fontFamily: DISPLAY, fontWeight: 700, fontSize: 27, lineHeight: 1.25, color: C.ink, overflow: 'hidden' }}>
    {text}
  </div>
);

const Fragment: React.FC<{ item: Item }> = ({ item }) =>
  item.kind === 'sheet' ? (
    <Sheet name={item.text} />
  ) : item.kind === 'email' ? (
    <Row text={item.text} icon={<MailIcon />} />
  ) : item.kind === 'chat' ? (
    <Row text={item.text} icon={<ChatIcon />} />
  ) : item.kind === 'file' ? (
    <Row text={item.text} icon={<FileIcon />} sub={false} />
  ) : (
    <Note text={item.text} />
  );

/**
 * The messy "before". props: { items: Item[] (up to 12), headline?: string, headlineAccent?: string[],
 * finale?: string, finaleCue?: string, finaleAccent?: string[], scale?: number (fragment size, default 1.2) }
 * With a headline it shows first and lifts away as the clutter arrives; the finale blows it all away.
 */
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue, duration } = useScene();
  const { w, h, u, portrait } = useLayout();
  const items = ((props.items as Item[]) ?? []).slice(0, 12);
  const headline = props.headline as string | undefined;
  const finale = props.finale as string | undefined;
  const slots = portrait ? SLOTS_PORTRAIT : SLOTS_LANDSCAPE;
  // fragments are drawn at 1.2× by default so their text stays legible on phones; `scale` tunes it
  const scale = ((props.scale as number | undefined) ?? 1.2) * (portrait ? 0.85 : 1);

  // when each item appears
  const lastOfKind: Partial<Record<Kind, number>> = {};
  let prev = headline ? 40 : 6;
  const starts = items.map((it, i) => {
    // without a headline the first item shows at once, so the scene never opens empty
    const own = i === 0 && !headline ? Math.min(cue(it.cue) ?? 6, 6) : cue(it.cue);
    const at = own ?? (lastOfKind[it.kind] !== undefined ? lastOfKind[it.kind]! + 4 : prev + 8);
    lastOfKind[it.kind] = at;
    prev = at;
    return at;
  });
  const firstAt = Math.min(...starts);
  const finaleAt = finale ? or(cue(props.finaleCue), duration - 45) : Infinity;
  const lift = headline ? enter(frame, firstAt - 4, fps, 20) : 0;
  const scatterOut = enter(frame, finaleAt, fps, 22);

  return (
    <DarkBackdrop>
      {items.map((it, i) => {
        if (frame < starts[i]) return null;
        const p = pop(frame, starts[i], fps);
        const s = size(it.kind);
        const fw = s.w * scale;
        const fh = s.h * scale;
        const [sx, sy] = slots[i % slots.length];
        const tx = sx * w;
        const ty = sy * h;
        const x = mix(p, w / 2, tx) - fw / 2 + drift(frame, i, 10) + (tx - w / 2) * scatterOut * 1.6;
        const y = mix(p, h / 2, ty) - fh / 2 + drift(frame, i + 5, 8, 110) + (ty - h / 2) * scatterOut * 1.6;
        const rot = ROT[i % ROT.length] * p + drift(frame, i + 9, 1.5, 70);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: fw,
              height: fh,
              transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * Math.min(p, 1.1)})`,
              opacity: Math.min(1, p * 2) * (1 - scatterOut),
              boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
              borderRadius: 10,
              fontSize: 1,
            }}
          >
            <div style={{ width: s.w, height: s.h, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              <Fragment item={it} />
            </div>
          </div>
        );
      })}
      {headline ? (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            transform: `translateY(${-(portrait ? 0.4 : 0.34) * h * lift}px) scale(${1 - 0.42 * lift})`,
            opacity: 1 - scatterOut,
          }}
        >
          <Kinetic text={headline} start={6} size={(portrait ? 92 : 104) * u} accent={props.headlineAccent as string[] | undefined} style={{ maxWidth: w * 0.8 }} />
        </AbsoluteFill>
      ) : null}
      {finale && frame >= finaleAt ? (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Kinetic text={finale} start={finaleAt + 4} size={(portrait ? 96 : 110) * u} accent={props.finaleAccent as string[] | undefined} style={{ maxWidth: w * 0.82 }} />
        </AbsoluteFill>
      ) : null}
    </DarkBackdrop>
  );
};
