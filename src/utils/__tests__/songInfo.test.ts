import { describe, expect, it } from '@jest/globals';

import type { Song, SongFileDetails } from '@/types/song';
import { formatAudioFormat, formatBitrate, formatFileSize } from '@/utils/fileInfo';
import { formatDate } from '@/utils/formatDate';
import { buildSongInfoRows, LOADING_VALUE, UNKNOWN_VALUE } from '@/utils/songInfo';

const SONG: Song = {
  id: '1',
  title: 'Song',
  artist: 'Artist',
  album: null,
  albumId: null,
  durationSec: 225,
  uri: 'content://media/external/audio/media/1',
  filename: 'Artist - Song.mp3',
  dateAdded: new Date(2026, 10, 12).getTime(),
  dateModified: 0,
};

const DETAILS: SongFileDetails = {
  sizeBytes: 4.2 * 1024 * 1024,
  mimeType: 'audio/mpeg',
  folder: 'Music/Downloads',
  bitrate: 320_000,
};

/** The rows as { label: value }. */
function rows(details: SongFileDetails | null | undefined): Record<string, string> {
  return Object.fromEntries(buildSongInfoRows(SONG, details).map((row) => [row.label, row.value]));
}

describe('file info formatters', () => {
  it('formats sizes in MB and KB', () => {
    expect(formatFileSize(4.2 * 1024 * 1024)).toBe('4.2 MB');
    expect(formatFileSize(820 * 1024)).toBe('820 KB');
    expect(formatFileSize(100)).toBe('1 KB');
  });

  it('formats the bitrate in kbps', () => {
    expect(formatBitrate(320_000)).toBe('320 kbps');
    expect(formatBitrate(128_456)).toBe('128 kbps');
  });

  it('names the format from the MIME type, else from the extension', () => {
    expect(formatAudioFormat('audio/mpeg', 'a.mp3')).toBe('MP3');
    expect(formatAudioFormat('audio/x-unknown', 'a.opus')).toBe('OPUS');
    expect(formatAudioFormat(null, 'a.flac')).toBe('FLAC');
    expect(formatAudioFormat(null, 'no-extension')).toBeNull();
  });

  it('formats a date', () => {
    expect(formatDate(new Date(2026, 10, 12).getTime())).toBe('12 Nov 2026');
  });
});

describe('buildSongInfoRows', () => {
  it('shows every field in order', () => {
    expect(buildSongInfoRows(SONG, DETAILS).map((row) => row.label)).toEqual([
      'Title',
      'Artist',
      'Album',
      'Duration',
      'Filename',
      'Folder',
      'Size',
      'Format',
      'Bitrate',
      'Date added',
    ]);
  });

  it('fills in the file details', () => {
    expect(rows(DETAILS)).toMatchObject({
      Duration: '3:45',
      Folder: 'Music/Downloads',
      Size: '4.2 MB',
      Format: 'MP3',
      Bitrate: '320 kbps',
      'Date added': '12 Nov 2026',
    });
  });

  it('shows a dash for unknown values', () => {
    expect(rows({ sizeBytes: null, mimeType: null, folder: null, bitrate: null })).toMatchObject({
      Album: UNKNOWN_VALUE,
      Folder: UNKNOWN_VALUE,
      Size: UNKNOWN_VALUE,
      Bitrate: UNKNOWN_VALUE,
      // The extension still tells the format.
      Format: 'MP3',
    });
  });

  it('shows "…" for the file details while they load', () => {
    expect(rows(undefined)).toMatchObject({ Folder: LOADING_VALUE, Size: LOADING_VALUE, Title: 'Song' });
  });

  it('shows a dash for the file details when they could not be read', () => {
    expect(rows(null)).toMatchObject({ Folder: UNKNOWN_VALUE, Format: UNKNOWN_VALUE });
  });
});
