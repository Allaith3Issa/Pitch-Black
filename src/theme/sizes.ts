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
  /** Sort chip height. */
  chip: 32,
  /** Row in a bottom sheet (SheetOption). */
  sheetOption: 48,
  /** Grab handle at the top of a bottom sheet. */
  sheetHandleWidth: 36,
  sheetHandleHeight: 4,
  /** Search input height. */
  input: 48,
  /** Thin lines: dividers and borders. */
  hairline: 1,
  /** Input border when focused. */
  focusBorder: 1.5,
} as const;

export const iconSizes = {
  /** Chip icon. */
  xs: 16,
  sm: 18,
  /** SheetOption icon. */
  option: 20,
  /** Tab bar icons. */
  tab: 22,
  md: 24,
  hero: 52,
} as const;
