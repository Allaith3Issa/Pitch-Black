import {
  getPermissionsAsync,
  type PermissionResponse,
  PermissionStatus,
  requestPermissionsAsync,
} from 'expo-media-library';

import type { AudioPermission } from '@/types/permission';
import type { Song, SongFileDetails } from '@/types/song';
import { parseSongFilename } from '@/utils/parseSongFilename';
import { stripArtistName } from '@/utils/stripArtistName';
import MediaStore, { type MediaStoreAudioFile } from '@modules/media-store';

// Everything that reads the device's music lives in this file.
// - Permission: expo-media-library (audio only).
// - Songs: our local native module `modules/media-store` (Android MediaStore).
// To use another data source later, keep these exported functions and their return types.

/** Audio shorter than this is ignored (voice notes, ringtones, notification sounds). */
export const MIN_SONG_DURATION_SEC = 30;

const GRANULAR_PERMISSIONS: ['audio'] = ['audio'];

function toAudioPermission(response: PermissionResponse): AudioPermission {
  if (response.granted) return 'granted';
  if (response.status === PermissionStatus.UNDETERMINED) return 'undetermined';
  return response.canAskAgain ? 'denied' : 'blocked';
}

export async function getAudioPermission(): Promise<AudioPermission> {
  return toAudioPermission(await getPermissionsAsync(false, GRANULAR_PERMISSIONS));
}

export async function requestAudioPermission(): Promise<AudioPermission> {
  return toAudioPermission(await requestPermissionsAsync(false, GRANULAR_PERMISSIONS));
}

// Shown when a file has neither a title tag nor a filename (very rare).
const UNKNOWN_TITLE = 'Unknown title';

// MediaStore uses "<unknown>" when a file has no tag.
const UNKNOWN_TAG = '<unknown>';

/** A tag value, or `null` when it is empty or "<unknown>". */
function cleanTag(value: string | null): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed === '' || trimmed === UNKNOWN_TAG ? null : trimmed;
}

function toSong(file: MediaStoreAudioFile): Song {
  const tagTitle = cleanTag(file.title);
  const tagArtist = cleanTag(file.artist);
  const fromFilename = parseSongFilename(file.filename);

  // Without an artist tag, MediaStore's title is usually just the filename,
  // so "Artist - Title.mp3" is better split by parseSongFilename.
  const useFilename = tagArtist === null && fromFilename.artist !== null;
  const title = (useFilename ? fromFilename.title : (tagTitle ?? fromFilename.title)) || UNKNOWN_TITLE;
  const artist = tagArtist ?? fromFilename.artist;

  return {
    id: file.id,
    uri: file.uri,
    // Some title tags repeat the artist ("Artist - Title", "Title _ Artist"): keep only the title.
    title: stripArtistName(title, artist),
    artist,
    album: cleanTag(file.album),
    albumId: file.albumId,
    durationSec: file.durationMs / 1000,
    filename: file.filename,
    dateAdded: file.dateAdded,
    dateModified: file.dateModified,
  };
}

/** Reads the real songs on the device (at least MIN_SONG_DURATION_SEC long). */
export async function loadAllSongs(): Promise<Song[]> {
  // MediaStore already skips shorter files, so they are never sent to JS.
  const files = await MediaStore.getAudioFilesAsync(MIN_SONG_DURATION_SEC * 1000);
  return files.map(toSong);
}

/** Size, format, folder and bitrate of a song's file (Song info sheet). */
export function loadSongFileDetails(songId: string): Promise<SongFileDetails> {
  return MediaStore.getAudioDetailsAsync(songId);
}

/** Opens the Android share sheet with the song's audio file. */
export function shareSongFile(song: Song): Promise<void> {
  return MediaStore.shareAudioAsync(song.id, song.title);
}
