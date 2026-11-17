import { describe, expect, it } from '@jest/globals';

import { getShuffleButtonAction } from '@/utils/shuffleButton';

describe('getShuffleButtonAction', () => {
  it('turns shuffle off when it is on and this list is the queue', () => {
    expect(getShuffleButtonAction(true, true)).toBe('turnOff');
  });

  it('starts a shuffled play of this list when shuffle is on but another list is the queue', () => {
    expect(getShuffleButtonAction(true, false)).toBe('shufflePlay');
  });

  it('starts a shuffled play when shuffle is off', () => {
    expect(getShuffleButtonAction(false, true)).toBe('shufflePlay');
    expect(getShuffleButtonAction(false, false)).toBe('shufflePlay');
  });
});
