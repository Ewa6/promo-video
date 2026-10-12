import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BRAND, C, DISPLAY, UI } from '../brand';
import { enter } from './anim';
import { useLayout } from './layout';

/** Children of a backdrop live above the caption band (see useLayout). */
const Content: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { h } = useLayout();
  return <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: h }}>{children}</div>;
};

const texture = (frame: number, line: string, size: number): CSSProperties => {
  const offset = (frame * 0.25) % size;
  if (BRAND.backdrop === 'plain') return {};
  if (BRAND.backdrop === 'dots') {
    return {
      backgroundImage: `radial-gradient(${line} 2px, transparent 2.5px)`,
      backgroundSize: `${size}px ${size}px`,
      backgroundPosition: `${offset}px ${offset}px`,
    };
  }
  return {
    backgroundImage: `linear-gradient(${line} 1.5px, transparent 1.5px), linear-gradient(90deg, ${line} 1.5px, transparent 1.5px)`,
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: `${offset}px ${offset}px`,
  };
};

/** Light secondary backdrop ("paper" scenes): brand soft colour with a slowly drifting texture. */
export const LightBackdrop: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: C.soft, ...texture(frame, C.softLine, 64) }}>
      <Content>{children}</Content>
    </AbsoluteFill>;
};

/** Dark "product" backdrop with a soft brand glow. */
export const DarkBackdrop: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, ...texture(frame, 'rgba(255,255,255,0.05)', 72) }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${C.primary}47, transparent 65%)` }} />
      <Content>{children}</Content>
    </AbsoluteFill>
  );
};

/** Clean white/paper backdrop used for logo moments. */
export const PaperBackdrop: React.FC<{ children?: ReactNode; style?: CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${C.white} 0%, ${C.paper} 70%, #e4ebf0 100%)`, ...style }}>
    <Content>{children}</Content>
  </AbsoluteFill>
);

export const Backdrop: React.FC<{ tone?: 'dark' | 'light' | 'paper'; children?: ReactNode }> = ({ tone = 'dark', children }) =>
  tone === 'light' ? <LightBackdrop>{children}</LightBackdrop> : tone === 'paper' ? <PaperBackdrop>{children}</PaperBackdrop> : <DarkBackdrop>{children}</DarkBackdrop>;

const wordKey = (w: string) => w.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9']/g, '');

/** Words rise into place one after another. `accent` words (lower-case) take the highlight colour. */
export const Kinetic: React.FC<{
  text: string;
  start: number;
  size: number;
  color?: string;
  accentColor?: string;
  accent?: string[];
  weight?: number;
  stagger?: number;
  align?: 'left' | 'center' | 'right';
  style?: CSSProperties;
}> = ({ text, start, size, color = C.white, accentColor = C.highlight, accent = [], weight = 800, stagger = 3, align = 'center', style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const justify = align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end';
  const accents = accent.map(wordKey);
  return (
    <div
      style={{
        fontFamily: DISPLAY,
        fontWeight: weight,
        fontSize: size,
        color,
        lineHeight: 1.1,
        letterSpacing: '-0.01em',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: justify,
        textAlign: align,
        columnGap: size * 0.26,
        ...style,
      }}
    >
      {text.split(' ').map((word, i) => {
        const p = enter(frame, start + i * stagger, fps, 18);
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', padding: `0 0 ${size * 0.14}px` }}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 105}%)`,
                opacity: p,
                color: accents.includes(wordKey(word)) ? accentColor : undefined,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/**
 * The official lockup from public/brand (colour on light backgrounds, white on dark), or a
 * typeset wordmark of BRAND.name when no logo file is configured.
 */
export const Logo: React.FC<{ width: number; variant?: 'colour' | 'white'; style?: CSSProperties }> = ({ width, variant = 'colour', style }) => {
  // a missing variant falls back to the wordmark, never to the other variant (white on paper is invisible)
  const src = BRAND.logo[variant];
  if (src) return <Img src={staticFile(src)} style={{ width, height: 'auto', ...style }} />;
  const mark = BRAND.mark ? <Img src={staticFile(BRAND.mark)} style={{ height: width * 0.16, width: 'auto' }} /> : null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: width * 0.04, ...style }}>
      {mark}
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: Math.min(width * 0.16, (width * 1.7) / Math.max(4, BRAND.name.length)),
          color: variant === 'white' ? C.white : C.bg,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        {BRAND.name}
      </div>
    </div>
  );
};

/** Initials avatar. */
export const Avatar: React.FC<{ initials: string; size: number; bg?: string; ring?: string }> = ({ initials, size, bg = C.muted, ring = C.primary }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: bg,
      boxShadow: `0 0 0 ${Math.max(2, size * 0.05)}px ${ring}`,
      color: C.white,
      fontFamily: UI,
      fontWeight: 700,
      fontSize: size * 0.36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

/** A browser window with the product's chrome: brand navbar, module menu, initials avatar. */
export const AppWindow: React.FC<{
  width: number;
  height: number;
  active?: string;
  children: ReactNode;
  chrome?: boolean;
  style?: CSSProperties;
}> = ({ width, height, active, children, chrome = true, style }) => {
  const compact = width < 1100;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 16,
        overflow: 'hidden',
        background: C.paper,
        boxShadow: '0 40px 90px rgba(0,16,40,0.45), 0 8px 24px rgba(0,16,40,0.25)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: UI,
        flexShrink: 0,
        ...style,
      }}
    >
      <div style={{ height: 40, background: '#e6ebf0', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 9, flexShrink: 0 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
        ))}
        <div style={{ marginLeft: 18, padding: '6px 18px', background: C.paper, borderRadius: '8px 8px 0 0', fontSize: 14, color: C.ink, alignSelf: 'flex-end' }}>
          {BRAND.app.title}
        </div>
      </div>
      {chrome ? (
        <div
          style={{
            height: 64,
            background: C.bg,
            borderTop: `5px solid ${C.primary}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 26px',
            gap: compact ? 20 : 32,
            flexShrink: 0,
          }}
        >
          <Logo width={compact ? 120 : 150} variant="white" />
          {(compact ? BRAND.app.menu.slice(0, 3) : BRAND.app.menu).map((item) => (
            <div
              key={item}
              style={{
                color: C.white,
                opacity: item === active ? 1 : 0.72,
                fontSize: 17,
                fontWeight: item === active ? 700 : 400,
                paddingBottom: 4,
                borderBottom: item === active ? `3px solid ${C.accent}` : '3px solid transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {item}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <Avatar initials={BRAND.app.initials} size={38} />
        </div>
      ) : null}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>
    </div>
  );
};

/** White rounded card used for callouts. */
export const Card: React.FC<{ children: ReactNode; style?: CSSProperties; accent?: string }> = ({ children, style, accent = C.primary }) => (
  <div
    style={{
      background: C.white,
      borderRadius: 14,
      borderLeft: `6px solid ${accent}`,
      boxShadow: '0 18px 40px rgba(0,30,60,0.22)',
      padding: '18px 24px',
      fontFamily: DISPLAY,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Rounded label, e.g. "No re-typing". */
export const Pill: React.FC<{ children: ReactNode; bg?: string; color?: string; size?: number; style?: CSSProperties }> = ({
  children,
  bg = C.bg,
  color = C.white,
  size = 34,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.4,
      padding: `${size * 0.47}px ${size * 0.88}px`,
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: size,
      whiteSpace: 'nowrap',
      boxShadow: '0 12px 30px rgba(0,20,50,0.25)',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small caption in a corner: data provenance ("Illustrative data", "Source: …"). Required for numbers. */
export const Footnote: React.FC<{ children: ReactNode; opacity?: number; color?: string; position?: 'top' | 'bottom' }> = ({
  children,
  opacity = 1,
  color = C.white,
  position = 'top',
}) => (
  <div
    style={{
      position: 'absolute',
      left: 60,
      right: 60,
      [position]: 50,
      textAlign: 'center',
      fontFamily: DISPLAY,
      fontWeight: 500,
      fontSize: 24,
      color,
      opacity: 0.65 * opacity,
    }}
  >
    {children}
  </div>
);

/** Mouse pointer that glides between waypoints and ripples on clicks. */
export const Cursor: React.FC<{ path: { x: number; y: number; at: number }[]; clicks?: number[] }> = ({ path, clicks = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let x = path[0].x;
  let y = path[0].y;
  for (let i = 1; i < path.length; i++) {
    const p = enter(frame, path[i].at, fps, 20);
    x += (path[i].x - path[i - 1].x) * p;
    y += (path[i].y - path[i - 1].y) * p;
  }
  const visible = frame >= path[0].at;
  return (
    <>
      {clicks.map((c) => {
        const t = (frame - c) / 18;
        if (t < 0 || t > 1) return null;
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: x - 40 * t,
              top: y - 40 * t,
              width: 80 * t,
              height: 80 * t,
              borderRadius: '50%',
              border: `4px solid ${C.accent}`,
              opacity: 1 - t,
            }}
          />
        );
      })}
      <svg
        width={44}
        height={44}
        viewBox="0 0 24 24"
        style={{ position: 'absolute', left: x - 6, top: y - 3, opacity: visible ? 1 : 0, filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))' }}
      >
        <path d="M5 2 L5 20 L9.5 15.5 L12.5 22 L15.5 20.7 L12.6 14.4 L19 14.4 Z" fill={C.white} stroke={C.ink} strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </>
  );
};
