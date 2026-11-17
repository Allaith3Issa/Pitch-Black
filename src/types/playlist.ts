/** A song saved in an ordered list (a playlist): its id + fallback key (see utils/songKey). */
export type SongRef = {
  id: string;
  fallbackKey: string;
};

export type Playlist = {
  id: string;
  name: string;
  /** Milliseconds since epoch. The Playlists tab shows the newest first. */
  createdAt: number;
  /** In play order. A song is in a playlist at most once. */
  songs: SongRef[];
  /** A cover chosen from the gallery (a file in the app's storage, see services/playlistCover). */
  coverUri?: string;
};
