import { useCallback } from 'react';

import { usePlayerStore } from '@/store/playerStore';
import type { Song } from '@/types/song';

/**
 * Returns a function for tapping a song in a list:
 * - the song that is already loaded → pause / play
 * - another song → play it, with the list exactly as shown as the queue
 */
export function usePlayFromList(songs: Song[]): (index: number) => void {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const togglePlay = usePlayerStore((state) => state.togglePlay);

  return useCallback(
    (index: number) => {
      const { queue, currentIndex } = usePlayerStore.getState();
      if (queue[currentIndex] === songs[index]?.id) {
        togglePlay();
      } else {
        playQueue(
          songs.map((song) => song.id),
          index,
        );
      }
    },
    [songs, playQueue, togglePlay],
  );
}
