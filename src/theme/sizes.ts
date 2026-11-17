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
  /** Artwork in the Mini Player. */
  artworkMini: 44,
  /** Round play/pause button in the Mini Player. */
  miniPlayButton: 40,
  /** Progress line at the bottom of the Mini Player. */
  progressLine: 3,
  /** Segmented control height (Settings: Theme). */
  segmentedControl: 44,
  /** Accent color circle in Settings. */
  swatch: 36,
  /** Ring around the selected accent swatch. */
  swatchRing: 2,
  /** Largest artwork on Now Playing (smaller on narrow screens). */
  artworkPlayer: 296,
  /** Round play/pause button on Now Playing. */
  playButtonLarge: 76,
  /** Previous / next buttons on Now Playing. */
  playerSkipSong: 52,
  /** Top bar on Now Playing. */
  playerTopBar: 52,
  /** Small dot under an active shuffle / repeat button. */
  activeDot: 4,
} as const;

// Icon line thickness (lucide strokeWidth). The active tab icon is bolder.
export const iconStrokes = {
  regular: 2,
  bold: 2.6,
} as const;

export const iconSizes = {
  /** Small icon inside a line of text (play count in a SongRow). */
  inline: 12,
  /** Chip icon. */
  xs: 16,
  sm: 18,
  /** SheetOption icon. */
  option: 20,
  /** Tab bar icons. */
  tab: 22,
  md: 24,
  hero: 52,
  /** Shuffle / repeat on Now Playing. */
  playerToggle: 22,
  /** Previous / next / play-pause on Now Playing. */
  playerMain: 30,
} as const;
