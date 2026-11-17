import { describe, expect, it } from '@jest/globals';

import { hasArabic } from '@/utils/arabicText';

describe('hasArabic', () => {
  it('finds Arabic letters', () => {
    expect(hasArabic('تملي معاك')).toBe(true);
    expect(hasArabic('قيج')).toBe(true);
  });

  it('finds Arabic in mixed text', () => {
    expect(hasArabic('Amr Diab - تملي معاك')).toBe(true);
    expect(hasArabic('Track 01 (ريمكس)')).toBe(true);
  });

  it('finds Arabic presentation forms', () => {
    expect(hasArabic(String.fromCharCode(0xfefb))).toBe(true);
    expect(hasArabic(String.fromCharCode(0xfdf2))).toBe(true);
  });

  it('finds Arabic marks on their own', () => {
    expect(hasArabic(String.fromCharCode(0x064b))).toBe(true);
  });

  it('is false for Latin text, numbers and empty text', () => {
    expect(hasArabic('Hello World')).toBe(false);
    expect(hasArabic('Café – 3:45')).toBe(false);
    expect(hasArabic('')).toBe(false);
  });
});
