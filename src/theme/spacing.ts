// Spacing and radius tokens from docs/DESIGN.md.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// Side padding used by every screen.
export const screenPadding = spacing.lg;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  /** Mini Player card. */
  miniPlayer: 14,
  tabBar: 32,
  pill: 999,
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
