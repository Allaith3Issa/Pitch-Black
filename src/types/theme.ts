/** The user's theme choice. 'system' follows the phone (dark → OLED, light → Light). */
export type ThemeMode = 'system' | 'oled' | 'light';

/** The theme that is really shown, after 'system' is resolved. */
export type ThemeVariant = 'oled' | 'light';

export type Accent = 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'red';

export type ThemeColors = {
  /** Screen background. */
  bg: string;
  /** Mini player, tab bar, sheets, dialogs, setting cards. */
  surface: string;
  /** Secondary buttons, inputs, chips, artwork placeholder. */
  surface2: string;
  /** Dividers, outlines, slider track. */
  border: string;
  /** Accent: Play button, play/pause circle, slider fill, toggles, checkboxes. */
  primary: string;
  /** Text / icons on `primary`. */
  onPrimary: string;
  /** Playing row background. */
  primarySoft: string;
  /** Accent-colored text / icons on `bg`. */
  primaryText: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  /** Dark layer behind sheets and dialogs. */
  scrim: string;
};

/** Background + letter color of a "letter cover" (songs without a cover, Step 6). */
export type LetterCoverColors = {
  bg: string;
  fg: string;
};

export type Theme = {
  variant: ThemeVariant;
  isDark: boolean;
  colors: ThemeColors;
  letterCovers: readonly LetterCoverColors[];
};
