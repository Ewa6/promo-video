import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, DISPLAY, UI } from '../brand';
import { enter, fade, pop } from './anim';
import { useLayout } from './layout';
import { Card } from './ui';

/**
 * Building blocks for custom, product-specific scenes (see the skill's references/custom-scenes.md).
 * Everything takes frame numbers relative to the scene (from useScene().cue / beat) and draws in the
 * brand palette. Combine them with hand-drawn SVG for the product's world and screens.
 */

// ── World ────────────────────────────────────────────────────────────────────────────────────────

const SKIES = {
  dawn: ['#0b1f3f', '#3b3f7a', '#b0638a', '#f2a65a'],
  day: ['#3a7bd5', '#6fa8e6', '#a9cdf0', '#dceaf7'],
  dusk: ['#141a3a', '#4b2a5c', '#a3456b', '#f08a4b'],
  night: ['#050b1a', '#0b1630', '#13254a', '#1d335e'],
} as const;

/**
 * Establishing-shot backdrop: graded sky, sun/moon, and a ground band (sea with glints, flat land,
 * or a city skyline). Draw the product's subject (platform, factory, warehouse, truck, hospital…)
 * as flat SVG silhouettes on top, standing on `horizon` (fraction of the frame height).
 */
export const WorldBackdrop: React.FC<{
  time?: keyof typeof SKIES;
  ground?: 'sea' | 'land' | 'city';
  horizon?: number;
  children?: ReactNode;
}> = ({ time = 'dawn', ground = 'sea', horizon = 0.65, children }) => {
  const frame = useCurrentFrame();
  const { width: w, height: h } = useVideoConfig();
  const { h: contentH } = useLayout();
  const y = h * horizon;
  const sky = SKIES[time];
  const sunY = y - h * 0.12 - frame * 0.05;
  const glints = Array.from({ length: 26 }, (_, i) => i);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${sky[0]} 0%, ${sky[1]} 35%, ${sky[2]} 62%, ${sky[3]} ${horizon * 100}%)` }}>
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={w * 0.3} cy={sunY} r={h * 0.07} fill={time === 'night' ? '#e8eefc' : '#ffd58a'} opacity={0.9} />
        <circle cx={w * 0.3} cy={sunY} r={h * 0.16} fill={time === 'night' ? '#e8eefc' : '#ffd58a'} opacity={0.12} />
        {ground === 'sea' ? (
          <>
            <rect x={0} y={y} width={w} height={h - y} fill="#0a2240" />
            <rect x={0} y={y} width={w} height={(h - y) * 0.5} fill="#123058" opacity={0.6} />
            {glints.map((i) => {
              const gx = ((i * 263 + frame * (0.6 + (i % 3) * 0.2)) % (w + 200)) - 100;
              const gy = y + 14 + ((i * 47) % Math.max(1, h - y - 30));
              return <rect key={i} x={gx} y={gy} width={40 + (i % 4) * 22} height={3} rx={1.5} fill="#ffd58a" opacity={0.18 + ((i * 13) % 10) / 40} />;
            })}
          </>
        ) : ground === 'land' ? (
          <>
            <path d={`M0 ${y} Q ${w * 0.25} ${y - 30} ${w * 0.5} ${y} T ${w} ${y} V ${h} H 0 Z`} fill="#16324a" />
            <rect x={0} y={y + 20} width={w} height={h - y} fill="#0f263a" />
          </>
        ) : (
          <>
            {Array.from({ length: 18 }, (_, i) => {
              const bw = 60 + ((i * 37) % 90);
              const bh = 80 + ((i * 53) % 220);
              return <rect key={i} x={(i * w) / 18} y={y - bh} width={bw} height={bh + 4} fill="#132a45" opacity={0.85} />;
            })}
            <rect x={0} y={y} width={w} height={h - y} fill="#0f2238" />
          </>
        )}
      </svg>
      {/* children stay clear of the caption band, like every other backdrop */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: contentH }}>{children}</div>
    </AbsoluteFill>
  );
};

// ── Annotation ───────────────────────────────────────────────────────────────────────────────────

/**
 * A pulsing marker on a point of the picture, a leader line that draws itself, and a card with a
 * title and a detail line ("Weld W-03 · MPI, no recordable indications"). Coordinates are px in
 * the scene. Use 2–4 per picture, each on the word that names it.
 */
export const Callout: React.FC<{
  at: number;
  marker: [number, number];
  card: { left: number; top: number; width: number };
  title: string;
  detail?: string;
  accent?: string;
  dark?: boolean;
}> = ({ at, marker, card, title, detail, accent = C.accent, dark = false }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  if (frame < at) return null;
  const p = fade(frame, at, 14);
  const pc = pop(frame, at, fps);
  const ring = ((frame - at) % 40) / 40;
  const cx = card.left + card.width / 2;
  const cy = card.top + (detail ? 100 : 70);
  return (
    <>
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <line x1={cx} y1={cy} x2={marker[0]} y2={marker[1]} stroke={dark ? C.bg : C.white} strokeWidth={3} strokeDasharray={600} strokeDashoffset={600 * (1 - p)} />
        <circle cx={marker[0]} cy={marker[1]} r={14} fill={accent} stroke={C.white} strokeWidth={4} opacity={p} />
        <circle cx={marker[0]} cy={marker[1]} r={14 + ring * 34} fill="none" stroke={accent} strokeWidth={3} opacity={1 - ring} />
      </svg>
      <Card
        accent={accent}
        style={{
          position: 'absolute',
          left: card.left,
          top: card.top,
          width: card.width,
          boxSizing: 'border-box',
          opacity: Math.min(1, pc * 1.5),
          transform: `translateY(${(1 - pc) * 30}px) scale(${0.85 + 0.15 * pc})`,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 32, color: C.bg }}>{title}</div>
        {detail ? <div style={{ fontWeight: 500, fontSize: 25, color: C.muted, marginTop: 6 }}>{detail}</div> : null}
      </Card>
    </>
  );
};

/** A rubber stamp that slams onto a document: "SIGNED OFF ✓", "APPROVED", "SHIPPED". `rotate={0}` for a straight badge. */
export const Stamp: React.FC<{ at: number; text: string; color?: string; size?: number; rotate?: number; style?: CSSProperties }> = ({
  at,
  text,
  color = C.good,
  size = 40,
  rotate = -12,
  style,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = Math.min(1, (frame - at) / 7);
  const scale = 1.8 - 0.8 * t + (t === 1 ? Math.sin(Math.min(1, (frame - at - 7) / 6) * Math.PI) * 0.04 : 0);
  return (
    <div
      style={{
        display: 'inline-block',
        padding: `${size * 0.2}px ${size * 0.5}px`,
        border: `${Math.max(3, size * 0.11)}px solid ${color}`,
        borderRadius: size * 0.2,
        color,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
        transform: `rotate(${rotate}deg) scale(${scale})`,
        opacity: t,
        background: 'rgba(255,255,255,0.85)',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// ── Data visuals ─────────────────────────────────────────────────────────────────────────────────

/**
 * Likelihood × consequence risk matrix that fills cell by cell from `at`, then pulses the
 * highlighted cell. `cell` is [row from top, column from left].
 */
export const RiskMatrix: React.FC<{ at: number; size?: number; n?: number; cell?: [number, number]; xLabel?: string; yLabel?: string }> = ({
  at,
  size = 320,
  n = 5,
  cell,
  xLabel = 'Consequence',
  yLabel = 'Likelihood',
}) => {
  const frame = useCurrentFrame();
  const s = size / n;
  const colour = (r: number, c: number) => {
    const score = n - 1 - r + c;
    return score >= (n - 1) * 1.4 ? C.bad : score >= (n - 1) * 0.8 ? C.warn : C.good;
  };
  const pulse = cell ? 0.5 + 0.5 * Math.sin((frame - at) / 5) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: UI }}>
      <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 16, color: C.muted }}>{yLabel}</div>
      <div>
        <svg width={size} height={size}>
          {Array.from({ length: n * n }, (_, k) => {
            const r = Math.floor(k / n);
            const c = k % n;
            const o = fade(frame, at + (r + c) * 2, 8);
            return <rect key={k} x={c * s + 2} y={r * s + 2} width={s - 4} height={s - 4} rx={4} fill={colour(r, c)} opacity={o * 0.9} />;
          })}
          {cell && frame > at + 2 * n ? (
            <circle cx={cell[1] * s + s / 2} cy={cell[0] * s + s / 2} r={s * 0.22 + pulse * 3} fill={C.bg} stroke={C.white} strokeWidth={3} />
          ) : null}
        </svg>
        <div style={{ textAlign: 'center', fontSize: 16, color: C.muted, marginTop: 4 }}>{xLabel}</div>
      </div>
    </div>
  );
};

/**
 * Rows of an audit trail / activity log appearing one after another:
 * [{ time: '09:41', who: 'Integrity Lead', what: 'approved RA-1231' }].
 */
export const AuditLog: React.FC<{ at: number; rows: { time: string; who: string; what: string }[]; title?: string; width?: number; stagger?: number }> = ({
  at,
  rows,
  title = 'Audit trail',
  width = 760,
  stagger = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ width, background: C.bg, borderRadius: 18, padding: '22px 26px', boxSizing: 'border-box', fontFamily: UI, boxShadow: '0 20px 44px rgba(0,20,50,0.3)', opacity: fade(frame, at - 4, 10) }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: C.white, marginBottom: 14 }}>{title}</div>
      {rows.map((r, i) => {
        const p = enter(frame, at + i * stagger, fps, 12);
        return (
          <div key={i} style={{ display: 'flex', gap: 16, fontSize: 21, color: C.white, padding: '7px 0', opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
            <span style={{ color: C.accent, fontWeight: 700, minWidth: 64 }}>{r.time}</span>
            <span style={{ fontWeight: 700 }}>{r.who}</span>
            <span style={{ opacity: 0.8 }}>{r.what}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── Devices ──────────────────────────────────────────────────────────────────────────────────────

/** A tablet or phone bezel; put a recreated mobile screen inside. Size is the outer size in px. */
export const DeviceFrame: React.FC<{ kind?: 'tablet' | 'phone'; width: number; height: number; children: ReactNode; style?: CSSProperties }> = ({
  kind = 'tablet',
  width,
  height,
  children,
  style,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: kind === 'phone' ? 56 : 40,
      background: '#111',
      padding: kind === 'phone' ? 16 : 22,
      boxSizing: 'border-box',
      boxShadow: '0 40px 80px rgba(0,16,40,0.45)',
      flexShrink: 0,
      ...style,
    }}
  >
    <div style={{ width: '100%', height: '100%', borderRadius: kind === 'phone' ? 42 : 22, overflow: 'hidden', background: C.paper, position: 'relative', fontFamily: UI }}>{children}</div>
  </div>
);

// ── Camera ───────────────────────────────────────────────────────────────────────────────────────

/** A camera key: from frame `at`, look at point (x, y) (scene px) at zoom z. */
export interface Shot {
  at: number;
  x: number;
  y: number;
  z: number;
}

/**
 * Eased camera between keys (each move takes ~`frames`); keys in time order, the first is the
 * opening framing. Usually: whole window → zoom to the region being talked about → back out.
 * Keep z low enough that no text is cut mid-word (crop whole regions, not half a header).
 */
export const cameraAt = (frame: number, fps: number, keys: Shot[], frames = 22) => {
  let { x, y, z } = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const p = enter(frame, keys[i].at, fps, frames);
    x += (keys[i].x - x) * p;
    y += (keys[i].y - y) * p;
    z += (keys[i].z - z) * p;
  }
  return { x, y, z };
};

/** Moves its children so that scene point (x, y) sits in the centre of the frame at zoom z. */
export const Camera: React.FC<{ x: number; y: number; z: number; children: ReactNode }> = ({ x, y, z, children }) => {
  const { w, h } = useLayout();
  return <AbsoluteFill style={{ transformOrigin: '0 0', transform: `translate(${w / 2 - x * z}px, ${h / 2 - y * z}px) scale(${z})` }}>{children}</AbsoluteFill>;
};

// ── Recreated app screens ────────────────────────────────────────────────────────────────────────

/**
 * A browser window whose content is laid out at the app's *real* size (a virtual viewport of
 * vw×vh CSS px, e.g. 1280×760) and scaled to `width` on screen. Build the product's screen inside
 * at true 1:1 sizes, copying its real layout, so it looks like the app instead of a sketch of it.
 * Use `appToScene` to aim the Camera or a Cursor at a point of the app.
 */
export const AppFrame: React.FC<{
  width: number;
  vw?: number;
  vh?: number;
  title?: string;
  left?: number;
  top?: number;
  background?: string;
  children: ReactNode;
}> = ({ width, vw = 1280, vh = 760, title, left = 0, top = 0, background = C.paper, children }) => {
  const s = width / vw;
  const bar = 34;
  return (
    <div style={{ position: 'absolute', left, top, width, height: (vh + bar) * s, borderRadius: 14, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,16,40,0.45), 0 8px 24px rgba(0,16,40,0.25)' }}>
      <div style={{ width: vw, height: vh + bar, transform: `scale(${s})`, transformOrigin: '0 0', background, fontFamily: UI }}>
        <div style={{ height: bar, background: '#e6ebf0', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 7 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />
          ))}
          {title ? <div style={{ marginLeft: 14, padding: '5px 14px', background, borderRadius: '7px 7px 0 0', fontSize: 12, color: C.ink, alignSelf: 'flex-end' }}>{title}</div> : null}
        </div>
        <div style={{ position: 'relative', width: vw, height: vh, overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  );
};

/** Point in the app's virtual px → scene px, for an AppFrame placed at (left, top) with `width`. */
export const appToScene = (frame: { left: number; top: number; width: number; vw?: number }, x: number, y: number) => {
  const s = frame.width / (frame.vw ?? 1280);
  return { x: frame.left + x * s, y: frame.top + (34 + y) * s };
};
