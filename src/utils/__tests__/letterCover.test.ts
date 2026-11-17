import { describe, expect, it } from '@jest/globals';

import { getCoverColorIndex, getCoverLetter } from '@/utils/letterCover';

describe('getCoverLetter', () => {
  it('uses the first letter in upper case', () => {
    expect(getCoverLetter('hello')).toBe('H');
  });

  it('skips leading symbols and spaces', () => {
    expect(getCoverLetter('  (Live) Song')).toBe('L');
  });

  it('works for Arabic titles', () => {
    expect(getCoverLetter('«سلام»')).toBe('س');
  });

  it('accepts a digit', () => {
    expect(getCoverLetter('21 Guns')).toBe('2');
  });

  it('shows # when there is no letter or digit', () => {
    expect(getCoverLetter('...')).toBe('#');
  });
});

describe('getCoverColorIndex', () => {
  it('always gives the same color to the same song', () => {
    expect(getCoverColorIndex('12345', 5)).toBe(getCoverColorIndex('12345', 5));
  });

  it('stays inside the color list', () => {
    for (const id of ['1', '42', '99999', '2147483647', 'abc']) {
      const index = getCoverColorIndex(id, 5);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(5);
    }
  });

  it('spreads songs over the colors', () => {
    const used = new Set(Array.from({ length: 50 }, (_, i) => getCoverColorIndex(String(1000 + i), 5)));
    expect(used.size).toBe(5);
  });
});
