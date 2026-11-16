import { usePlayerStore } from '@/store/playerStore';

/** Id of the song that is loaded in the player, or `null`. */
export function useCurrentSongId(): string | null {
  return usePlayerStore((state) => state.queue[state.currentIndex] ?? null);
}
