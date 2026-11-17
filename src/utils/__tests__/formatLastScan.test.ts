import { describe, expect, it } from '@jest/globals';

import { formatLastScan } from '@/utils/formatLastScan';

// Local times, so the tests do not depend on the time zone.
const NOW = new Date(2026, 10, 17, 21, 0).getTime();

describe('formatLastScan', () => {
  it('shows "today" for a scan today', () => {
    expect(formatLastScan(new Date(2026, 10, 17, 20, 14).getTime(), NOW)).toBe('today, 20:14');
  });

  it('adds a leading zero to hours and minutes', () => {
    expect(formatLastScan(new Date(2026, 10, 17, 9, 5).getTime(), NOW)).toBe('today, 09:05');
  });

  it('shows "yesterday" for a scan yesterday', () => {
    expect(formatLastScan(new Date(2026, 10, 16, 23, 59).getTime(), NOW)).toBe('yesterday, 23:59');
  });

  it('shows the date for older scans', () => {
    expect(formatLastScan(new Date(2026, 10, 12, 20, 14).getTime(), NOW)).toBe('12 Nov, 20:14');
  });

  it('knows "yesterday" across a month change', () => {
    const firstOfDecember = new Date(2026, 11, 1, 8, 0).getTime();
    expect(formatLastScan(new Date(2026, 10, 30, 22, 0).getTime(), firstOfDecember)).toBe('yesterday, 22:00');
  });
});
