import type { SongRef } from '@/types/playlist';
import type { Song } from '@/types/song';
import { toSongRef } from '@/utils/songList';

export const MAX_PLAYLIST_NAME_LENGTH = 50;

/** The name as saved: no spaces at the start or end, and single spaces inside. */
export function cleanPlaylistName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

/** Names are compared without case and without spaces: "Road Trip" = "road trip" = "RoadTrip". */
function nameKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '');
}

export type PlaylistNameCheck = {
  isValid: boolean;
  /** Shown under the input. `null` when there is nothing to say (also for an empty name). */
  error: string | null;
};

/**
 * Checks a new playlist name. `otherNames` are the names of the other playlists (when renaming,
 * without the playlist's own name, so its case can still be changed).
 */
export function checkPlaylistName(name: string, otherNames: readonly string[]): PlaylistNameCheck {
  const cleaned = cleanPlaylistName(name);
  if (cleaned === '') return { isValid: false, error: null };
  if (cleaned.length > MAX_PLAYLIST_NAME_LENGTH) {
    return { isValid: false, error: `Use at most ${MAX_PLAYLIST_NAME_LENGTH} characters` };
  }
  const key = nameKey(cleaned);
  if (otherNames.some((other) => nameKey(other) === key)) {
    return { isValid: false, error: 'A playlist with this name already exists' };
  }
  return { isValid: true, error: null };
}

/** Adds songs at the end, in the given order. Songs already in the list are not added again. */
export function addSongRefs(list: SongRef[], songs: readonly Song[]): SongRef[] {
  const ids = new Set(list.map((ref) => ref.id));
  const added: SongRef[] = [];
  for (const song of songs) {
    if (ids.has(song.id)) continue;
    ids.add(song.id);
    added.push(toSongRef(song));
  }
  return added.length === 0 ? list : [...list, ...added];
}

export function removeSongRef(list: SongRef[], songId: string): SongRef[] {
  return list.filter((ref) => ref.id !== songId);
}

/** "1 playlist", "5 playlists". */
export function formatPlaylistCount(count: number): string {
  return count === 1 ? '1 playlist' : `${count} playlists`;
}

/** "1 song", "8 songs". */
export function formatSongCount(count: number): string {
  return count === 1 ? '1 song' : `${count} songs`;
}

/** Total length, rounded to minutes: "31 min", "1 h 5 min", "2 h". Never "0 min" for songs that have a length. */
export function formatTotalDuration(totalSec: number): string {
  const minutes = totalSec > 0 ? Math.max(1, Math.round(totalSec / 60)) : 0;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

/** "8 songs · 31 min" (only the count when there are no songs). */
export function getPlaylistSummary(songs: readonly Song[]): string {
  if (songs.length === 0) return formatSongCount(0);
  const totalSec = songs.reduce((sum, song) => sum + song.durationSec, 0);
  return `${formatSongCount(songs.length)} · ${formatTotalDuration(totalSec)}`;
}
