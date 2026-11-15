import {
  AssetField,
  type AssetMetadata,
  getPermissionsAsync,
  MediaType,
  type PermissionResponse,
  PermissionStatus,
  Query,
  requestPermissionsAsync,
} from 'expo-media-library';

import type { AudioPermission } from '@/types/permission';
import type { Song } from '@/types/song';
import { parseSongFilename } from '@/utils/parseSongFilename';

// Everything that reads the device's music lives in this file.
// To use another data source later, keep these exported functions and their return types.

/** Audio shorter than this is ignored (voice notes, ringtones, notification sounds). */
export const MIN_SONG_DURATION_SEC = 30;

const PAGE_SIZE = 500;

// Expo Go only allows the audio permission (asking for photo/video throws).
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

function toSong(asset: AssetMetadata): Song | null {
  // On Android the duration comes straight from MediaStore, in milliseconds.
  const durationSec = (asset.duration ?? 0) / 1000;
  if (durationSec < MIN_SONG_DURATION_SEC) return null;

  const filename = asset.filename ?? '';
  const { title, artist } = parseSongFilename(filename);

  return {
    id: asset.id,
    // The id is the asset's content URI (content://media/...), which can be played directly.
    uri: asset.id,
    title: title || filename,
    artist,
    durationSec,
    filename,
    // MediaStore does not give us "date added" here: use the creation time, else the last change.
    dateAdded: asset.creationTime ?? asset.modificationTime ?? 0,
  };
}

/** Reads every audio file on the device (page by page) and keeps only real songs. */
export async function loadAllSongs(): Promise<Song[]> {
  const songsById = new Map<string, Song>();
  let offset = 0;

  while (true) {
    const page = await new Query()
      .eq(AssetField.MEDIA_TYPE, MediaType.AUDIO)
      .orderBy(AssetField.MODIFICATION_TIME)
      .limit(PAGE_SIZE)
      .offset(offset)
      .exeForMetadata();

    for (const asset of page) {
      const song = toSong(asset);
      // A Map avoids duplicates if the library changes while we page through it.
      if (song) songsById.set(song.id, song);
    }

    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return Array.from(songsById.values());
}
