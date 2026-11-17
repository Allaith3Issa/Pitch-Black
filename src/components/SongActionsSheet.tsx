import { useState } from 'react';

import AddToPlaylistView from '@/components/AddToPlaylistView';
import BottomSheet from '@/components/BottomSheet';
import SongInfoView from '@/components/SongInfoView';
import SongOptionsView from '@/components/SongOptionsView';
import type { Song } from '@/types/song';

type SongActionsSheetProps = {
  /** The song whose "⋯" was tapped, or `null` when the sheet is closed. */
  song: Song | null;
  /** Set on Playlist Detail: also offers "Remove from playlist". */
  playlistId?: string;
  onClose: () => void;
};

/**
 * The song "⋯" sheet. It has three views in the same sheet (so no second sheet opens on top):
 * the options (design screen 04), "Add to playlist" (design screen 13) and "Song info".
 */
export default function SongActionsSheet({ song, playlistId, onClose }: SongActionsSheetProps) {
  const isOpen = song !== null;
  // Keeps the song on screen while the sheet slides down (`song` is already `null` then).
  const [shownSong, setShownSong] = useState<Song | null>(song);
  const [view, setView] = useState<'options' | 'playlists' | 'info'>('options');

  // Each time the sheet opens: show this song's options first.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setShownSong(song);
      setView('options');
    }
  }

  return (
    <BottomSheet visible={isOpen} onClose={onClose}>
      {shownSong !== null && view === 'options' && (
        <SongOptionsView
          song={shownSong}
          playlistId={playlistId}
          onAddToPlaylist={() => setView('playlists')}
          onShowInfo={() => setView('info')}
          onClose={onClose}
        />
      )}
      {shownSong !== null && view === 'playlists' && <AddToPlaylistView song={shownSong} />}
      {shownSong !== null && view === 'info' && <SongInfoView song={shownSong} />}
    </BottomSheet>
  );
}
