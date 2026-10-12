// To change the display font, swap this import for another family from @remotion/google-fonts
// (e.g. '@remotion/google-fonts/Inter') and keep the loadFont call below.
import { loadFont } from '@remotion/google-fonts/Montserrat';

/**
 * Everything brand-specific lives here. Scenes read colours from `C`, fonts from DISPLAY/UI and
 * names/links from BRAND, so a new product only edits this file, src/script.ts and public/brand/.
 *
 * Colour roles (pick from the product's own CSS / design tokens, never invent a palette):
 *   bg/bgDeep/bgMid  dark "product" backdrop and its darker/lighter shades
 *   soft/softLight   light secondary backdrop (the "paper" scenes) and text on dark
 *   primary          main brand colour (buttons, accents on light)
 *   accent           bright secondary (links, progress, highlights on dark)
 *   highlight        punchy colour for the key word / number (must contrast with bg)
 */
export const C = {
  bg: '#1b2430',
  bgDeep: '#10161e',
  bgMid: '#2a3644',
  primary: '#e4572e',
  primaryLight: '#f0805f',
  accent: '#29b6a8',
  highlight: '#ffd23f',
  soft: '#a7b4a9',
  softLight: '#dde4dc',
  softLine: 'rgba(255,255,255,0.22)',
  white: '#ffffff',
  paper: '#f4f6f8',
  ink: '#1d2b3a',
  muted: '#6e89a0',
  hairline: '#dde3ea',
  good: '#3fae6a',
  warn: '#f0ad4e',
  bad: '#d9534f',
} as const;

const display = loadFont('normal', { weights: ['500', '600', '700', '800'], subsets: ['latin'] });

/** Headlines and kinetic type. */
export const DISPLAY = display.fontFamily;
/** Mock application screens: use the product's real UI font stack. */
export const UI = 'Arial, Helvetica, sans-serif';

export const BRAND = {
  /** How the product is written on screen and in captions. */
  name: 'Acme Cloud',
  /** Short company/product line for the end card. */
  company: 'Acme Ltd',
  url: 'acme.example',
  /** Optional call to action shown on the end card, e.g. "Book a demo: sales@acme.example". */
  cta: 'Book a demo · acme.example',
  /**
   * Logos in public/brand/. `colour` is for light backgrounds, `white` for dark ones. Leave a
   * path null to fall back to a typeset wordmark of BRAND.name.
   */
  logo: { colour: null as string | null, white: null as string | null },
  /** Square mark/icon (optional), used by the app window chrome and avatars. */
  mark: null as string | null,
  /** Mock app chrome: title in the browser tab and the main navigation. */
  app: {
    title: 'Acme Cloud',
    menu: ['Home', 'Projects', 'Reports', 'Settings'],
    initials: 'AC',
  },
  /** Backdrop texture for scenes: 'grid' (engineering paper), 'dots' or 'plain'. */
  backdrop: 'grid' as 'grid' | 'dots' | 'plain',
  /**
   * Captions read the script, so they spell what the voice was told to say. Map voice spellings
   * back to on-screen spellings here, e.g. { Kora: 'KORA' } when the script writes "Kora" so the
   * voice says one word.
   */
  captionReplace: {} as Record<string, string>,
} as const;
