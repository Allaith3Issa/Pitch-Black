import { describe, expect, it } from '@jest/globals';

import type { Playlist } from '@/types/playlist';
import {
  FAVORITES_QUEUE,
  getQueueTitle,
  isSameQueueSource,
  playlistQueue,
  SEARCH_QUEUE,
  SONGS_QUEUE,
} from '@/utils/queueSource';

const roadTrip: Playlist = { id: 'p1', name: 'Road Trip', createdAt: 0, songs: [] };

describe('isSameQueueSource', () => {
  it('matches the same list', () => {
    expect(isSameQueueSource(SONGS_QUEUE, { type: 'songs' })).toBe(true);
    expect(isSameQueueSource(playlistQueue('p1'), playlistQueue('p1'))).toBe(true);
  });

  it('does not match another list', () => {
    expect(isSameQueueSource(SONGS_QUEUE, FAVORITES_QUEUE)).toBe(false);
    expect(isSameQueueSource(playlistQueue('p1'), playlistQueue('p2'))).toBe(false);
    expect(isSameQueueSource(SEARCH_QUEUE, playlistQueue('p1'))).toBe(false);
  });

  it('does not match when nothing is playing', () => {
    expect(isSameQueueSource(null, SONGS_QUEUE)).toBe(false);
  });
});

describe('getQueueTitle', () => {
  it('names the fixed lists', () => {
    expect(getQueueTitle(SONGS_QUEUE, [])).toBe('All songs');
    expect(getQueueTitle(SEARCH_QUEUE, [])).toBe('Search results');
    expect(getQueueTitle(FAVORITES_QUEUE, [])).toBe('Favorites');
    expect(getQueueTitle(null, [])).toBe('');
  });

  it('uses the current name of a playlist', () => {
    expect(getQueueTitle(playlistQueue('p1'), [roadTrip])).toBe('Road Trip');
    expect(getQueueTitle(playlistQueue('p1'), [{ ...roadTrip, name: 'Road Trip 2026' }])).toBe('Road Trip 2026');
  });

  it('falls back to "Playlist" for a deleted playlist', () => {
    expect(getQueueTitle(playlistQueue('gone'), [roadTrip])).toBe('Playlist');
  });
});
