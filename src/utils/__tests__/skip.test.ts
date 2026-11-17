import { describe, expect, it } from '@jest/globals';

import { getSkipTarget } from '@/utils/skip';

describe('getSkipTarget', () => {
  it('skips forward and back', () => {
    expect(getSkipTarget(30, 200, 10)).toBe(40);
    expect(getSkipTarget(30, 200, -10)).toBe(20);
  });

  it('never goes before the start', () => {
    expect(getSkipTarget(4, 200, -10)).toBe(0);
  });

  it('returns null when a skip forward passes the end (go to the next song)', () => {
    expect(getSkipTarget(195, 200, 10)).toBeNull();
    expect(getSkipTarget(190, 200, 10)).toBeNull();
  });

  it('skips forward when the length is not known yet', () => {
    expect(getSkipTarget(5, 0, 10)).toBe(15);
  });
});
