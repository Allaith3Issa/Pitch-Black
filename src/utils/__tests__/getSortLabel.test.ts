import { describe, expect, it } from '@jest/globals';

import { getSortLabel } from '@/utils/getSortLabel';

describe('getSortLabel', () => {
  it('names the sort and the order', () => {
    expect(getSortLabel('name', 'asc')).toBe('Name · A–Z');
    expect(getSortLabel('name', 'desc')).toBe('Name · Z–A');
    expect(getSortLabel('dateAdded', 'asc')).toBe('Date added · Oldest');
    expect(getSortLabel('dateAdded', 'desc')).toBe('Date added · Newest');
    expect(getSortLabel('mostPlayed', 'asc')).toBe('Most played · Least');
    expect(getSortLabel('mostPlayed', 'desc')).toBe('Most played · Most');
  });
});
