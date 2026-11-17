import { ToastAndroid } from 'react-native';

import { deletePlaylistCoverFile, pickPlaylistCover } from '@/services/playlistCover';
import { usePlaylistStore } from '@/store/playlistStore';

/** The saved cover of a playlist right now (read fresh, not from an old render). */
function currentCover(playlistId: string): string | undefined {
  return usePlaylistStore.getState().playlists.find((playlist) => playlist.id === playlistId)?.coverUri;
}

/** Pick / remove a playlist's gallery cover, and clean up the old cover file. */
export function usePlaylistCoverActions() {
  const setCover = usePlaylistStore((state) => state.setCover);

  const changeCover = async (playlistId: string) => {
    try {
      const uri = await pickPlaylistCover(playlistId);
      if (uri === null) return;
      const exists = usePlaylistStore.getState().playlists.some((playlist) => playlist.id === playlistId);
      // The playlist was deleted while the picker was open: drop the copied file.
      if (!exists) {
        deletePlaylistCoverFile(uri);
        return;
      }
      const oldCover = currentCover(playlistId);
      setCover(playlistId, uri);
      if (oldCover) deletePlaylistCoverFile(oldCover);
    } catch {
      ToastAndroid.show('Could not use this image', ToastAndroid.SHORT);
    }
  };

  const removeCover = (playlistId: string) => {
    const oldCover = currentCover(playlistId);
    setCover(playlistId, undefined);
    if (oldCover) deletePlaylistCoverFile(oldCover);
  };

  return { changeCover, removeCover };
}
