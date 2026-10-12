import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, DISPLAY, UI } from '../theme';
import { enter } from './anim';

/** A squared "engineering paper" backdrop, drifting very slowly. */
export const Grid: React.FC<{ base?: string; line?: string; size?: number; children?: ReactNode }> = ({
  base = C.soft,
  line = C.softLine,
  size = 64,
  children,
}) => {
  const frame = useCurrentFrame();
  const offset = (frame * 0.25) % size;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: base,
        backgroundImage: `linear-gradient(${line} 1.5px, transparent 1.5px), linear-gradient(90deg, ${line} 1.5px, transparent 1.5px)`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `${offset}px ${offset}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Navy variant used for "product" scenes. */
export const DarkGrid: React.FC<{ children?: ReactNode }> = ({ children }) => (
  <Grid base={C.base} line="rgba(255,255,255,0.05)" size={72}>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(90,79,168,0.28), transparent 65%)' }} />
    {children}
  </Grid>
);

/** Words rise into place one after another. */
export const Kinetic: React.FC<{
  text: string;
  start: number;
  size: number;
  color?: string;
  accent?: string;
  accentWords?: string[];
  weight?: number;
  stagger?: number;
  align?: 'left' | 'center' | 'right';
  style?: CSSProperties;
}> = ({ text, start, size, color = C.white, accent = C.highlight, accentWords = [], weight = 800, stagger = 3, align = 'center', style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const justify = align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end';
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
        columnGap: size * 0.26,
        ...style,
      }}
    >
      {text.split(' ').map((word, i) => {
        const p = enter(frame, start + i * stagger, fps, 18);
        const key = word.toLowerCase().replace(/[^a-z0-9']/g, '');
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', padding: `0 0 ${size * 0.14}px` }}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 105}%)`,
                opacity: p,
                color: accentWords.includes(key) ? accent : undefined,
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

/** Logo lockup from public/brand (colour for light backgrounds, white for dark). LOGO_RATIO = width / height. */
const LOGO_RATIO = 3.2;

export const Logo: React.FC<{ width: number; variant?: 'colour' | 'white'; style?: CSSProperties }> = ({ width, variant = 'colour', style }) => (
  <Img src={staticFile(`brand/logo-${variant}.png`)} style={{ width, height: width / LOGO_RATIO, ...style }} />
);

/** Just the mark at the left of the lockup, cropped from it. */
export const LogoMark: React.FC<{ size: number; variant?: 'colour' | 'white' }> = ({ size, variant = 'colour' }) => (
  <div style={{ width: size * 0.97, height: size, overflow: 'hidden', flexShrink: 0 }}>
    <Img src={staticFile(`brand/logo-${variant}.png`)} style={{ height: size, width: size * LOGO_RATIO }} />
  </div>
);

const MENU = ['Home', 'Tasks', 'Assets', 'Work Orders', 'Dashboards', 'Reports', 'Data'];

/**
 * A browser window showing the product's own chrome: dark navbar with a 5px primary-colour top border,
 * white lockup, module menu and the initials avatar.
 */
export const AppWindow: React.FC<{
  width: number;
  height: number;
  active?: string;
  initials?: string;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ width, height, active, initials = 'AE', children, style }) => (
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
      ...style,
    }}
  >
    <div style={{ height: 40, background: '#e6ebf0', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 9 }}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
      ))}
      <div style={{ marginLeft: 18, padding: '6px 18px', background: C.paper, borderRadius: '8px 8px 0 0', fontSize: 14, color: C.ink, alignSelf: 'flex-end' }}>
        Acme Integrity
      </div>
    </div>
    <div
      style={{
        height: 68,
        background: C.base,
        borderTop: `5px solid ${C.primary}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 26px',
        gap: 34,
        flexShrink: 0,
      }}
    >
      <Logo width={150} variant="white" />
      {MENU.map((item) => (
        <div
          key={item}
          style={{
            color: C.white,
            opacity: item === active ? 1 : 0.72,
            fontSize: 17,
            fontWeight: item === active ? 700 : 400,
            paddingBottom: 4,
            borderBottom: item === active ? `3px solid ${C.accent}` : '3px solid transparent',
          }}
        >
          {item}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          background: '#6E89A0',
          boxShadow: `0 0 0 2px ${C.primary}`,
          color: C.white,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {initials}
      </div>
    </div>
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>
  </div>
);

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
export const Pill: React.FC<{ children: ReactNode; bg?: string; color?: string; style?: CSSProperties }> = ({
  children,
  bg = C.base,
  color = C.white,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: '16px 30px',
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: 34,
      boxShadow: '0 12px 30px rgba(0,20,50,0.25)',
      ...style,
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
