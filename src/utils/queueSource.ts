import type { QueueSource } from '@/types/player';
import type { Playlist } from '@/types/playlist';

// The fixed sources, as constants, so they keep the same object between renders.
export const SONGS_QUEUE: QueueSource = { type: 'songs' };
export const SEARCH_QUEUE: QueueSource = { type: 'search' };
export const FAVORITES_QUEUE: QueueSource = { type: 'favorites' };

export function playlistQueue(playlistId: string): QueueSource {
  return { type: 'playlist', playlistId };
}

/** `true` when both are the same list (for playlists: the same playlist). */
export function isSameQueueSource(a: QueueSource | null, b: QueueSource): boolean {
  if (a === null || a.type !== b.type) return false;
  return a.type !== 'playlist' || (b.type === 'playlist' && a.playlistId === b.playlistId);
}

/** The title on Now Playing. A playlist shows its current name (so a rename shows right away). */
export function getQueueTitle(source: QueueSource | null, playlists: readonly Playlist[]): string {
  switch (source?.type) {
    case 'songs':
      return 'All songs';
    case 'search':
      return 'Search results';
    case 'favorites':
      return 'Favorites';
    case 'playlist':
      return playlists.find((playlist) => playlist.id === source.playlistId)?.name ?? 'Playlist';
    default:
      return '';
  }
}
