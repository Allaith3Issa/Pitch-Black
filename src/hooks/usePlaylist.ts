import { useMemo } from 'react';

import { useLibraryStore } from '@/store/libraryStore';
import { usePlaylistStore } from '@/store/playlistStore';
import type { Playlist } from '@/types/playlist';
import type { Song } from '@/types/song';
import { resolveSongs } from '@/utils/songList';

type PlaylistData = {
  /** `undefined` when there is no playlist with this id (e.g. it was deleted). */
  playlist: Playlist | undefined;
  /** Its songs that are on the phone right now, in playlist order. */
  songs: Song[];
  /** Saved songs that are not on the phone right now (kept, they may come back). */
  missingCount: number;
};

export function usePlaylist(id: string): PlaylistData {
  const playlist = usePlaylistStore((state) => state.playlists.find((item) => item.id === id));
  const songsById = useLibraryStore((state) => state.songsById);

  return useMemo(() => {
    const songs = playlist ? resolveSongs(playlist.songs.map((ref) => ref.id), songsById) : [];
    return { playlist, songs, missingCount: playlist ? playlist.songs.length - songs.length : 0 };
  }, [playlist, songsById]);
}
