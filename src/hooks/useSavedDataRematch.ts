import { useEffect } from 'react';

import { useFavoritesStore } from '@/store/favoritesStore';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlayCountStore } from '@/store/playCountStore';
import { usePlaylistStore } from '@/store/playlistStore';

/**
 * After every library load, moves saved data (play counts, favorites, playlists) to the new id of
 * songs whose MediaStore id changed (see utils/songKey). Each store waits until it was read from the phone.
 */
export function useSavedDataRematch(): void {
  const songs = useLibraryStore((state) => state.songs);
  const isPlayCountReady = usePlayCountStore((state) => state.isHydrated);
  const isFavoritesReady = useFavoritesStore((state) => state.isHydrated);
  const isPlaylistsReady = usePlaylistStore((state) => state.isHydrated);
  const rematchPlayCounts = usePlayCountStore((state) => state.rematch);
  const rematchFavorites = useFavoritesStore((state) => state.rematch);
  const rematchPlaylists = usePlaylistStore((state) => state.rematch);

  useEffect(() => {
    if (isPlayCountReady && songs.length > 0) rematchPlayCounts(songs);
  }, [songs, isPlayCountReady, rematchPlayCounts]);

  useEffect(() => {
    if (isFavoritesReady && songs.length > 0) rematchFavorites(songs);
  }, [songs, isFavoritesReady, rematchFavorites]);

  useEffect(() => {
    if (isPlaylistsReady && songs.length > 0) rematchPlaylists(songs);
  }, [songs, isPlaylistsReady, rematchPlaylists]);
}
