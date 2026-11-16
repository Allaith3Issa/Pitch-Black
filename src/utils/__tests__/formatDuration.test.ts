import { describe, expect, it } from '@jest/globals';

import { formatDuration } from '@/utils/formatDuration';

describe('formatDuration', () => {
  it('formats minutes and seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(5)).toBe('0:05');
    expect(formatDuration(225)).toBe('3:45');
  });

  it('rounds down parts of a second', () => {
    expect(formatDuration(268.9)).toBe('4:28');
  });

  it('adds hours when an hour or longer', () => {
    expect(formatDuration(3600)).toBe('1:00:00');
    expect(formatDuration(3725)).toBe('1:02:05');
  });

  it('shows 0:00 for negative values', () => {
    expect(formatDuration(-10)).toBe('0:00');
  });
});
