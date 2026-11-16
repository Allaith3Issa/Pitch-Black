const SEPARATOR = ' - ';

/**
 * Removes the artist name from the start of a title, when the title repeats it.
 * The artist is also tried part by part, because some artist tags hold two names.
 *
 *   ("Adele - Hello", "Adele")                            → "Hello"
 *   ("bilal derky - بعد سنين", "Bilal Derky - بلال ديركي") → "بعد سنين"
 *   ("Hello", "Adele")                                    → "Hello"  (no prefix)
 *   ("Adele - ", "Adele")                                 → "Adele - "  (never empty)
 */
export function stripArtistPrefix(title: string, artist: string | null): string {
  if (artist === null) return title;

  const trimmedTitle = title.trim();
  const lowerTitle = trimmedTitle.toLowerCase();

  // The whole artist first, then each part. Longest first, so the biggest match wins.
  const candidates = [artist, ...artist.split(SEPARATOR)]
    .map((name) => name.trim())
    .filter((name) => name !== '')
    .sort((a, b) => b.length - a.length);

  for (const name of candidates) {
    const prefix = `${name}${SEPARATOR}`.toLowerCase();
    if (lowerTitle.startsWith(prefix)) {
      const rest = trimmedTitle.slice(prefix.length).trim();
      if (rest !== '') return rest;
    }
  }
  return title;
}
