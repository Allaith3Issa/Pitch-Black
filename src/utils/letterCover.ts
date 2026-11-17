// The first letter or digit, in any script (Latin, Arabic, ...).
const FIRST_LETTER = /[\p{L}\p{N}]/u;

/** Shown when a title has no letter or digit at all. */
const NO_LETTER = '#';

/** The letter on a song without a cover: the first letter (or digit) of the title, upper case. */
export function getCoverLetter(title: string): string {
  const match = FIRST_LETTER.exec(title);
  return match ? match[0].toUpperCase() : NO_LETTER;
}

/**
 * Which of the `colorCount` letter-cover colors a song gets. It depends only on the song id,
 * so a song keeps its color (also after a rename or a restart).
 */
export function getCoverColorIndex(songId: string, colorCount: number): number {
  let hash = 0;
  for (let i = 0; i < songId.length; i++) {
    // `| 0` keeps the number a 32-bit integer.
    hash = (hash * 31 + songId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % colorCount;
}
