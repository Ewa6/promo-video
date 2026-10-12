import { C } from '../theme';

export type IconName = 'plan' | 'inspection' | 'anomaly' | 'repair' | 'vessel' | 'pipework' | 'structure' | 'check' | 'cross';

/** Minimal line icons, drawn on a 48×48 grid. */
export const Icon: React.FC<{ name: IconName; size: number; color?: string; stroke?: number }> = ({ name, size, color = C.white, stroke = 3.5 }) => {
  const common = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {name === 'plan' && (
        <g {...common}>
          <rect x={10} y={8} width={28} height={34} rx={3} />
          <rect x={18} y={4} width={12} height={8} rx={2} />
          <path d="M16 22h16M16 29h16M16 36h9" />
        </g>
      )}
      {name === 'inspection' && (
        <g {...common}>
          <circle cx={21} cy={21} r={12} />
          <path d="M30 30l11 11" />
        </g>
      )}
      {name === 'anomaly' && (
        <g {...common}>
          <path d="M24 6L44 40H4Z" />
          <path d="M24 19v10M24 34v1" />
        </g>
      )}
      {name === 'repair' && (
        <g {...common}>
          <path d="M30 6a10 10 0 0 0-9 14L7 34a4 4 0 0 0 6 6l14-14A10 10 0 0 0 41 17l-6 6-6-2-2-6 6-6a10 10 0 0 0-3-3z" />
        </g>
      )}
      {name === 'vessel' && (
        <g {...common}>
          <rect x={6} y={14} width={36} height={18} rx={9} />
          <path d="M14 32l-3 8M34 32l3 8M18 14V9M30 14V9" />
        </g>
      )}
      {name === 'pipework' && (
        <g {...common}>
          <path d="M4 14h18a8 8 0 0 1 8 8v4a8 8 0 0 0 8 8h6" />
          <path d="M4 22h18v4a16 16 0 0 0 16 16h6" opacity={0} />
          <path d="M10 10v8M38 30v8" />
        </g>
      )}
      {name === 'structure' && (
        <g {...common}>
          <path d="M8 42L16 8h16l8 34" />
          <path d="M12 26h24M16 8l14 18M32 8L18 26M12 26l26 16M36 26L10 42" />
        </g>
      )}
      {name === 'check' && (
        <g {...common}>
          <path d="M9 25l10 10 20-22" />
        </g>
      )}
      {name === 'cross' && (
        <g {...common}>
          <path d="M12 12l24 24M36 12L12 36" />
        </g>
      )}
    </svg>
  );
};
