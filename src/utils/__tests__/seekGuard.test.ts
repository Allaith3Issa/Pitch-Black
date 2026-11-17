import { describe, expect, it } from '@jest/globals';

import { isStalePosition, startSeek } from '@/utils/seekGuard';

describe('isStalePosition', () => {
  it('trusts every position when there is no seek', () => {
    expect(isStalePosition(null, 42, 1000)).toBe(false);
  });

  it('ignores an old position right after a seek', () => {
    const pending = startSeek(120, 1000);
    expect(isStalePosition(pending, 30, 1200)).toBe(true);
  });

  it('accepts a position near the target', () => {
    const pending = startSeek(120, 1000);
    expect(isStalePosition(pending, 120.4, 1200)).toBe(false);
    expect(isStalePosition(pending, 119, 1200)).toBe(false);
  });

  it('trusts the player again after the timeout', () => {
    const pending = startSeek(120, 1000);
    expect(isStalePosition(pending, 30, 3000)).toBe(false);
  });
});
