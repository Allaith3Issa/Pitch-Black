import { describe, expect, it } from '@jest/globals';

import type { Song } from '@/types/song';
import { sortSongs } from '@/utils/sortSongs';

// A song with only the fields that matter for sorting.
function song(id: string, title: string, dateAdded = 0): Song {
  return {
    id,
    title,
    dateAdded,
    artist: null,
    album: null,
    albumId: null,
    durationSec: 200,
    uri: `content://media/external/audio/media/${id}`,
    filename: `${title}.mp3`,
  };
}

const titles = (songs: Song[]) => songs.map((s) => s.title);

describe('sortSongs by name', () => {
  const songs = [
    song('1', 'ياسمين'),
    song('2', '1989'),
    song('3', 'Zara'),
    song('4', 'أحلام'),
    song('5', 'adele'),
    song('6', '(Live)'),
    song('7', 'بحر'),
    song('8', 'Beat It'),
  ];

  it('puts English first (A→Z, any case), then Arabic (ا→ي), then everything else', () => {
    expect(titles(sortSongs(songs, 'name', 'asc'))).toEqual([
      'adele',
      'Beat It',
      'Zara',
      'أحلام',
      'بحر',
      'ياسمين',
      '(Live)',
      '1989',
    ]);
  });

  it('Z–A is the exact reverse of A–Z', () => {
    const ascending = titles(sortSongs(songs, 'name', 'asc'));
    expect(titles(sortSongs(songs, 'name', 'desc'))).toEqual([...ascending].reverse());
  });

  it('puts titles starting with Arabic-Indic digits with the "everything else" group', () => {
    const mixed = [song('1', '٢٠٢٠'), song('2', 'بحر'), song('3', 'Zara')];
    expect(titles(sortSongs(mixed, 'name', 'asc'))).toEqual(['Zara', 'بحر', '٢٠٢٠']);
  });

  it('does not change the original array', () => {
    const copy = [...songs];
    sortSongs(songs, 'name', 'asc');
    expect(songs).toEqual(copy);
  });

  it('breaks ties on the same title by id (as a number)', () => {
    const twins = [song('10', 'Hello'), song('9', 'hello'), song('2', 'Hello')];
    expect(sortSongs(twins, 'name', 'asc').map((s) => s.id)).toEqual(['2', '9', '10']);
    expect(sortSongs(twins, 'name', 'desc').map((s) => s.id)).toEqual(['10', '9', '2']);
  });
});

describe('sortSongs by date added', () => {
  const songs = [song('1', 'Middle', 2000), song('2', 'Oldest', 1000), song('3', 'Newest', 3000)];

  it('ascending = oldest first', () => {
    expect(titles(sortSongs(songs, 'dateAdded', 'asc'))).toEqual(['Oldest', 'Middle', 'Newest']);
  });

  it('descending = newest first', () => {
    expect(titles(sortSongs(songs, 'dateAdded', 'desc'))).toEqual(['Newest', 'Middle', 'Oldest']);
  });

  it('breaks ties on the same date by title, then by id', () => {
    const sameDate = [song('3', 'B', 500), song('2', 'A', 500), song('1', 'A', 500)];
    expect(sortSongs(sameDate, 'dateAdded', 'asc').map((s) => s.id)).toEqual(['1', '2', '3']);
  });
});

describe('sortSongs by most played', () => {
  const counts: Record<string, number> = { '1': 5, '2': 12, '3': 0, '4': 5 };
  const getPlayCount = (id: string) => counts[id] ?? 0;
  const songs = [song('1', 'Bravo'), song('2', 'Most'), song('3', 'Never'), song('4', 'Alpha'), song('5', 'New')];

  it('descending = most played first, ties by title A–Z', () => {
    expect(titles(sortSongs(songs, 'mostPlayed', 'desc', getPlayCount))).toEqual([
      'Most',
      'Alpha',
      'Bravo',
      'Never',
      'New',
    ]);
  });

  it('ascending = least played first, ties still by title A–Z', () => {
    expect(titles(sortSongs(songs, 'mostPlayed', 'asc', getPlayCount))).toEqual([
      'Never',
      'New',
      'Alpha',
      'Bravo',
      'Most',
    ]);
  });

  it('without counts, every song has 0 plays and the order is by title', () => {
    expect(titles(sortSongs(songs, 'mostPlayed', 'desc'))).toEqual(['Alpha', 'Bravo', 'Most', 'Never', 'New']);
  });
});
