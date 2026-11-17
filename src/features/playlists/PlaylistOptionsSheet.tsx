import { Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Text } from 'react-native';

import BottomSheet from '@/components/BottomSheet';
import PlaylistNameDialog from '@/components/PlaylistNameDialog';
import SheetOption from '@/components/SheetOption';
import DeletePlaylistDialog from '@/features/playlists/DeletePlaylistDialog';
import { usePlaylistStore } from '@/store/playlistStore';
import { makeStyles, spacing, typography } from '@/theme';
import type { Playlist } from '@/types/playlist';

type PlaylistOptionsSheetProps = {
  /** The playlist whose "⋯" was tapped, or `null` when the sheet is closed. */
  playlist: Playlist | null;
  onClose: () => void;
  /** Called after the playlist was deleted (Playlist Detail goes back). */
  onDeleted?: () => void;
};

/** Playlist "⋯" sheet: Rename and Delete, each with its own dialog. */
export default function PlaylistOptionsSheet({ playlist, onClose, onDeleted }: PlaylistOptionsSheetProps) {
  const styles = useStyles();
  const renamePlaylist = usePlaylistStore((state) => state.renamePlaylist);
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  // Keeps the playlist while the sheet slides down and while a dialog is open (`playlist` is `null` then).
  const [shown, setShown] = useState<Playlist | null>(playlist);
  if (playlist !== null && playlist !== shown) {
    setShown(playlist);
  }
  const [dialog, setDialog] = useState<'rename' | 'delete' | null>(null);

  const openDialog = (kind: 'rename' | 'delete') => {
    setDialog(kind);
    onClose();
  };
  const closeDialog = () => setDialog(null);

  const rename = (name: string) => {
    if (shown) renamePlaylist(shown.id, name);
    closeDialog();
  };

  const remove = () => {
    if (shown) deletePlaylist(shown.id);
    closeDialog();
    onDeleted?.();
  };

  return (
    <>
      <BottomSheet visible={playlist !== null} onClose={onClose}>
        <Text style={styles.title} numberOfLines={1}>
          {shown?.name}
        </Text>
        <SheetOption label="Rename" icon={Pencil} onPress={() => openDialog('rename')} />
        <SheetOption label="Delete playlist" icon={Trash2} onPress={() => openDialog('delete')} />
      </BottomSheet>
      <PlaylistNameDialog
        visible={dialog === 'rename'}
        title="Rename playlist"
        submitLabel="Save"
        initialName={shown?.name ?? ''}
        playlistId={shown?.id}
        onClose={closeDialog}
        onSubmit={rename}
      />
      <DeletePlaylistDialog
        visible={dialog === 'delete'}
        name={shown?.name ?? ''}
        onClose={closeDialog}
        onConfirm={remove}
      />
    </>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  title: {
    ...typography.sheetTitle,
    color: colors.text,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
}));
