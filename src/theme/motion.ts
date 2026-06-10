/**
 * Shared motion language so animations across the app feel consistent and
 * intentional rather than ad-hoc. Durations are in milliseconds.
 */
export const motion = {
  duration: {
    fast: 180,
    base: 280,
    slow: 460,
    count: 1100,
  },
  /** Spring presets for Reanimated `withSpring` / `.springify()`. */
  spring: {
    soft: { damping: 20, stiffness: 150, mass: 0.9 },
    snappy: { damping: 16, stiffness: 320, mass: 0.5 },
    bouncy: { damping: 12, stiffness: 200, mass: 0.8 },
  },
  /** Default delay (ms) between staggered list/section entrances. */
  stagger: 70,
} as const;
