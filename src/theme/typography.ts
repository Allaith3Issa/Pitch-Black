import type { TextStyle } from 'react-native';

// Inter font family names, as loaded in src/app/_layout.tsx.
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

type TypographyToken = Pick<TextStyle, 'fontFamily' | 'fontSize'>;

// Typography tokens from docs/DESIGN.md.
// The weight here is the default; some uses switch weight (e.g. buttons use `body` in Semi Bold).
export const typography = {
  screenTitle: { fontFamily: fonts.bold, fontSize: 30 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 26 },
  playerTitle: { fontFamily: fonts.bold, fontSize: 24 },
  dialogTitle: { fontFamily: fonts.bold, fontSize: 20 },
  sheetTitle: { fontFamily: fonts.bold, fontSize: 18 },
  itemTitle: { fontFamily: fonts.semiBold, fontSize: 16 },
  body: { fontFamily: fonts.medium, fontSize: 15 },
  bodySmall: { fontFamily: fonts.regular, fontSize: 13 },
  caption: { fontFamily: fonts.regular, fontSize: 12 },
  tabLabel: { fontFamily: fonts.medium, fontSize: 11 },
  /** Song title in the Mini Player (DESIGN.md: 14 Semi Bold). */
  miniPlayerTitle: { fontFamily: fonts.semiBold, fontSize: 14 },
  /** Number inside the skip back / forward icons on Now Playing ("10"). */
  iconLabel: { fontFamily: fonts.bold, fontSize: 8 },
} as const satisfies Record<string, TypographyToken>;

/*
 * Arabic text (titles, artists, playlist names) uses IBM Plex Sans Arabic in the same weight, because
 * Inter has no Arabic letters. See components/AppText.
 */
const arabicFonts: Record<string, string> = {
  [fonts.regular]: 'IBMPlexSansArabic_400Regular',
  [fonts.medium]: 'IBMPlexSansArabic_500Medium',
  [fonts.semiBold]: 'IBMPlexSansArabic_600SemiBold',
  [fonts.bold]: 'IBMPlexSansArabic_700Bold',
};

/**
 * Arabic needs more height than Latin (marks above and below the letters). 1.4 × the font size keeps
 * the tanween marks and letters like ق ي ج from being cut off. Rows have fixed heights, so they do not grow.
 */
export const ARABIC_LINE_HEIGHT_RATIO = 1.4;

/** Font size used when a style sets none (React Native's default). */
const DEFAULT_FONT_SIZE = 14;

export type ArabicTextStyle = Pick<TextStyle, 'fontFamily' | 'lineHeight' | 'includeFontPadding'>;

/**
 * The style to add to a text that contains Arabic: the Arabic font in the same weight as `fontFamily`
 * (Regular when it is not one of ours), a taller line, and no extra Android font padding.
 */
export function getArabicTextStyle(fontFamily: string | undefined, fontSize: number | undefined): ArabicTextStyle {
  return {
    fontFamily: arabicFonts[fontFamily ?? fonts.regular] ?? arabicFonts[fonts.regular],
    lineHeight: Math.round((fontSize ?? DEFAULT_FONT_SIZE) * ARABIC_LINE_HEIGHT_RATIO),
    includeFontPadding: false,
  };
}

// Section labels (SORT BY, LIBRARY...) are uppercase with ~10% letter spacing: 12 × 0.1 = 1.2.
export const letterSpacing = {
  label: 1.2,
} as const;
