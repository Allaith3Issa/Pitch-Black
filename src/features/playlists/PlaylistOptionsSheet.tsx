import { ImageMinus, ImagePlus, Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';

import AppText from '@/components/AppText';
import BottomSheet from '@/components/BottomSheet';
import PlaylistNameDialog from '@/components/PlaylistNameDialog';
import SheetOption from '@/components/SheetOption';
import DeletePlaylistDialog from '@/features/playlists/DeletePlaylistDialog';
import { usePlaylistCoverActions } from '@/hooks/usePlaylistCoverActions';
import { deletePlaylistCoverFile } from '@/services/playlistCover';
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

/** Playlist "⋯" sheet: Add / Change cover, Remove cover, Rename and Delete (Rename and Delete open a dialog). */
export default function PlaylistOptionsSheet({ playlist, onClose, onDeleted }: PlaylistOptionsSheetProps) {
  const styles = useStyles();
  const renamePlaylist = usePlaylistStore((state) => state.renamePlaylist);
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const { changeCover, removeCover } = usePlaylistCoverActions();
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

  // The sheet closes first, so the photo picker opens on the screen behind it.
  const onChangeCover = () => {
    onClose();
    if (shown) changeCover(shown.id);
  };

  const onRemoveCover = () => {
    onClose();
    if (shown) removeCover(shown.id);
  };

  const remove = () => {
    if (shown) {
      // Read fresh: the cover may have changed since the sheet opened.
      const cover = usePlaylistStore.getState().playlists.find((item) => item.id === shown.id)?.coverUri;
      deletePlaylist(shown.id);
      if (cover) deletePlaylistCoverFile(cover);
    }
    closeDialog();
    onDeleted?.();
  };

  return (
    <>
      <BottomSheet visible={playlist !== null} onClose={onClose}>
        <AppText style={styles.title} numberOfLines={1}>
          {shown?.name}
        </AppText>
        <SheetOption
          label={shown?.coverUri ? 'Change cover' : 'Add cover'}
          icon={ImagePlus}
          onPress={onChangeCover}
        />
        {shown?.coverUri && <SheetOption label="Remove cover" icon={ImageMinus} onPress={onRemoveCover} />}
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
