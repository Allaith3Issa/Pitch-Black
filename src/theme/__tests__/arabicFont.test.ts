import { describe, expect, it } from '@jest/globals';

import { fonts, getArabicTextStyle, typography } from '@/theme/typography';
import { withArabicFont } from '@/theme/withArabicFont';

describe('getArabicTextStyle', () => {
  it('keeps the weight', () => {
    expect(getArabicTextStyle(fonts.regular, 13).fontFamily).toBe('IBMPlexSansArabic_400Regular');
    expect(getArabicTextStyle(fonts.medium, 15).fontFamily).toBe('IBMPlexSansArabic_500Medium');
    expect(getArabicTextStyle(fonts.semiBold, 15).fontFamily).toBe('IBMPlexSansArabic_600SemiBold');
    expect(getArabicTextStyle(fonts.bold, 24).fontFamily).toBe('IBMPlexSansArabic_700Bold');
  });

  it('uses Regular when the font is not set or unknown', () => {
    expect(getArabicTextStyle(undefined, 13).fontFamily).toBe('IBMPlexSansArabic_400Regular');
    expect(getArabicTextStyle('SomeOtherFont', 13).fontFamily).toBe('IBMPlexSansArabic_400Regular');
  });

  it('uses a taller line (1.4 × size) without Android font padding', () => {
    expect(getArabicTextStyle(fonts.regular, 13)).toEqual({
      fontFamily: 'IBMPlexSansArabic_400Regular',
      lineHeight: 18,
      includeFontPadding: false,
    });
    expect(getArabicTextStyle(fonts.medium, 15).lineHeight).toBe(21);
  });

  it('uses the default size 14 when no size is set', () => {
    expect(getArabicTextStyle(fonts.regular, undefined).lineHeight).toBe(20);
  });
});

describe('withArabicFont', () => {
  const style = { ...typography.body };

  it('returns the same style for text without Arabic', () => {
    expect(withArabicFont('Hello', style)).toBe(style);
  });

  it('adds the Arabic font for text with Arabic, also inside an array of styles', () => {
    expect(withArabicFont('مرحبا', [style, { fontFamily: fonts.semiBold }])).toEqual([
      [style, { fontFamily: fonts.semiBold }],
      { fontFamily: 'IBMPlexSansArabic_600SemiBold', lineHeight: 21, includeFontPadding: false },
    ]);
  });
});
