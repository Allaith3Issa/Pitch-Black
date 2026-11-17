import { describe, expect, it } from '@jest/globals';

import type { SongRef } from '@/types/playlist';
import type { Song } from '@/types/song';
import { getFallbackKey, MISSING_KEY_PREFIX } from '@/utils/songKey';
import { countAvailableSongs, rematchSongList, resolveSongs, toSongRef } from '@/utils/songList';

function song(id: string, filename: string, durationSec = 200): Song {
  return {
    id,
    title: filename,
    artist: null,
    album: null,
    albumId: null,
    durationSec,
    uri: `content://media/${id}`,
    filename,
    dateAdded: 0,
    dateModified: 0,
  };
}

const a = song('1', 'a.mp3');
const b = song('2', 'b.mp3');
const c = song('3', 'c.mp3');

describe('rematchSongList', () => {
  it('returns the same array when every song still matches', () => {
    const list = [toSongRef(c), toSongRef(a), toSongRef(b)];
    expect(rematchSongList(list, [a, b, c])).toBe(list);
  });

  it('moves a song to its new id and keeps the order', () => {
    const list: SongRef[] = [toSongRef(c), toSongRef(a), toSongRef(b)];
    // "a.mp3" was re-added and got the id 10.
    const movedA = song('10', 'a.mp3');
    const result = rematchSongList(list, [movedA, b, c]);
    expect(result.map((ref) => ref.id)).toEqual(['3', '10', '2']);
  });

  it('keeps the order even with number-like ids (object keys would sort them)', () => {
    const list: SongRef[] = [toSongRef(song('30', 'x.mp3')), toSongRef(song('4', 'y.mp3'))];
    const result = rematchSongList(list, [song('31', 'x.mp3'), song('4', 'y.mp3')]);
    expect(result.map((ref) => ref.id)).toEqual(['31', '4']);
  });

  it('keeps a song that is not on the phone (it may come back)', () => {
    const list = [toSongRef(a), toSongRef(b)];
    expect(rematchSongList(list, [b])).toBe(list);
  });

  it('parks a song whose id now belongs to another song, so the wrong song is never played', () => {
    const list = [toSongRef(a)];
    const other = song('1', 'other.mp3');
    const result = rematchSongList(list, [other]);
    expect(result).toEqual([{ id: `${MISSING_KEY_PREFIX}1`, fallbackKey: getFallbackKey(a) }]);
  });
});

describe('countAvailableSongs', () => {
  it('counts only songs that are on the phone', () => {
    const refs = [toSongRef(a), toSongRef(b), { id: 'gone', fallbackKey: 'gone.mp3|1' }];
    expect(countAvailableSongs(refs, { '1': a, '2': b })).toBe(2);
  });
});

describe('resolveSongs', () => {
  it('returns the songs in the given order and leaves out missing ones', () => {
    const byId = { '1': a, '2': b, '3': c };
    expect(resolveSongs(['3', 'gone', '1', `${MISSING_KEY_PREFIX}2`], byId)).toEqual([c, a]);
  });
});
