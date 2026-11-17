/**
 * What happens when a song ends by itself:
 * - 'off': play the next song; stop after the last one
 * - 'all': play the next song; after the last one start again from the first
 * - 'one': play the same song again
 */
export type RepeatMode = 'off' | 'all' | 'one';

/**
 * Where the queue comes from. Now Playing shows its title ("All songs", a playlist's current name...),
 * and tapping the playing song in another list switches the queue to that list.
 */
export type QueueSource =
  | { type: 'songs' }
  | { type: 'search' }
  | { type: 'favorites' }
  | { type: 'playlist'; playlistId: string };
