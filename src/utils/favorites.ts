import type { SavedSongEntry } from '@/utils/songKey';

export type FavoriteEntry = SavedSongEntry & {
  /** When the heart was tapped (ms since epoch). The Favorites tab shows the newest first. */
  addedAt: number;
};

/** Favorite song ids, newest favorite first. */
export function getFavoriteIdsNewestFirst(favorites: Readonly<Record<string, FavoriteEntry>>): string[] {
  return Object.entries(favorites)
    .sort(([, a], [, b]) => b.addedAt - a.addedAt)
    .map(([id]) => id);
}
