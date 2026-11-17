import { describe, expect, it } from '@jest/globals';

import type { Song } from '@/types/song';
import { mergeSongs } from '@/utils/mergeSongs';

function song(id: string, title = `Song ${id}`): Song {
  return {
    id,
    title,
    artist: null,
    album: null,
    albumId: null,
    durationSec: 200,
    uri: `content://media/external/audio/media/${id}`,
    filename: `${title}.mp3`,
    dateAdded: 0,
  };
}

describe('mergeSongs', () => {
  it('returns the old array when nothing changed', () => {
    const oldSongs = [song('1'), song('2')];
    // A new scan gives new objects with the same values.
    expect(mergeSongs(oldSongs, [song('1'), song('2')])).toBe(oldSongs);
  });

  it('keeps the old objects of unchanged songs when a song is added', () => {
    const oldSongs = [song('1'), song('2')];
    const merged = mergeSongs(oldSongs, [song('1'), song('2'), song('3')]);
    expect(merged).toHaveLength(3);
    expect(merged[0]).toBe(oldSongs[0]);
    expect(merged[1]).toBe(oldSongs[1]);
  });

  it('removes deleted songs', () => {
    const oldSongs = [song('1'), song('2')];
    const merged = mergeSongs(oldSongs, [song('2')]);
    expect(merged).toEqual([oldSongs[1]]);
    expect(merged[0]).toBe(oldSongs[1]);
  });

  it('uses the new object when a song changed', () => {
    const oldSongs = [song('1', 'Old title')];
    const renamed = song('1', 'New title');
    const merged = mergeSongs(oldSongs, [renamed]);
    expect(merged).not.toBe(oldSongs);
    expect(merged[0]).toBe(renamed);
  });

  it('returns a new array when only the order changed', () => {
    const oldSongs = [song('1'), song('2')];
    const merged = mergeSongs(oldSongs, [song('2'), song('1')]);
    expect(merged).not.toBe(oldSongs);
    expect(merged[0]).toBe(oldSongs[1]);
  });
});
