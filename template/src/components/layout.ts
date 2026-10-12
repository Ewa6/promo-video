import { createContext, useContext } from 'react';
import { useVideoConfig } from 'remotion';

/** Pixels at the bottom of the frame reserved for burned-in captions (0 when captions are off). */
export const CaptionSafeContext = createContext(0);

/** Caption band height per orientation; Captions.tsx draws inside it. */
export const captionSafe = (width: number, height: number) => (height > width ? 520 : 170);

/**
 * Scenes are laid out for 1920×1080 and adapt to 1080×1920 (portrait) and 1080×1080 (square).
 * `u` scales type and objects (1 at 1080 short side); `portrait` flips rows into columns.
 * `h` is the height scenes may use: the frame minus the caption band, so nothing important is
 * ever drawn under the captions. Backdrops fill the whole frame; their children get `h`.
 */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const safe = useContext(CaptionSafeContext);
  const portrait = height > width;
  const square = height === width;
  const u = Math.min(width, height) / 1080;
  const h = height - safe;
  /** Too narrow for side-by-side layouts (portrait and square): stack instead. */
  const narrow = width < 1400;
  return { w: width, h, fullH: height, safe, cx: width / 2, cy: h / 2, portrait, square, narrow, landscape: !portrait && !square, u };
};
