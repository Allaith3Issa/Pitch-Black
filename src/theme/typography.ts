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
} as const satisfies Record<string, TypographyToken>;
