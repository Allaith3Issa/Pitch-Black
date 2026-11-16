import {
  getPermissionsAsync,
  type PermissionResponse,
  PermissionStatus,
  requestPermissionsAsync,
} from 'expo-media-library';

import type { AudioPermission } from '@/types/permission';
import type { Song } from '@/types/song';
import { parseSongFilename } from '@/utils/parseSongFilename';
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

  return {
    id: file.id,
    uri: file.uri,
    title: (useFilename ? fromFilename.title : (tagTitle ?? fromFilename.title)) || UNKNOWN_TITLE,
    artist: tagArtist ?? fromFilename.artist,
    album: cleanTag(file.album),
    albumId: file.albumId,
    durationSec: file.durationMs / 1000,
    filename: file.filename,
    dateAdded: file.dateAdded,
  };
}

/** Reads every audio file on the device and keeps only real songs (at least MIN_SONG_DURATION_SEC long). */
export async function loadAllSongs(): Promise<Song[]> {
  const files = await MediaStore.getAudioFilesAsync();
  return files.map(toSong).filter((song) => song.durationSec >= MIN_SONG_DURATION_SEC);
}
