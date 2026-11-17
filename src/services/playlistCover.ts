import { Directory, File, Paths } from 'expo-file-system';
import { launchImageLibraryAsync } from 'expo-image-picker';

// Playlist covers chosen from the phone's gallery.
// The picked image is copied into the app's own documents folder, so the cover stays when the original
// photo is deleted. The documents folder is never cleared by Android (the cache folder can be).

const COVERS_FOLDER = 'playlist-covers';

// JPEG quality of the cropped image (0–1). Enough for a 120 px cover, and keeps the file small.
const PICK_QUALITY = 0.8;

/**
 * Opens Android's photo picker (no permission needed) with a square crop, and saves the result.
 * Returns the saved cover's URI, or `null` when the user cancelled.
 */
export async function pickPlaylistCover(playlistId: string): Promise<string | null> {
  const result = await launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [1, 1],
    quality: PICK_QUALITY,
  });
  if (result.canceled || result.assets.length === 0) return null;

  const folder = new Directory(Paths.document, COVERS_FOLDER);
  folder.create({ intermediates: true, idempotent: true });
  // A new name each time, so the image cache never shows the old cover after "Change cover".
  const cover = new File(folder, `${playlistId}-${Date.now()}.jpg`);
  await new File(result.assets[0].uri).copy(cover);
  return cover.uri;
}

/** Deletes a saved cover file. A file that is already gone is fine. */
export function deletePlaylistCoverFile(uri: string): void {
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Not being able to delete only leaves a small unused file; the playlist itself is fine.
  }
}
