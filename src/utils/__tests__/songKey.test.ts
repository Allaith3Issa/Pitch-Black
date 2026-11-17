import { describe, expect, it } from '@jest/globals';

import type { Song } from '@/types/song';
import { getFallbackKey, MISSING_KEY_PREFIX, rematchSaved } from '@/utils/songKey';

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
    dateModified: 0,
  };
}

type Entry = { fallbackKey: string; count: number };

describe('getFallbackKey', () => {
  it('is the filename in lower case + the rounded duration', () => {
    expect(getFallbackKey({ filename: 'Hello.MP3', durationSec: 224.6 })).toBe('hello.mp3|225');
    expect(getFallbackKey({ filename: 'Hello.mp3', durationSec: 225.4 })).toBe('hello.mp3|225');
  });
});

describe('rematchSaved', () => {
  const hello = song('1', 'Hello.mp3');
  const helloEntry: Entry = { fallbackKey: getFallbackKey(hello), count: 3 };

  it('keeps entries whose id still exists (same object back)', () => {
    const saved = { '1': helloEntry };
    expect(rematchSaved(saved, [hello])).toBe(saved);
  });

  it('moves an entry to the new id when the id changed', () => {
    const saved = { '1': helloEntry };
    expect(rematchSaved(saved, [song('99', 'Hello.mp3')])).toEqual({ '99': helloEntry });
  });

  it('does not guess when two songs share the fallback key', () => {
    const saved = { '1': helloEntry };
    const songs = [song('98', 'Hello.mp3'), song('99', 'hello.mp3')];
    expect(rematchSaved(saved, songs)).toBe(saved);
  });

  it('keeps entries that match nothing (e.g. SD card not mounted)', () => {
    const saved = { '1': helloEntry };
    expect(rematchSaved(saved, [song('2', 'Other.mp3')])).toBe(saved);
  });

  it('does not overwrite an entry the new id already has', () => {
    const newEntry: Entry = { fallbackKey: helloEntry.fallbackKey, count: 1 };
    const saved = { '1': helloEntry, '99': newEntry };
    expect(rematchSaved(saved, [song('99', 'Hello.mp3')])).toBe(saved);
  });

  it('needs the same duration (rounded)', () => {
    const saved = { '1': helloEntry };
    expect(rematchSaved(saved, [song('99', 'Hello.mp3', 260)])).toBe(saved);
  });

  it('after a migration, moves an entry away from an id that now belongs to another song', () => {
    const world = song('1', 'World.mp3');
    const saved = { '1': helloEntry };
    // Ids were numbered again: "1" is now World, Hello is "2".
    expect(rematchSaved(saved, [world, song('2', 'Hello.mp3')])).toEqual({ '2': helloEntry });
  });

  it('parks an entry whose old id now belongs to another song and that matches nothing', () => {
    const saved = { '1': helloEntry };
    expect(rematchSaved(saved, [song('1', 'World.mp3')])).toEqual({ [`${MISSING_KEY_PREFIX}1`]: helloEntry });
  });

  it('finds a parked entry again when its song comes back', () => {
    const saved = { [`${MISSING_KEY_PREFIX}1`]: helloEntry };
    expect(rematchSaved(saved, [song('1', 'World.mp3'), song('7', 'Hello.mp3')])).toEqual({ '7': helloEntry });
  });

  it('two ids swapped: both entries follow their songs', () => {
    const world = song('2', 'World.mp3');
    const worldEntry: Entry = { fallbackKey: getFallbackKey(world), count: 7 };
    const saved = { '1': helloEntry, '2': worldEntry };
    const songs = [song('1', 'World.mp3'), song('2', 'Hello.mp3')];
    expect(rematchSaved(saved, songs)).toEqual({ '2': helloEntry, '1': worldEntry });
  });

  it('moves several entries at once and keeps the others', () => {
    const world = song('2', 'World.mp3');
    const worldEntry: Entry = { fallbackKey: getFallbackKey(world), count: 7 };
    const saved = { '1': helloEntry, '2': worldEntry };
    const songs = [song('10', 'Hello.mp3'), world];
    expect(rematchSaved(saved, songs)).toEqual({ '10': helloEntry, '2': worldEntry });
  });
});
