import type { SortBy, SortOrder } from '@/types/sort';
import type { Song } from '@/types/song';

/*
 * Name · A–Z puts titles in three groups, by their first character:
 *   1. English (Latin letters), A→Z, case-insensitive
 *   2. Arabic letters, ا→ي
 *   3. Everything else (numbers, also Arabic-Indic digits like "٢٠٢٠", and symbols)
 *
 *   Example: "adele", "Beat It", "Zara", "أحلام", "بحر", "ياسمين", "(Live)", "1989"
 *
 * Name · Z–A is the exact reverse:
 *   "1989", "(Live)", "ياسمين", "بحر", "أحلام", "Zara", "Beat It", "adele"
 *
 * Date added: ascending = oldest first, descending = newest first.
 * Ties (same title or same date) are broken by title, then by id, so the order is always the same.
 *
 * Most played: descending = most played first, ascending = least played first.
 * Ties (same count) are always by title A–Z, then by id, in both orders.
 */

// Basic Latin letters + accented Latin letters (À–ɏ).
const LATIN_LETTER = /^[A-Za-z\u00C0-\u024F]/;
// Arabic letters only (ء–ي, ٱ–ۓ, and the presentation forms) — not Arabic digits or punctuation.
const ARABIC_LETTER = /^[\u0621-\u064A\u0671-\u06D3\uFB50-\uFDFF\uFE70-\uFEFC]/;

// Group order for Name sorting.
const LATIN = 0;
const ARABIC = 1;
const OTHER = 2;

// Created once: building a collator is slow, comparing with it is fast.
// `sensitivity: 'base'` ignores case and accents ("a" = "A" = "á").
const englishCollator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const arabicCollator = new Intl.Collator('ar', { sensitivity: 'base', numeric: true });

function titleGroup(title: string): number {
  if (LATIN_LETTER.test(title)) return LATIN;
  if (ARABIC_LETTER.test(title)) return ARABIC;
  return OTHER;
}

/** Ascending comparison of two titles (groups first, then the right collator). */
function compareTitles(a: string, b: string): number {
  const groupA = titleGroup(a);
  const groupB = titleGroup(b);
  if (groupA !== groupB) return groupA - groupB;

  const collator = groupA === ARABIC ? arabicCollator : englishCollator;
  return collator.compare(a, b);
}

/** Last tie-breaker. Ids are numbers as text, so compare them as numbers. */
function compareIds(a: Song, b: Song): number {
  return englishCollator.compare(a.id, b.id);
}

function compareByTitle(a: Song, b: Song): number {
  return compareTitles(a.title, b.title) || compareIds(a, b);
}

function compareAscending(a: Song, b: Song, sortBy: SortBy): number {
  if (sortBy === 'dateAdded' && a.dateAdded !== b.dateAdded) {
    return a.dateAdded - b.dateAdded;
  }
  return compareByTitle(a, b);
}

const noPlays = () => 0;

/**
 * Returns a new sorted array. The original array is not changed.
 * `getPlayCount` is only used for 'mostPlayed'.
 */
export function sortSongs(
  songs: readonly Song[],
  sortBy: SortBy,
  order: SortOrder,
  getPlayCount: (songId: string) => number = noPlays,
): Song[] {
  const direction = order === 'asc' ? 1 : -1;
  if (sortBy === 'mostPlayed') {
    return [...songs].sort(
      (a, b) => direction * (getPlayCount(a.id) - getPlayCount(b.id)) || compareByTitle(a, b),
    );
  }
  return [...songs].sort((a, b) => direction * compareAscending(a, b, sortBy));
}
