import type { Accent, LetterCoverColors, ThemeColors, ThemeVariant } from '@/types/theme';

// Color tokens from docs/DESIGN.md. These are the only hardcoded colors in the app.

/** Everything except the accent colors. */
type BaseColors = Omit<ThemeColors, 'primary' | 'primarySoft' | 'primaryText'>;

export const baseColors: Record<ThemeVariant, BaseColors> = {
  oled: {
    bg: '#000000',
    surface: '#121212',
    surface2: '#1E1E1E',
    border: '#262626',
    progressTrack: '#262626',
    text: '#FFFFFF',
    textSecondary: '#8E8E8E',
    textTertiary: '#5C5C5C',
    onPrimary: '#FFFFFF',
    scrim: 'rgba(0, 0, 0, 0.65)',
  },
  light: {
    bg: '#FFFFFF',
    surface: '#F4F4F5',
    surface2: '#E9E9EC',
    border: '#E4E4E7',
    progressTrack: '#C4C4CA',
    text: '#0A0A0A',
    textSecondary: '#6B6B70',
    textTertiary: '#9A9AA0',
    onPrimary: '#FFFFFF',
    scrim: 'rgba(0, 0, 0, 0.4)',
  },
};

type AccentColors = {
  /** Same in both themes. */
  primary: string;
  primarySoft: Record<ThemeVariant, string>;
  primaryText: Record<ThemeVariant, string>;
};

export const accentColors: Record<Accent, AccentColors> = {
  purple: {
    primary: '#6D28D9',
    primarySoft: { oled: '#1F1235', light: '#EDE9FE' },
    primaryText: { oled: '#A78BFA', light: '#6D28D9' },
  },
  blue: {
    primary: '#2563EB',
    primarySoft: { oled: '#0F1E3D', light: '#DBEAFE' },
    primaryText: { oled: '#93C5FD', light: '#1D4ED8' },
  },
  green: {
    primary: '#059669',
    primarySoft: { oled: '#0B2A22', light: '#D1FAE5' },
    primaryText: { oled: '#6EE7B7', light: '#047857' },
  },
  orange: {
    primary: '#EA580C',
    primarySoft: { oled: '#3A1A0B', light: '#FFEDD5' },
    primaryText: { oled: '#FDBA74', light: '#C2410C' },
  },
  pink: {
    primary: '#DB2777',
    primarySoft: { oled: '#3A0F24', light: '#FCE7F3' },
    primaryText: { oled: '#F9A8D4', light: '#BE185D' },
  },
  red: {
    primary: '#DC2626',
    primarySoft: { oled: '#3A1010', light: '#FEE2E2' },
    primaryText: { oled: '#FCA5A5', light: '#B91C1C' },
  },
};

/** The accents in the order they are shown in Settings. */
export const ACCENTS: readonly Accent[] = ['purple', 'blue', 'green', 'orange', 'pink', 'red'];

/** Letter-cover colors (Step 6): purple, blue, teal, rose, amber. */
export const letterCoverColors: Record<ThemeVariant, readonly LetterCoverColors[]> = {
  oled: [
    { bg: '#2A1A45', fg: '#C4B5FD' },
    { bg: '#13284A', fg: '#93C5FD' },
    { bg: '#0F3330', fg: '#5EEAD4' },
    { bg: '#3D1525', fg: '#FDA4AF' },
    { bg: '#3A2A0F', fg: '#FCD34D' },
  ],
  light: [
    { bg: '#EDE9FE', fg: '#6D28D9' },
    { bg: '#DBEAFE', fg: '#1D4ED8' },
    { bg: '#CCFBF1', fg: '#0F766E' },
    { bg: '#FFE4E6', fg: '#BE123C' },
    { bg: '#FEF3C7', fg: '#B45309' },
  ],
};
