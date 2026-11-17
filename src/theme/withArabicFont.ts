import { type StyleProp, StyleSheet, type TextStyle } from 'react-native';

import { getArabicTextStyle } from '@/theme/typography';
import { hasArabic } from '@/utils/arabicText';

/**
 * Returns `style` unchanged for text without Arabic. For text with Arabic, adds the Arabic font in
 * the same weight and size (see getArabicTextStyle). Used by AppText and the text inputs.
 */
export function withArabicFont(text: string, style: StyleProp<TextStyle>): StyleProp<TextStyle> {
  if (!hasArabic(text)) return style;
  const { fontFamily, fontSize } = StyleSheet.flatten(style) ?? {};
  return [style, getArabicTextStyle(fontFamily, fontSize)];
}
