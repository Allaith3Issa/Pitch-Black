import { describe, expect, it } from '@jest/globals';

import { stripArtistName } from '@/utils/stripArtistName';

describe('stripArtistName', () => {
  it('removes the artist from the start of the title', () => {
    expect(stripArtistName('Adele - Hello', 'Adele')).toBe('Hello');
  });

  it('ignores case and extra spaces', () => {
    expect(stripArtistName('  ADELE - Hello ', ' adele ')).toBe('Hello');
  });

  it('treats " _ " like " - "', () => {
    expect(stripArtistName('Adele _ Hello', 'Adele')).toBe('Hello');
  });

  it('removes the artist from the end of the title', () => {
    expect(stripArtistName('Hello - Adele', 'Adele')).toBe('Hello');
    expect(stripArtistName('Hello _ Adele', 'Adele')).toBe('Hello');
  });

  it('removes an Arabic name at the end when the artist tag holds it', () => {
    expect(stripArtistName('A handful of Air _ فرج سليمان', 'Faraj Suleiman - فرج سليمان')).toBe(
      'A handful of Air',
    );
    expect(stripArtistName('A handful of Air _ فرج سليمان', 'فرج سليمان')).toBe('A handful of Air');
    expect(stripArtistName('A handful of Air _ فرج سليمان', 'Faraj Suleiman _ فرج سليمان')).toBe(
      'A handful of Air',
    );
  });

  it('cannot remove a name that is not in the artist tag', () => {
    // An English-only tag does not know the Arabic spelling.
    expect(stripArtistName('A handful of Air _ فرج سليمان', 'Faraj Suleiman')).toBe(
      'A handful of Air _ فرج سليمان',
    );
  });

  it('removes the artist from both ends', () => {
    expect(stripArtistName('Adele - Hello - Adele', 'Adele')).toBe('Hello');
  });

  it('tries each part of an artist tag with two names', () => {
    expect(
      stripArtistName('Bilal Derky - بعد سنين (feat. Fady Haroun)', 'Bilal Derky - بلال ديركي'),
    ).toBe('بعد سنين (feat. Fady Haroun)');
    expect(stripArtistName('بلال ديركي - بعد سنين', 'Bilal Derky - بلال ديركي')).toBe('بعد سنين');
  });

  it('removes the whole artist when the title repeats all of it', () => {
    expect(stripArtistName('Bilal Derky - بلال ديركي - بعد سنين', 'Bilal Derky - بلال ديركي')).toBe(
      'بعد سنين',
    );
  });

  it('keeps the title when the artist is not at the start or the end', () => {
    expect(stripArtistName('Hello', 'Adele')).toBe('Hello');
    expect(stripArtistName('Hello - Adele - Live', 'Adele')).toBe('Hello - Adele - Live');
    // The artist name must be next to a separator, not just be the first or last word.
    expect(stripArtistName('Adeles Song', 'Adele')).toBe('Adeles Song');
    expect(stripArtistName('Song by Adele', 'Adele')).toBe('Song by Adele');
  });

  it('keeps the title when the artist is unknown', () => {
    expect(stripArtistName('Adele - Hello', null)).toBe('Adele - Hello');
  });

  it('never returns an empty title', () => {
    // Only the artist and the separator: nothing would be left, so the title stays.
    expect(stripArtistName('Adele - ', 'Adele')).toBe('Adele - ');
    expect(stripArtistName('Adele', 'Adele')).toBe('Adele');
    expect(stripArtistName(' - Adele', 'Adele')).toBe(' - Adele');
  });
});
