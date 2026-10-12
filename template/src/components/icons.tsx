import { C } from '../brand';

/** Minimal line icons on a 48×48 grid. Add product-specific ones here (keep the stroke style). */
const PATHS = {
  check: 'M9 25l10 10 20-22',
  cross: 'M12 12l24 24M36 12L12 36',
  plus: 'M24 10v28M10 24h28',
  arrow: 'M8 24h30M28 14l10 10-10 10',
  search: 'M21 9a12 12 0 1 1 0 24a12 12 0 1 1 0-24zM30 30l11 11',
  file: 'M12 5h16l10 10v28H12zM28 5v10h10M18 25h14M18 32h14',
  sheet: 'M8 8h32v32H8zM8 18h32M8 28h32M19 8v32M30 8v32',
  folder: 'M5 12h14l4 5h20v23H5z',
  mail: 'M5 11h38v26H5zM5 13l19 14 19-14',
  inbox: 'M6 8h36v32H6zM6 27h10l3 6h10l3-6h10',
  chat: 'M6 9h36v23H20l-9 8v-8H6z',
  bell: 'M24 6a11 11 0 0 1 11 11v10l4 6H9l4-6V17A11 11 0 0 1 24 6zM20 38a4 4 0 0 0 8 0',
  calendar: 'M7 10h34v31H7zM7 19h34M16 5v9M32 5v9M15 27h4M22 27h4M29 27h4M15 33h4',
  clock: 'M24 6a18 18 0 1 1 0 36a18 18 0 1 1 0-36zM24 14v11l7 5',
  user: 'M24 8a8 8 0 1 1 0 16a8 8 0 1 1 0-16zM9 41c1-9 7-13 15-13s14 4 15 13',
  users: 'M18 10a7 7 0 1 1 0 14a7 7 0 1 1 0-14zM4 40c1-8 6-12 14-12s13 4 14 12M32 12a6 6 0 0 1 0 12M36 28c5 1 8 5 8 12',
  chart: 'M6 6v36h36M14 34V24M22 34V16M30 34V26M38 34V12',
  trend: 'M6 36l12-12 8 8 16-16M32 16h10v10',
  pie: 'M24 6a18 18 0 1 0 18 18H24zM29 4a17 17 0 0 1 15 15H29z',
  gauge: 'M8 34a16 16 0 1 1 32 0M24 34l9-11',
  database: 'M8 11c0-7 32-7 32 0v26c0 7-32 7-32 0zM8 11c0 7 32 7 32 0M8 24c0 7 32 7 32 0',
  cloud: 'M14 36a9 9 0 0 1-1-18a12 12 0 0 1 23 3a8 8 0 0 1-1 15z',
  sync: 'M38 18A15 15 0 0 0 11 15M10 7v8h8M10 30a15 15 0 0 0 27 3M38 41v-8h-8',
  phone: 'M15 4h18v40H15zM22 38h4',
  tablet: 'M8 6h32v36H8zM22 37h4',
  laptop: 'M10 10h28v22H10zM4 38h40',
  camera: 'M5 15h9l4-6h12l4 6h9v25H5zM24 19a8 8 0 1 1 0 16a8 8 0 1 1 0-16z',
  pin: 'M24 43s-13-13-13-23a13 13 0 0 1 26 0c0 10-13 23-13 23zM24 15a5 5 0 1 1 0 10a5 5 0 1 1 0-10z',
  globe: 'M24 6a18 18 0 1 1 0 36a18 18 0 1 1 0-36zM6 24h36M24 6c-6 6-6 30 0 36M24 6c6 6 6 30 0 36',
  shield: 'M24 5l16 6v12c0 10-7 17-16 20C15 40 8 33 8 23V11zM17 24l5 5 9-10',
  lock: 'M11 21h26v21H11zM16 21v-6a8 8 0 0 1 16 0v6M24 29v6',
  gear: 'M24 17a7 7 0 1 1 0 14a7 7 0 1 1 0-14zM24 4v7M24 37v7M4 24h7M37 24h7M10 10l5 5M33 33l5 5M38 10l-5 5M15 33l-5 5',
  wrench: 'M30 6a10 10 0 0 0-9 14L7 34a4 4 0 0 0 6 6l14-14A10 10 0 0 0 41 17l-6 6-6-2-2-6 6-6a10 10 0 0 0-3-3z',
  alert: 'M24 6L44 40H4ZM24 19v10M24 34v1',
  flag: 'M10 44V6M10 8h26l-5 8 5 8H10',
  bolt: 'M27 4L9 27h13l-3 17 20-25H26z',
  layers: 'M24 6l19 10-19 10L5 16zM5 24l19 10 19-10M5 32l19 10 19-10',
  link: 'M20 28l8-8M18 21l-5 5a7 7 0 0 0 10 10l5-5M30 27l5-5a7 7 0 0 0-10-10l-5 5',
  eye: 'M3 24s8-14 21-14 21 14 21 14-8 14-21 14S3 24 3 24zM24 18a6 6 0 1 1 0 12a6 6 0 1 1 0-12z',
  target: 'M24 6a18 18 0 1 1 0 36a18 18 0 1 1 0-36zM24 14a10 10 0 1 1 0 20a10 10 0 1 1 0-20zM24 22a2 2 0 1 1 0 4a2 2 0 1 1 0-4z',
  star: 'M24 5l6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2z',
  sparkle: 'M24 4c2 10 6 14 16 16-10 2-14 6-16 16-2-10-6-14-16-16 10-2 14-6 16-16z',
  rocket: 'M24 4c8 6 11 15 9 25l-9 6-9-6c-2-10 1-19 9-25zM15 29l-6 7 7 1M33 29l6 7-7 1M24 15a4 4 0 1 1 0 8a4 4 0 1 1 0-8z',
  money: 'M5 13h38v22H5zM24 18a6 6 0 1 1 0 12a6 6 0 1 1 0-12zM10 18v0M38 30v0',
  doc: 'M10 5h28v38H10zM16 14h16M16 21h16M16 28h10',
  checklist: 'M8 10l3 3 5-5M8 22l3 3 5-5M8 34l3 3 5-5M22 11h18M22 23h18M22 35h18',
  workflow: 'M5 8h12v10H5zM31 30h12v10H31zM11 18v8h26v4',
  robot: 'M12 16h24v22H12zM24 8v8M18 25v2M30 25v2M19 32h10M6 24v6M42 24v6M24 5a2 2 0 1 1 0 4',
  ai: 'M24 4c2 10 6 14 16 16-10 2-14 6-16 16-2-10-6-14-16-16 10-2 14-6 16-16zM38 32c1 4 2 5 6 6-4 1-5 2-6 6-1-4-2-5-6-6 4-1 5-2 6-6z',
  vessel: 'M15 14h18a9 9 0 0 1 0 18H15a9 9 0 0 1 0-18zM14 32l-3 8M34 32l3 8M18 14V9M30 14V9',
  pipework: 'M4 14h18a8 8 0 0 1 8 8v4a8 8 0 0 0 8 8h6M10 10v8M38 30v8',
  structure: 'M8 42L16 8h16l8 34M12 26h24M16 8l14 18M32 8L18 26M12 26l26 16M36 26L10 42',
  scan: 'M6 14V6h8M34 6h8v8M42 34v8h-8M14 42H6v-8M12 24h24',
  upload: 'M24 32V8M14 18l10-10 10 10M8 32v8h32v-8',
  download: 'M24 8v24M14 22l10 10 10-10M8 32v8h32v-8',
  home: 'M6 22L24 6l18 16M11 18v24h26V18',
} as const;

export type IconName = keyof typeof PATHS;
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export const Icon: React.FC<{ name: IconName | string; size: number; color?: string; stroke?: number }> = ({
  name,
  size,
  color = C.white,
  stroke = 3.5,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path
      d={PATHS[name as IconName] ?? PATHS.star}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
