import type { SceneId } from './scenes/catalog';

/**
 * Real footage that replaces a scene's motion graphics. Drop the file into public/footage/ and
 * add a line here keyed by *section id* (or by scene id to replace every use of that scene);
 * the scene keeps its slot on the voice timeline.
 *
 *   screen — a screen recording (Screen Studio, Cursorful…), framed on the brand backdrop
 *   full   — full-bleed B-roll, e.g. an AI-generated establishing shot
 *
 * Examples:
 *   dashboard: { src: 'footage/dashboard.mp4', fit: 'screen', title: 'Live dashboards' },
 *   hook:      { src: 'footage/site-dawn.mp4', fit: 'full' },
 */
export interface Footage {
  src: string;
  fit: 'screen' | 'full';
  title?: string;
  /** Seconds to skip at the start of the clip. */
  trimStart?: number;
}

export const FOOTAGE: Partial<Record<SceneId | string, Footage>> = {};

/**
 * Optional music bed, e.g. { src: 'music/bed.mp3', volume: 0.12 }. Keep it around −18 to −20 dB
 * under the voice; 0.1–0.15 is usually right for a full-scale track. It fades out over the tail.
 */
export const MUSIC: { src: string; volume: number } | null = null;
