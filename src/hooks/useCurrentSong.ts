import { useCurrentSongId } from '@/hooks/useCurrentSongId';
import { useLibraryStore } from '@/store/libraryStore';
import type { Song } from '@/types/song';

/** The song that is loaded in the player, or `null` when nothing is loaded. */
export function useCurrentSong(): Song | null {
  const currentId = useCurrentSongId();
  return useLibraryStore((state) => (currentId ? state.songsById[currentId] : undefined)) ?? null;
}
