import { describe, expect, it } from '@jest/globals';

import type { Song } from '@/types/song';
import { getRescanMessage, getSongChanges } from '@/utils/songChanges';

function song(id: string): Song {
  return {
    id,
    title: id,
    artist: null,
    album: null,
    albumId: null,
    durationSec: 200,
    uri: `content://media/external/audio/media/${id}`,
    filename: `${id}.mp3`,
    dateAdded: 0,
    dateModified: 0,
  };
}

describe('getSongChanges', () => {
  it('counts new and removed songs by id', () => {
    expect(getSongChanges([song('1'), song('2')], [song('2'), song('3'), song('4')])).toEqual({
      added: 2,
      removed: 1,
    });
  });

  it('finds no changes when the ids are the same', () => {
    expect(getSongChanges([song('1')], [song('1')])).toEqual({ added: 0, removed: 0 });
  });
});

describe('getRescanMessage', () => {
  it('says the library is up to date when nothing changed', () => {
    expect(getRescanMessage({ added: 0, removed: 0 })).toBe('Library is up to date');
  });

  it('counts new songs', () => {
    expect(getRescanMessage({ added: 1, removed: 0 })).toBe('1 new song');
    expect(getRescanMessage({ added: 3, removed: 0 })).toBe('3 new songs');
  });

  it('counts removed songs', () => {
    expect(getRescanMessage({ added: 0, removed: 1 })).toBe('1 song removed');
    expect(getRescanMessage({ added: 0, removed: 2 })).toBe('2 songs removed');
  });

  it('shows both when songs were added and removed', () => {
    expect(getRescanMessage({ added: 3, removed: 1 })).toBe('3 new songs, 1 song removed');
  });
});
