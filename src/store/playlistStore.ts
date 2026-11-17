import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Playlist } from '@/types/playlist';
import type { Song } from '@/types/song';
import { addSongRefs, cleanPlaylistName, removeSongRef } from '@/utils/playlist';
import { rematchSongList } from '@/utils/songList';

type PlaylistState = {
  /** Newest first. */
  playlists: Playlist[];
  /** `true` once the saved playlists were read from the phone (or reading failed). */
  isHydrated: boolean;
  /** Creates an empty playlist and returns its id. Check the name first (utils/playlist). */
  createPlaylist: (name: string) => string;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  /** Adds songs at the end; songs already in the playlist are skipped. */
  addSongs: (id: string, songs: readonly Song[]) => void;
  removeSong: (id: string, songId: string) => void;
  /** Moves songs to their new id when their MediaStore id changed (see utils/songKey). */
  rematch: (songs: readonly Song[]) => void;
};

/** A unique id, e.g. "m3x9k2-4fz81a": time + a random part. */
function newPlaylistId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Saved on the phone (AsyncStorage), so playlists survive an app restart.
export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => {
      /** Replaces one playlist with `change(playlist)`. */
      function update(id: string, change: (playlist: Playlist) => Playlist) {
        set({ playlists: get().playlists.map((playlist) => (playlist.id === id ? change(playlist) : playlist)) });
      }

      return {
        playlists: [],
        isHydrated: false,

        createPlaylist: (name) => {
          const id = newPlaylistId();
          const playlist: Playlist = { id, name: cleanPlaylistName(name), createdAt: Date.now(), songs: [] };
          set({ playlists: [playlist, ...get().playlists] });
          return id;
        },

        renamePlaylist: (id, name) => update(id, (playlist) => ({ ...playlist, name: cleanPlaylistName(name) })),

        deletePlaylist: (id) => set({ playlists: get().playlists.filter((playlist) => playlist.id !== id) }),

        addSongs: (id, songs) => update(id, (playlist) => ({ ...playlist, songs: addSongRefs(playlist.songs, songs) })),

        removeSong: (id, songId) =>
          update(id, (playlist) => ({ ...playlist, songs: removeSongRef(playlist.songs, songId) })),

        rematch: (songs) => {
          const playlists = get().playlists;
          let changed = false;
          const rematched = playlists.map((playlist) => {
            const list = rematchSongList(playlist.songs, songs);
            if (list === playlist.songs) return playlist;
            changed = true;
            return { ...playlist, songs: list };
          });
          if (changed) set({ playlists: rematched });
        },
      };
    },
    {
      name: 'playlists',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ playlists: state.playlists }),
      // Runs when reading is done, also after an error (the app then starts with no playlists).
      onRehydrateStorage: () => () => {
        usePlaylistStore.setState({ isHydrated: true });
      },
    },
  ),
);
