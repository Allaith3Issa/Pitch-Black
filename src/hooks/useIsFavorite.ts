import { useFavoritesStore } from '@/store/favoritesStore';

/** `true` when the song is a favorite. Re-renders only when this song's heart changes. */
export function useIsFavorite(songId: string): boolean {
  return useFavoritesStore((state) => songId in state.favorites);
}
