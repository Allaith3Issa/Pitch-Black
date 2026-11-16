// Component sizes from docs/DESIGN.md and Figma.
export const sizes = {
  /** Round touch area of an IconButton. */
  touchTarget: 44,
  /** Button height (DESIGN.md). */
  button: 44,
  /** Large button on the Permission screen (Figma screen 01). */
  buttonLarge: 52,
  /** Circle around the music icon on the Permission screen. */
  illustration: 120,
  /** Floating tab bar height. */
  tabBar: 64,
  /** Pill behind the active tab icon. */
  tabPillWidth: 56,
  tabPillHeight: 30,
  /** SongRow height. */
  songRow: 64,
  /** Artwork size in a SongRow. */
  artworkRow: 48,
} as const;

export const iconSizes = {
  sm: 18,
  /** Tab bar icons. */
  tab: 22,
  md: 24,
  hero: 52,
} as const;
