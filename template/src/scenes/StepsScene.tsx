import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { enter, fade, pop } from '../components/anim';
import { Icon } from '../components/icons';
import { useLayout } from '../components/layout';
import { Backdrop, Kinetic } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { C, DISPLAY } from '../brand';

interface Step {
  label: string;
  icon?: string;
  cue?: string;
}

/**
 * A process. props: { steps: Step[] (2–6), layout?: 'ring'|'row' (default ring for 3+ steps),
 * title?: string, titleAccent?: string[], hub?: string, hubIcon?: string, hubCue?: string,
 * tone?: 'light'|'dark' (default light) }
 * Steps light up on their cues; a ring closes the loop; the hub pops in the middle.
 */
export const StepsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue } = useScene();
  const { w, h, u, portrait } = useLayout();
  const steps = ((props.steps as Step[]) ?? []).slice(0, 6);
  const layout = (props.layout as 'ring' | 'row' | undefined) ?? (steps.length >= 3 ? 'ring' : 'row');
  const tone = (props.tone as 'light' | 'dark' | undefined) ?? 'light';
  const title = props.title as string | undefined;
  const hub = props.hub as string | undefined;
  const ink = tone === 'light' ? C.bg : C.white;

  let prev = title ? 20 : 6;
  const lit = steps.map((s) => (prev = or(cue(s.cue), prev + 18)));
  const hubAt = or(cue(props.hubCue), lit[lit.length - 1] + 18);
  const titleBlock = title ? (
    <div style={{ position: 'absolute', top: portrait ? 150 : 70, left: 60, right: 60 }}>
      <Kinetic text={title} start={4} size={(portrait ? 64 : 70) * u} color={ink} accentColor={C.primary} accent={props.titleAccent as string[] | undefined} />
    </div>
  ) : null;

  const badge = (s: Step, i: number, size: number) => {
    const p = pop(frame, lit[i], fps);
    const on = frame >= lit[i];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 * u, transform: `scale(${0.8 + 0.2 * Math.min(p, 1.1)})` }}>
        <div
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            background: on ? C.primary : tone === 'light' ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.08)',
            border: `4px solid ${on ? C.highlight : 'transparent'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: on ? '0 16px 36px rgba(0,30,60,0.3)' : 'none',
          }}
        >
          <Icon name={s.icon ?? 'check'} size={size * 0.5} color={on ? C.white : tone === 'light' ? C.muted : C.soft} />
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40 * u, color: on ? ink : tone === 'light' ? C.muted : C.soft, whiteSpace: 'nowrap' }}>{s.label}</div>
      </div>
    );
  };

  if (layout === 'row') {
    return (
      <Backdrop tone={tone}>
        {titleBlock}
        <AbsoluteFill style={{ flexDirection: portrait ? 'column' : 'row', justifyContent: 'center', alignItems: 'center', gap: 30 * u, paddingTop: title ? (portrait ? 260 : 120) : 0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: portrait ? 'column' : 'row', alignItems: 'center', gap: 30 * u }}>
              {badge(s, i, (portrait ? Math.min(220, (h - (title ? 300 : 80)) / steps.length - 150) : 170) * u)}
              {i < steps.length - 1 ? (
                <div style={{ opacity: fade(frame, lit[i] + 4, 10), transform: portrait ? 'rotate(90deg)' : undefined }}>
                  <Icon name="arrow" size={70 * u} color={tone === 'light' ? C.bg : C.highlight} />
                </div>
              ) : null}
            </div>
          ))}
        </AbsoluteFill>
      </Backdrop>
    );
  }

  // ring: as large as the space allows, labels outside the ring so the hub has the middle
  const titleSpace = title ? (portrait ? 300 : 150) : 0;
  const node = (steps.length > 4 ? 120 : 140) * u;
  const labelRoom = 70 * u;
  const cx = w / 2;
  const cy = titleSpace + (h - titleSpace) / 2;
  // side labels must fit between the node and the frame edge (≈0.62 em per character at weight 800)
  const labelW = Math.max(...steps.map((st) => st.label.length)) * 42 * u * 0.62;
  const R = Math.max(150, Math.min((h - titleSpace - node - 2 * labelRoom) / 2 - 10, w / 2 - node / 2 - 18 * u - labelW - 40));
  const angle = (i: number) => -90 + (360 / steps.length) * i;
  const pt = (a: number, r = R) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)] as const;
  // leave a gap round each node: its angular half-width plus a little air
  const gap = ((Math.asin(Math.min(1, (node / 2 + 18 * u) / R)) * 180) / Math.PI);

  return (
    <Backdrop tone={tone}>
      {titleBlock}
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {steps.map((_, i) => {
          const a1 = angle(i) + gap;
          const a2 = angle(i + 1) - gap;
          const [x1, y1] = pt(a1);
          const [x2, y2] = pt(a2);
          const drawAt = i + 1 < steps.length ? lit[i + 1] - 10 : lit[i] + 14;
          const d = enter(frame, drawAt, fps, 14);
          const [ax, ay] = pt(a2 - 1.5);
          const head = Math.atan2(y2 - ay, x2 - ax);
          const hs = 18 * u;
          return (
            <g key={i} opacity={0.9}>
              <path
                d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={tone === 'light' ? C.bg : C.highlight}
                strokeWidth={8 * u}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - d}
              />
              <path
                d={`M ${x2 - hs * Math.cos(head - 0.5)} ${y2 - hs * Math.sin(head - 0.5)} L ${x2} ${y2} L ${x2 - hs * Math.cos(head + 0.5)} ${y2 - hs * Math.sin(head + 0.5)}`}
                fill="none"
                stroke={tone === 'light' ? C.bg : C.highlight}
                strokeWidth={8 * u}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={d > 0.95 ? 1 : 0}
              />
            </g>
          );
        })}
      </svg>
      {steps.map((s, i) => {
        const [x, y] = pt(angle(i));
        const on = frame >= lit[i];
        const p = pop(frame, lit[i], fps);
        const a = angle(i);
        const cos = Math.cos((a * Math.PI) / 180);
        const sin = Math.sin((a * Math.PI) / 180);
        // label sits outside the node, away from the centre
        const side = Math.abs(cos) > 0.35 ? (cos > 0 ? 'right' : 'left') : sin < 0 ? 'top' : 'bottom';
        const labelStyle: React.CSSProperties =
          side === 'right'
            ? { left: x + node / 2 + 18 * u, top: y, transform: 'translateY(-50%)' }
            : side === 'left'
              ? { right: w - (x - node / 2 - 18 * u), top: y, transform: 'translateY(-50%)' }
              : side === 'top'
                ? { left: x, bottom: h - (y - node / 2 - 10 * u), transform: 'translateX(-50%)' }
                : { left: x, top: y + node / 2 + 10 * u, transform: 'translateX(-50%)' };
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                left: x - node / 2,
                top: y - node / 2,
                width: node,
                height: node,
                borderRadius: node / 2,
                background: on ? C.primary : tone === 'light' ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.08)',
                border: `4px solid ${on ? C.highlight : 'transparent'}`,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: on ? '0 16px 36px rgba(0,30,60,0.3)' : 'none',
                transform: `scale(${0.8 + 0.2 * Math.min(p, 1.1)})`,
              }}
            >
              <Icon name={s.icon ?? 'check'} size={node * 0.5} color={on ? C.white : tone === 'light' ? C.muted : C.soft} />
            </div>
            <div style={{ position: 'absolute', ...labelStyle, fontFamily: DISPLAY, fontWeight: 800, fontSize: 42 * u, color: on ? ink : tone === 'light' ? C.muted : C.soft, whiteSpace: 'nowrap' }}>
              {s.label}
            </div>
          </div>
        );
      })}
      {hub ? (
        <div
          style={{
            position: 'absolute',
            left: cx - R * 0.7,
            top: cy - R * 0.5,
            width: R * 1.4,
            height: R,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transform: `scale(${pop(frame, hubAt, fps)})`,
          }}
        >
          {props.hubIcon ? <Icon name={props.hubIcon as string} size={Math.min(110, R * 0.36) * u} color={tone === 'light' ? C.primary : C.highlight} /> : null}
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: Math.min(48, R * 0.16) * u, color: ink, textAlign: 'center', lineHeight: 1.1 }}>{hub}</div>
        </div>
      ) : null}
    </Backdrop>
  );
};
