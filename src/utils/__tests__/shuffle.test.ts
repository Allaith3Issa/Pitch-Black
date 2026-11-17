import { describe, expect, it } from '@jest/globals';

import { randomIndex, shuffleIds, shuffleNewRound } from '@/utils/shuffle';

const ids = ['a', 'b', 'c', 'd', 'e'];

/** A fixed "random" sequence, so the order is always the same. */
function fakeRandom(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

describe('shuffleIds', () => {
  it('keeps every song exactly once', () => {
    const result = shuffleIds(ids, null, fakeRandom([0.3, 0.9, 0.1, 0.6]));
    expect([...result].sort()).toEqual(ids);
  });

  it('puts the given song first', () => {
    const result = shuffleIds(ids, 'c', fakeRandom([0.3, 0.9, 0.1, 0.6]));
    expect(result[0]).toBe('c');
    expect([...result].sort()).toEqual(ids);
  });

  it('ignores a first song that is not in the list', () => {
    const result = shuffleIds(ids, 'x', fakeRandom([0.5]));
    expect(result).not.toContain('x');
    expect(result).toHaveLength(ids.length);
  });

  it('really changes the order', () => {
    // random() = 0 always swaps with the first item.
    expect(shuffleIds(ids, null, () => 0)).not.toEqual(ids);
  });

  it('does not change the original list', () => {
    const copy = [...ids];
    shuffleIds(ids, 'a', () => 0);
    expect(ids).toEqual(copy);
  });

  it('handles empty and single lists', () => {
    expect(shuffleIds([], null)).toEqual([]);
    expect(shuffleIds(['a'], 'a')).toEqual(['a']);
  });
});

describe('shuffleNewRound', () => {
  it('mixes the songs again and puts the song that just played last', () => {
    const result = shuffleNewRound(ids, 'c', () => 0);
    expect(result[result.length - 1]).toBe('c');
    expect([...result].sort()).toEqual(ids);
    expect(result).not.toEqual(ids);
  });

  it('just shuffles when the last song is not in the list', () => {
    const result = shuffleNewRound(ids, 'x', () => 0);
    expect([...result].sort()).toEqual(ids);
  });
});

describe('randomIndex', () => {
  it('stays inside the list', () => {
    expect(randomIndex(5, () => 0)).toBe(0);
    expect(randomIndex(5, () => 0.999)).toBe(4);
  });
});
