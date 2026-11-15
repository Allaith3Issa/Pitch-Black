// Color tokens from docs/DESIGN.md (OLED theme).
export const colors = {
  bg: '#000000',
  surface: '#121212',
  surface2: '#1E1E1E',
  border: '#262626',
  primary: '#6D28D9',
  onPrimary: '#FFFFFF',
  primarySoft: '#1F1235',
  primaryText: '#A78BFA',
  text: '#FFFFFF',
  textSecondary: '#8E8E8E',
  textTertiary: '#5C5C5C',
} as const;

// Scrim behind sheets and dialogs: `bg` at 65% opacity.
export const scrim = 'rgba(0, 0, 0, 0.65)';

export type ColorToken = keyof typeof colors;
