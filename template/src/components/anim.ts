import { Easing, interpolate, spring } from 'remotion';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// A start of Infinity means "this beat never happens in this cut": stay at 0.

/** Smooth 0→1 settle, no overshoot. */
export const enter = (frame: number, start: number, fps: number, durationInFrames?: number) =>
  Number.isFinite(start) ? spring({ frame: frame - start, fps, config: { damping: 200, stiffness: 110 }, durationInFrames }) : 0;

/** Springy 0→1 with a little overshoot, for things that "pop" onto the screen. */
export const pop = (frame: number, start: number, fps: number) =>
  Number.isFinite(start) ? spring({ frame: frame - start, fps, config: { damping: 12, stiffness: 170, mass: 0.7 } }) : 0;

/** Linear-ish fade with an ease-out. */
export const fade = (frame: number, start: number, duration = 12) =>
  !Number.isFinite(start) ? 0 : interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

/** Clamped interpolate with an in-out ease, for camera moves. */
export const ramp = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, { ...clamp, easing: Easing.inOut(Easing.cubic) });

export const mix = (t: number, a: number, b: number) => a + (b - a) * t;

/** Gentle deterministic drift so static elements still breathe. */
export const drift = (frame: number, seed: number, amplitude: number, period = 90) =>
  Math.sin((frame + seed * 37) / (period / (2 * Math.PI))) * amplitude;
