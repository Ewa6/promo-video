import { loadFont } from '@remotion/google-fonts/Manrope';

/**
 * Brand palette of the fictional product. In a real project these come from the product's own
 * design tokens (SCSS/CSS variables, theme files).
 */
export const C = {
  base: '#16302b',
  baseDeep: '#0c1d1a',
  baseMid: '#22443d',
  primary: '#d9622b',
  primaryLight: '#ec8b5e',
  blue: '#3a7ca5',
  accent: '#4fd1b5',
  soft: '#b3b8a3',
  softLight: '#e0e3d6',
  softLine: 'rgba(255,255,255,0.22)',
  teal: '#2a9d8f',
  highlight: '#ffc857',
  white: '#ffffff',
  paper: '#f4f6f8',
  ink: '#1d2b3a',
  muted: '#6e89a0',
  hairline: '#dde3ea',
  high: '#d9534f',
  medium: '#f0ad4e',
  low: '#3fae6a',
} as const;

const manrope = loadFont('normal', { weights: ['500', '600', '700', '800'], subsets: ['latin'] });

/** Headlines and kinetic type. */
export const DISPLAY = manrope.fontFamily;
/** Mock application screens use the product's own UI font stack. */
export const UI = "'Segoe UI', Roboto, Helvetica, sans-serif";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
