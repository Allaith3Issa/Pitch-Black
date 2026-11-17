import { describe, expect, it } from '@jest/globals';

import type { Song } from '@/types/song';
import {
  addSongRefs,
  checkPlaylistName,
  cleanPlaylistName,
  formatPlaylistCount,
  formatSongCount,
  formatTotalDuration,
  getPlaylistSummary,
  MAX_PLAYLIST_NAME_LENGTH,
  removeSongRef,
} from '@/utils/playlist';
import { toSongRef } from '@/utils/songList';

function song(id: string, durationSec = 200): Song {
  return {
    id,
    title: id,
    artist: null,
    album: null,
    albumId: null,
    durationSec,
    uri: `content://media/${id}`,
    filename: `${id}.mp3`,
    dateAdded: 0,
    dateModified: 0,
  };
}

describe('cleanPlaylistName', () => {
  it('trims and keeps single spaces', () => {
    expect(cleanPlaylistName('  Road   Trip ')).toBe('Road Trip');
  });
});

describe('checkPlaylistName', () => {
  it('accepts a new name', () => {
    expect(checkPlaylistName('Road Trip', ['Gym'])).toEqual({ isValid: true, error: null });
  });

  it('rejects an empty name without a message', () => {
    expect(checkPlaylistName('   ', [])).toEqual({ isValid: false, error: null });
  });

  it('rejects a name that exists, ignoring case and spaces', () => {
    const error = 'A playlist with this name already exists';
    expect(checkPlaylistName('road trip', ['Road Trip'])).toEqual({ isValid: false, error });
    expect(checkPlaylistName(' ROADTRIP ', ['Road Trip'])).toEqual({ isValid: false, error });
  });

  it('rejects a name that is too long', () => {
    const result = checkPlaylistName('a'.repeat(MAX_PLAYLIST_NAME_LENGTH + 1), []);
    expect(result.isValid).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('allows renaming a playlist to its own name in another case (its name is not in the list)', () => {
    expect(checkPlaylistName('ROAD TRIP', ['Gym']).isValid).toBe(true);
  });
});

describe('addSongRefs / removeSongRef', () => {
  it('adds at the end without duplicates', () => {
    const list = [toSongRef(song('1'))];
    const result = addSongRefs(list, [song('2'), song('1'), song('3'), song('2')]);
    expect(result.map((ref) => ref.id)).toEqual(['1', '2', '3']);
  });

  it('returns the same list when nothing is new', () => {
    const list = [toSongRef(song('1'))];
    expect(addSongRefs(list, [song('1')])).toBe(list);
  });

  it('removes a song', () => {
    const list = [toSongRef(song('1')), toSongRef(song('2'))];
    expect(removeSongRef(list, '1').map((ref) => ref.id)).toEqual(['2']);
  });
});

describe('formatting', () => {
  it('formats the playlist count', () => {
    expect(formatPlaylistCount(1)).toBe('1 playlist');
    expect(formatPlaylistCount(5)).toBe('5 playlists');
  });

  it('formats the song count', () => {
    expect(formatSongCount(0)).toBe('0 songs');
    expect(formatSongCount(1)).toBe('1 song');
    expect(formatSongCount(8)).toBe('8 songs');
  });

  it('formats the total length', () => {
    expect(formatTotalDuration(0)).toBe('0 min');
    expect(formatTotalDuration(20)).toBe('1 min');
    expect(formatTotalDuration(31 * 60 + 10)).toBe('31 min');
    expect(formatTotalDuration(65 * 60)).toBe('1 h 5 min');
    expect(formatTotalDuration(120 * 60)).toBe('2 h');
  });

  it('builds the summary', () => {
    expect(getPlaylistSummary([])).toBe('0 songs');
    expect(getPlaylistSummary([song('1', 900), song('2', 960)])).toBe('2 songs · 31 min');
  });
});
