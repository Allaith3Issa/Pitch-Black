import { describe, expect, it } from '@jest/globals';

import { stripArtistPrefix } from '@/utils/stripArtistPrefix';

describe('stripArtistPrefix', () => {
  it('removes the artist from the start of the title', () => {
    expect(stripArtistPrefix('Adele - Hello', 'Adele')).toBe('Hello');
  });

  it('ignores case and extra spaces', () => {
    expect(stripArtistPrefix('  ADELE - Hello ', ' adele ')).toBe('Hello');
  });

  it('tries each part of an artist tag with two names', () => {
    expect(
      stripArtistPrefix('Bilal Derky - بعد سنين (feat. Fady Haroun)', 'Bilal Derky - بلال ديركي'),
    ).toBe('بعد سنين (feat. Fady Haroun)');
    expect(stripArtistPrefix('بلال ديركي - بعد سنين', 'Bilal Derky - بلال ديركي')).toBe('بعد سنين');
  });

  it('removes the whole artist when the title repeats all of it', () => {
    expect(stripArtistPrefix('Bilal Derky - بلال ديركي - بعد سنين', 'Bilal Derky - بلال ديركي')).toBe(
      'بعد سنين',
    );
  });

  it('keeps the title when it does not start with the artist', () => {
    expect(stripArtistPrefix('Hello', 'Adele')).toBe('Hello');
    expect(stripArtistPrefix('Hello - Adele', 'Adele')).toBe('Hello - Adele');
    // The artist name must be followed by " - ", not just be the first word.
    expect(stripArtistPrefix('Adeles Song', 'Adele')).toBe('Adeles Song');
  });

  it('keeps the title when the artist is unknown', () => {
    expect(stripArtistPrefix('Adele - Hello', null)).toBe('Adele - Hello');
  });

  it('never returns an empty title', () => {
    // Only the artist and the separator: nothing would be left, so the title stays.
    expect(stripArtistPrefix('Adele - ', 'Adele')).toBe('Adele - ');
    expect(stripArtistPrefix('Adele', 'Adele')).toBe('Adele');
  });
});
