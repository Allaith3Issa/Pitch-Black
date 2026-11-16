import { describe, expect, it } from '@jest/globals';

import { normalizeText } from '@/utils/normalizeText';

describe('normalizeText', () => {
  it('turns every alef with hamza or madda into a plain alef', () => {
    expect(normalizeText('أحمد')).toBe('احمد');
    expect(normalizeText('إيمان')).toBe('ايمان');
    expect(normalizeText('آمال')).toBe('امال');
  });

  it('turns teh marbuta (ة) into heh (ه)', () => {
    expect(normalizeText('مدرسة')).toBe('مدرسه');
  });

  it('turns alef maksura (ى) into yeh (ي)', () => {
    expect(normalizeText('مستشفى')).toBe('مستشفي');
  });

  it('removes tashkeel', () => {
    expect(normalizeText('مُحَمَّدٌ')).toBe('محمد');
    expect(normalizeText('أَحْمَد')).toBe('احمد');
  });

  it('removes tatweel', () => {
    expect(normalizeText('مـحـمـد')).toBe('محمد');
  });

  it('removes Latin accents', () => {
    expect(normalizeText('Beyoncé')).toBe('beyonce');
    expect(normalizeText('Café Señor')).toBe('cafe senor');
  });

  it('ignores case and outer spaces', () => {
    expect(normalizeText('  HeLLo World ')).toBe('hello world');
  });

  it('makes a typed query match a title written differently', () => {
    expect(normalizeText('بَعْدَ سِنِينْ')).toBe(normalizeText('بعد سنين'));
    expect(normalizeText('اغنية')).toBe(normalizeText('أُغْنِيَة'));
  });
});
