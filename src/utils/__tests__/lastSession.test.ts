import { describe, expect, it } from '@jest/globals';

import type { QueueSource } from '@/types/player';
import type { Song } from '@/types/song';
import { resolveSavedSession, type SavedPosition, toSavedQueue } from '@/utils/lastSession';

function song(id: string, filename: string, durationSec = 200): Song {
  return {
    id,
    title: filename,
    artist: null,
    album: null,
    albumId: null,
    durationSec,
    uri: `content://media/external/audio/media/${id}`,
    filename,
    dateAdded: 0,
  };
}

const SOURCE: QueueSource = { type: 'songs' };
const a = song('1', 'a.mp3');
const b = song('2', 'b.mp3');
const c = song('3', 'c.mp3');
const songsById = { '1': a, '2': b, '3': c };

// List order a, b, c; play order (shuffled) c, a, b.
const saved = toSavedQueue(['1', '2', '3'], ['3', '1', '2'], SOURCE, songsById);
const atA: SavedPosition = { songId: '1', positionSec: 42 };

describe('toSavedQueue', () => {
  it('keeps the queue and a fallback key for every song', () => {
    expect(saved.listQueue).toEqual(['1', '2', '3']);
    expect(saved.queue).toEqual(['3', '1', '2']);
    expect(saved.queueSource).toBe(SOURCE);
    expect(saved.fallbackKeys).toEqual({ '1': 'a.mp3|200', '2': 'b.mp3|200', '3': 'c.mp3|200' });
  });
});

describe('resolveSavedSession', () => {
  it('restores the same queue, song and position', () => {
    expect(resolveSavedSession(saved, atA, [a, b, c])).toEqual({
      listQueue: ['1', '2', '3'],
      queue: ['3', '1', '2'],
      queueSource: SOURCE,
      currentIndex: 1,
      positionSec: 42,
    });
  });

  it('returns null when nothing was saved', () => {
    expect(resolveSavedSession(null, atA, [a, b, c])).toBeNull();
    expect(resolveSavedSession(saved, null, [a, b, c])).toBeNull();
  });

  it('returns null when the current song is no longer on the phone', () => {
    expect(resolveSavedSession(saved, atA, [b, c])).toBeNull();
  });

  it('leaves out other queue songs that are gone', () => {
    const result = resolveSavedSession(saved, atA, [a, b]);
    expect(result?.listQueue).toEqual(['1', '2']);
    expect(result?.queue).toEqual(['1', '2']);
    expect(result?.currentIndex).toBe(0);
  });

  it('follows a song whose id changed (same fallback key)', () => {
    const movedA = song('91', 'a.mp3');
    const result = resolveSavedSession(saved, atA, [movedA, b, c]);
    expect(result?.queue).toEqual(['3', '91', '2']);
    expect(result?.currentIndex).toBe(1);
  });

  it('does not use an id that now belongs to another song', () => {
    const otherSongWithIdOne = song('1', 'other.mp3');
    expect(resolveSavedSession(saved, atA, [otherSongWithIdOne, b, c])).toBeNull();
  });

  it('does not guess when two songs share the fallback key', () => {
    expect(resolveSavedSession(saved, atA, [song('91', 'a.mp3'), song('92', 'a.mp3'), b, c])).toBeNull();
  });

  it('starts from 0:00 when the saved position is at or past the end', () => {
    expect(resolveSavedSession(saved, { songId: '1', positionSec: 200 }, [a, b, c])?.positionSec).toBe(0);
    expect(resolveSavedSession(saved, { songId: '1', positionSec: -3 }, [a, b, c])?.positionSec).toBe(0);
  });
});
