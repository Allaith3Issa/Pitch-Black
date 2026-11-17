import { describe, expect, it } from '@jest/globals';

import { getNextIndex, getNextRepeatMode, getPreviousAction } from '@/utils/queue';

describe('getNextIndex', () => {
  it('goes to the next song', () => {
    expect(getNextIndex(0, 3, 'off')).toBe(1);
    expect(getNextIndex(1, 3, 'all')).toBe(2);
    expect(getNextIndex(1, 3, 'one')).toBe(2);
  });

  it('returns null at the end of the queue when repeat is off', () => {
    expect(getNextIndex(2, 3, 'off')).toBeNull();
    expect(getNextIndex(0, 1, 'off')).toBeNull();
  });

  it('starts again from the first song with repeat all', () => {
    expect(getNextIndex(2, 3, 'all')).toBe(0);
    expect(getNextIndex(0, 1, 'all')).toBe(0);
  });

  it('does not wrap with repeat one ("next" goes to the next song, not the same one)', () => {
    expect(getNextIndex(2, 3, 'one')).toBeNull();
  });

  it('returns null for an empty queue', () => {
    expect(getNextIndex(-1, 0, 'off')).toBeNull();
    expect(getNextIndex(-1, 0, 'all')).toBeNull();
  });
});

describe('getPreviousAction', () => {
  it('restarts the song after more than 3 seconds', () => {
    expect(getPreviousAction(2, 3.5, 5, 'off')).toEqual({ type: 'restart' });
    expect(getPreviousAction(0, 120, 5, 'all')).toEqual({ type: 'restart' });
  });

  it('goes to the previous song in the first 3 seconds', () => {
    expect(getPreviousAction(2, 0, 5, 'off')).toEqual({ type: 'play', index: 1 });
    expect(getPreviousAction(2, 3, 5, 'one')).toEqual({ type: 'play', index: 1 });
  });

  it('restarts the first song when repeat is not all', () => {
    expect(getPreviousAction(0, 1, 5, 'off')).toEqual({ type: 'restart' });
    expect(getPreviousAction(0, 1, 5, 'one')).toEqual({ type: 'restart' });
  });

  it('goes from the first song to the last one with repeat all', () => {
    expect(getPreviousAction(0, 1, 5, 'all')).toEqual({ type: 'play', index: 4 });
  });

  it('restarts a single song even with repeat all', () => {
    expect(getPreviousAction(0, 1, 1, 'all')).toEqual({ type: 'restart' });
  });
});

describe('getNextRepeatMode', () => {
  it('cycles off → all → one → off', () => {
    expect(getNextRepeatMode('off')).toBe('all');
    expect(getNextRepeatMode('all')).toBe('one');
    expect(getNextRepeatMode('one')).toBe('off');
  });
});
