import { NativeModule, requireNativeModule } from 'expo';

/**
 * One audio file, as returned by Android's MediaStore.
 * (The Kotlin side still sends an extra `isMusic` field; it is ignored here and removed in Step 3.)
 */
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
  filename: string;
};

declare class MediaStoreModule extends NativeModule {
  /**
   * Reads every audio file on the device.
   * Rejects with code `ERR_MISSING_AUDIO_PERMISSION` or `ERR_MEDIA_STORE_QUERY`.
   */
  getAudioFilesAsync(): Promise<MediaStoreAudioFile[]>;
}

// Android only (this app does not support other platforms).
export default requireNativeModule<MediaStoreModule>('MediaStore');
