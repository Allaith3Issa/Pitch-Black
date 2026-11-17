// "Artist - Title" and "Title _ Artist": both separators are used in titles and in artist tags.
const SEPARATORS = [' - ', ' _ '];
const SEPARATOR_PATTERN = / [-_] /;

/** The whole artist first, then each part. Longest first, so the biggest match wins. */
function artistNames(artist: string): string[] {
  return [artist, ...artist.split(SEPARATOR_PATTERN)]
    .map((name) => name.trim())
    .filter((name) => name !== '')
    .sort((a, b) => b.length - a.length);
}

function stripStart(title: string, names: string[]): string {
  const lowerTitle = title.toLowerCase();
  for (const name of names) {
    for (const separator of SEPARATORS) {
      const prefix = `${name}${separator}`.toLowerCase();
      if (lowerTitle.startsWith(prefix)) {
        const rest = title.slice(prefix.length).trim();
        if (rest !== '') return rest;
      }
    }
  }
  return title;
}

function stripEnd(title: string, names: string[]): string {
  const lowerTitle = title.toLowerCase();
  for (const name of names) {
    for (const separator of SEPARATORS) {
      const suffix = `${separator}${name}`.toLowerCase();
      if (lowerTitle.endsWith(suffix)) {
        const rest = title.slice(0, title.length - suffix.length).trim();
        if (rest !== '') return rest;
      }
    }
  }
  return title;
}

/**
 * Removes the artist name from the start and from the end of a title, when the title repeats it.
 * The artist is also tried part by part, because some artist tags hold two names.
 *
 *   ("Adele - Hello", "Adele")                                       → "Hello"
 *   ("Hello _ Adele", "Adele")                                       → "Hello"
 *   ("bilal derky - بعد سنين", "Bilal Derky - بلال ديركي")            → "بعد سنين"
 *   ("A handful of Air _ فرج سليمان", "Faraj Suleiman - فرج سليمان") → "A handful of Air"
 *   ("Hello", "Adele")                                               → "Hello"  (no artist in it)
 *   ("Adele - ", "Adele")                                            → "Adele - "  (never empty)
 *
 * The names must match as written (only case is ignored): an English artist tag cannot remove an
 * Arabic name from the title.
 */
export function stripArtistName(title: string, artist: string | null): string {
  if (artist === null) return title;

  const names = artistNames(artist);
  const trimmedTitle = title.trim();
  const result = stripEnd(stripStart(trimmedTitle, names), names);
  return result === trimmedTitle ? title : result;
}
