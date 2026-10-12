import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { enter, pop } from '../components/anim';
import { useLayout } from '../components/layout';
import { Avatar, Backdrop, Kinetic } from '../components/ui';
import { or, useScene } from '../SceneContext';
import { C, DISPLAY, UI } from '../brand';

interface Person {
  role: string;
  initials: string;
  /** The task that lands in their inbox, e.g. "Review inspection report". */
  task: string;
  /** Small label on the task card, e.g. a workflow stage. */
  stage?: string;
  cue?: string;
}

/**
 * Everyone gets their own work. props: { people: Person[] (2–4), title?: string,
 * titleAccent?: string[], footer?: string, footerCue?: string, tone?: 'dark'|'light' }
 */
export const RolesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { props, cue } = useScene();
  const { w, u, narrow: portrait } = useLayout();
  const people = ((props.people as Person[]) ?? []).slice(0, 4);
  const tone = (props.tone as 'dark' | 'light' | undefined) ?? 'dark';
  const title = props.title as string | undefined;
  const footer = props.footer as string | undefined;
  let prev = title ? 16 : 4;
  // the first card never waits on its cue, so the scene is not empty while the voice catches up
  const ats = people.map((p, i) => (prev = i === 0 && !title ? Math.min(or(cue(p.cue), 6), 6) : or(cue(p.cue), prev + 12)));
  const footerAt = or(cue(props.footerCue), ats[ats.length - 1] + 30);
  const colW = portrait ? w - 140 : Math.min(460, (w - 200) / people.length - 30);
  const ink = tone === 'dark' ? C.white : C.bg;

  return (
    <Backdrop tone={tone}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 56 * u, padding: 60 }}>
        {title ? <Kinetic text={title} start={4} size={(portrait ? 62 : 68) * u} color={ink} accentColor={tone === 'dark' ? C.highlight : C.primary} accent={props.titleAccent as string[] | undefined} style={{ maxWidth: w * 0.85 }} /> : null}
        <div style={{ display: 'flex', flexDirection: portrait ? 'column' : 'row', gap: portrait ? 28 : 30, alignItems: portrait ? 'stretch' : 'flex-start' }}>
          {people.map((p, i) => {
            const a = pop(frame, ats[i], fps);
            const card = enter(frame, ats[i] + 10, fps, 16);
            return (
              <div key={i} style={{ width: colW, display: 'flex', flexDirection: portrait ? 'row' : 'column', alignItems: 'center', gap: 22, opacity: Math.min(1, a * 2) }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transform: `scale(${0.6 + 0.4 * Math.min(a, 1.1)})`, width: portrait ? 160 : undefined }}>
                  <Avatar initials={p.initials} size={(portrait ? 110 : 150) * u} bg={[C.primary, C.accent, C.muted, C.primaryLight][i % 4]} ring={C.white} />
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: (portrait ? 32 : 40) * u, color: ink, textAlign: 'center', whiteSpace: 'nowrap' }}>{p.role}</div>
                </div>
                <div
                  style={{
                    flex: portrait ? 1 : undefined,
                    width: portrait ? undefined : '100%',
                    boxSizing: 'border-box',
                    background: C.white,
                    borderRadius: 16,
                    padding: '24px 26px',
                    borderLeft: `6px solid ${C.highlight}`,
                    boxShadow: '0 18px 40px rgba(0,20,50,0.3)',
                    fontFamily: UI,
                    opacity: card,
                    transform: `translateY(${(1 - card) * -40}px)`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 6, background: C.bad }} />
                    {p.stage ?? 'New task'}
                  </div>
                  <div style={{ fontSize: 33, fontWeight: 700, color: C.ink, marginTop: 8, lineHeight: 1.2 }}>{p.task}</div>
                </div>
              </div>
            );
          })}
        </div>
        {footer && frame >= footerAt ? <Kinetic text={footer} start={footerAt} size={44 * u} weight={700} color={tone === 'dark' ? C.softLight : C.bg} stagger={2} style={{ maxWidth: w * 0.85 }} /> : null}
      </AbsoluteFill>
    </Backdrop>
  );
};
