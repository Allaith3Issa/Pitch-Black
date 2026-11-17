import { useCallback } from 'react';

import { usePlayerStore } from '@/store/playerStore';
import type { QueueSource } from '@/types/player';
import type { Song } from '@/types/song';
import { isSameQueueSource } from '@/utils/queueSource';

/**
 * Returns a function for tapping a song in a list:
 * - the playing song, in the list it plays from → pause / play
 * - the playing song, in another list → that list becomes the queue; the song keeps playing
 * - another song → play it, with the list exactly as shown as the queue
 * `source` is the list (see utils/queueSource).
 */
export function usePlayFromList(songs: Song[], source: QueueSource): (index: number) => void {
  const playQueue = usePlayerStore((state) => state.playQueue);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const switchQueue = usePlayerStore((state) => state.switchQueue);

  return useCallback(
    (index: number) => {
      const { queue, currentIndex, queueSource } = usePlayerStore.getState();
      const ids = songs.map((song) => song.id);
      if (queue[currentIndex] !== songs[index]?.id) {
        playQueue(ids, index, source);
      } else if (isSameQueueSource(queueSource, source)) {
        togglePlay();
      } else {
        switchQueue(ids, index, source);
      }
    },
    [songs, source, playQueue, togglePlay, switchQueue],
  );
}
