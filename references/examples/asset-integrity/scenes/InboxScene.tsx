import { useCurrentFrame, useVideoConfig } from 'remotion';
import { or, useScene } from '../SceneContext';
import { enter, fade, pop } from '../components/anim';
import { AppWindow, Kinetic, DarkGrid } from '../components/ui';
import { C, UI } from '../theme';

interface Task {
  stage: string;
  ref: string;
  due: string;
  color: string;
}

// Invented inbox and workflow-stage names, in the style of a real product's Workflow menu.
const ROLES: { name: string; initials: string; re: RegExp | null; tasks: Task[] }[] = [
  {
    name: 'Integrity Lead',
    initials: 'IL',
    re: /^lead/,
    tasks: [
      { stage: 'Assessment', ref: 'RA-1231 · V-210 Inlet Scrubber', due: 'Due in 3 days', color: C.primary },
      { stage: 'Ready for Sign-off', ref: 'INSP-7734 · 4"-P-2210 pipework', due: 'Due today', color: C.blue },
      { stage: 'Defect Logged', ref: 'DEF-0417 · risk ranking required', due: 'Overdue', color: C.high },
      { stage: 'Certificate Approval', ref: 'CRT-1098 · V-330 Flash Drum', due: 'Due in 6 days', color: C.teal },
      { stage: 'Pending Assessment', ref: 'E-415 Lube Oil Cooler · CUI assessment done', due: 'Due in 12 days', color: C.primary },
    ],
  },
  {
    name: 'Work Scheduler',
    initials: 'WS',
    re: /^scheduler/,
    tasks: [
      { stage: 'Job Pack Approval', ref: 'JP-3142 · Topsides campaign', due: 'Due today', color: C.primary },
      { stage: 'Inspection Planned', ref: 'JP-3139 · 18 items', due: 'Due in 4 days', color: C.blue },
      { stage: 'In the Field', ref: 'JP-3137 · 42 of 60 complete', due: 'On track', color: C.teal },
      { stage: 'Job Pack Approval', ref: 'JP-3144 · Pipework UT survey', due: 'Due in 5 days', color: C.primary },
    ],
  },
  {
    name: 'Site Supervisor',
    initials: 'RS',
    re: null,
    tasks: [],
  },
  {
    name: 'Fabric Crew',
    initials: 'FC',
    re: /^crew/,
    tasks: [
      { stage: 'Paint Repair', ref: 'DEF-0388 · coating breakdown, deck 2', due: 'Due in 2 days', color: C.medium },
      { stage: 'Paint Repair', ref: 'DEF-0391 · corrosion at pipe support', due: 'Due in 9 days', color: C.medium },
      { stage: 'Close-out Check', ref: 'DEF-0352 · evidence uploaded', due: 'Due today', color: C.teal },
      { stage: 'Paint Repair', ref: 'DEF-0399 · handrail coating, cellar deck', due: 'Due in 14 days', color: C.medium },
    ],
  },
];
const COUNTS = [5, 4, 6, 4];

/** Every role gets its own inbox of tasks, switching on "lead, scheduler and crew". */
export const InboxScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { word } = useScene();

  const switches = [
    { role: 0, at: or(word(/^lead/), 6) },
    { role: 1, at: or(word(/^scheduler/), 30) },
    { role: 3, at: or(word(/^crew/), 54) },
  ];
  const current = [...switches].reverse().find((s) => frame >= s.at) ?? switches[0];
  const role = ROLES[current.role];
  const responsibleAt = word(/^responsible/);
  const nextAt = word(/^next/);
  const windowIn = enter(frame, 0, fps, 22);

  return (
    <DarkGrid>
      <div style={{ position: 'absolute', top: 40, left: 0, right: 0 }}>
        <Kinetic text="Every team. Its own queue." start={4} size={60} accentWords={['own', 'queue']} />
      </div>
      <AppWindow
        width={1600}
        height={840}
        active="Tasks"
        initials={role.initials}
        style={{ position: 'absolute', left: 160, top: 170, transform: `translateY(${(1 - windowIn) * 80}px)`, opacity: windowIn }}
      >
        <div style={{ display: 'flex', height: '100%', fontFamily: UI }}>
          <div style={{ width: 380, background: C.white, borderRight: `1px solid ${C.hairline}`, padding: '26px 0' }}>
            <div style={{ padding: '0 26px 16px', fontSize: 20, fontWeight: 700, color: C.base, textTransform: 'uppercase', letterSpacing: 1 }}>Inboxes</div>
            {ROLES.map((r, i) => {
              const selected = i === current.role;
              return (
                <div
                  key={r.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 26px',
                    fontSize: 23,
                    background: selected ? C.base : 'transparent',
                    color: selected ? C.white : C.ink,
                    fontWeight: selected ? 700 : 400,
                  }}
                >
                  {r.name}
                  <span
                    style={{
                      minWidth: 34,
                      padding: '3px 10px',
                      borderRadius: 999,
                      textAlign: 'center',
                      fontSize: 18,
                      fontWeight: 700,
                      background: selected ? C.accent : '#e9edf1',
                      color: selected ? C.base : C.muted,
                    }}
                  >
                    {COUNTS[i]}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ flex: 1, padding: '30px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
              <div style={{ fontSize: 34, fontWeight: 700, color: C.base }}>My inbox — {role.name}</div>
              {responsibleAt !== null ? (
                <div style={{ fontSize: 22, color: C.primary, fontWeight: 700, opacity: fade(frame, responsibleAt) }}>
                  {role.tasks.length} tasks assigned to you
                </div>
              ) : null}
            </div>
            {role.tasks.map((t, i) => {
              const p = enter(frame, current.at + i * 4, fps, 16);
              const isNext = i === 0 && nextAt !== null && frame >= nextAt;
              const nextPop = nextAt !== null ? pop(frame, nextAt, fps) : 0;
              return (
                <div
                  key={`${current.role}-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 22,
                    padding: '24px 28px',
                    background: C.white,
                    borderRadius: 10,
                    borderLeft: `7px solid ${t.color}`,
                    boxShadow: isNext ? `0 0 0 4px ${C.highlight}, 0 10px 24px rgba(0,30,60,0.15)` : '0 4px 12px rgba(0,30,60,0.08)',
                    transform: `translateX(${(1 - p) * 120}px)`,
                    opacity: p,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{t.stage}</div>
                    <div style={{ fontSize: 22, color: C.muted, marginTop: 6 }}>{t.ref}</div>
                  </div>
                  {isNext ? (
                    <div
                      style={{
                        padding: '8px 18px',
                        borderRadius: 999,
                        background: C.highlight,
                        color: C.base,
                        fontWeight: 700,
                        fontSize: 20,
                        transform: `scale(${nextPop})`,
                      }}
                    >
                      Next ▸
                    </div>
                  ) : null}
                  <div
                    style={{
                      padding: '8px 16px',
                      borderRadius: 6,
                      fontSize: 19,
                      fontWeight: 700,
                      background: t.due === 'Overdue' ? '#fde3e2' : '#eef2f6',
                      color: t.due === 'Overdue' ? C.high : C.muted,
                    }}
                  >
                    {t.due}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AppWindow>
    </DarkGrid>
  );
};
