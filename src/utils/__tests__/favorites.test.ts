import { describe, expect, it } from '@jest/globals';

import { getFavoriteIdsNewestFirst } from '@/utils/favorites';

describe('getFavoriteIdsNewestFirst', () => {
  it('puts the newest favorite first', () => {
    const favorites = {
      '1': { fallbackKey: 'a|1', addedAt: 100 },
      '2': { fallbackKey: 'b|1', addedAt: 300 },
      '3': { fallbackKey: 'c|1', addedAt: 200 },
    };
    expect(getFavoriteIdsNewestFirst(favorites)).toEqual(['2', '3', '1']);
  });

  it('handles no favorites', () => {
    expect(getFavoriteIdsNewestFirst({})).toEqual([]);
  });
});
