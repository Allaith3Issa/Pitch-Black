import { NativeModule, requireNativeModule } from 'expo';

/** One audio file, as returned by Android's MediaStore. */
export type MediaStoreAudioFile = {
  id: string;
  /** Playable content URI. */
  uri: string;
  title: string | null;
  artist: string | null;
  album: string | null;
  albumId: string | null;
  durationMs: number;
  /** Milliseconds since epoch. */
  dateAdded: number;
  /** Milliseconds since epoch. Changes when the file (e.g. its tags or cover) changes. */
  dateModified: number;
  filename: string;
};

/** Extra file details for the Song info sheet. `null` when Android does not know the value. */
export type MediaStoreAudioDetails = {
  sizeBytes: number | null;
  /** E.g. "audio/mpeg". */
  mimeType: string | null;
  /** E.g. "Music/Downloads". */
  folder: string | null;
  /** Bits per second. */
  bitrate: number | null;
};

declare class MediaStoreModule extends NativeModule {
  /**
   * Reads every audio file on the device that is at least `minDurationMs` long.
   * Rejects with code `ERR_MISSING_AUDIO_PERMISSION` or `ERR_MEDIA_STORE_QUERY`.
   */
  getAudioFilesAsync(minDurationMs: number): Promise<MediaStoreAudioFile[]>;
  /** Rejects with `ERR_AUDIO_FILE_NOT_FOUND` when the file is gone. */
  getAudioDetailsAsync(id: string): Promise<MediaStoreAudioDetails>;
  /**
   * The embedded cover, scaled to `sizePx` and cached in the app cache, as a `file://` URI.
   * `null` when the file has no cover.
   */
  getCoverAsync(id: string, dateModified: number, sizePx: number): Promise<string | null>;
  /** Opens the Android share sheet with the audio file. */
  shareAudioAsync(id: string, title: string): Promise<void>;
}

// Android only (this app does not support other platforms).
export default requireNativeModule<MediaStoreModule>('MediaStore');
