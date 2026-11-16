import { describe, expect, it } from '@jest/globals';

import { getNextIndex, getPreviousAction } from '@/utils/queue';

describe('getNextIndex', () => {
  it('goes to the next song', () => {
    expect(getNextIndex(0, 3)).toBe(1);
    expect(getNextIndex(1, 3)).toBe(2);
  });

  it('returns null at the end of the queue', () => {
    expect(getNextIndex(2, 3)).toBeNull();
    expect(getNextIndex(0, 1)).toBeNull();
  });

  it('returns null for an empty queue', () => {
    expect(getNextIndex(-1, 0)).toBeNull();
  });
});

describe('getPreviousAction', () => {
  it('restarts the song after more than 3 seconds', () => {
    expect(getPreviousAction(2, 3.5)).toEqual({ type: 'restart' });
    expect(getPreviousAction(2, 120)).toEqual({ type: 'restart' });
  });

  it('goes to the previous song in the first 3 seconds', () => {
    expect(getPreviousAction(2, 0)).toEqual({ type: 'play', index: 1 });
    expect(getPreviousAction(2, 3)).toEqual({ type: 'play', index: 1 });
  });

  it('restarts the first song, because there is no previous one', () => {
    expect(getPreviousAction(0, 1)).toEqual({ type: 'restart' });
  });
});
