import { describe, expect, it } from '@jest/globals';

import { parseSongFilename } from '@/utils/parseSongFilename';

describe('parseSongFilename', () => {
  it('splits "Artist - Title.mp3"', () => {
    expect(parseSongFilename('Adele - Hello.mp3')).toEqual({ artist: 'Adele', title: 'Hello' });
  });

  it('keeps everything after the first " - " in the title', () => {
    expect(parseSongFilename('Adele - Hello - Live.mp3')).toEqual({ artist: 'Adele', title: 'Hello - Live' });
  });

  it('returns no artist when there is no " - "', () => {
    expect(parseSongFilename('Hello.mp3')).toEqual({ artist: null, title: 'Hello' });
    expect(parseSongFilename('Jay-Z.mp3')).toEqual({ artist: null, title: 'Jay-Z' });
  });

  it('does not split when one side is empty', () => {
    expect(parseSongFilename('Adele - .mp3')).toEqual({ artist: null, title: 'Adele -' });
  });

  it('works with Arabic names and files without an extension', () => {
    expect(parseSongFilename('فيروز - نسم علينا الهوى.m4a')).toEqual({
      artist: 'فيروز',
      title: 'نسم علينا الهوى',
    });
    expect(parseSongFilename('Hello')).toEqual({ artist: null, title: 'Hello' });
  });

  it('keeps a filename that starts with a dot', () => {
    expect(parseSongFilename('.hidden')).toEqual({ artist: null, title: '.hidden' });
  });
});
