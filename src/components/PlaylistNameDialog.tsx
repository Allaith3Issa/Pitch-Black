import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import TextField from '@/components/TextField';
import { usePlaylistStore } from '@/store/playlistStore';
import { spacing } from '@/theme';
import { checkPlaylistName, cleanPlaylistName, MAX_PLAYLIST_NAME_LENGTH } from '@/utils/playlist';

type PlaylistNameDialogProps = {
  visible: boolean;
  /** "New playlist" or "Rename playlist". */
  title: string;
  /** "Create" or "Save". */
  submitLabel: string;
  /** The name in the field when the dialog opens. */
  initialName: string;
  /** When renaming: the playlist itself, so its own name does not count as "already exists". */
  playlistId?: string;
  onClose: () => void;
  /** Called with the cleaned, checked name. */
  onSubmit: (name: string) => void;
};

/** Dialog with a playlist name field (design screen 08). Names must be unique (case and spaces ignored). */
export default function PlaylistNameDialog({
  visible,
  title,
  submitLabel,
  initialName,
  playlistId,
  onClose,
  onSubmit,
}: PlaylistNameDialogProps) {
  const playlists = usePlaylistStore((state) => state.playlists);
  const [name, setName] = useState(initialName);

  // Start with `initialName` each time the dialog opens (React's pattern for "reset on prop change").
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setName(initialName);
  }

  const otherNames = useMemo(
    () => playlists.filter((playlist) => playlist.id !== playlistId).map((playlist) => playlist.name),
    [playlists, playlistId],
  );
  // Only while open: right after "Create" the new name is already saved, and the fading dialog must not
  // show "already exists" for it.
  const check = visible ? checkPlaylistName(name, otherNames) : { isValid: false, error: null };

  const submit = () => {
    if (check.isValid) onSubmit(cleanPlaylistName(name));
  };

  return (
    <Dialog visible={visible} onClose={onClose} title={title}>
      <TextField
        value={name}
        onChangeText={setName}
        placeholder="Playlist name"
        accessibilityLabel="Playlist name"
        autoFocus
        maxLength={MAX_PLAYLIST_NAME_LENGTH}
        error={check.error}
        onSubmitEditing={submit}
      />
      <View style={styles.buttons}>
        <Button label="Cancel" variant="secondary" onPress={onClose} style={styles.button} />
        <Button label={submitLabel} onPress={submit} disabled={!check.isValid} style={styles.button} />
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});
