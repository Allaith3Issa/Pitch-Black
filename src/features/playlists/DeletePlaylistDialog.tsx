import { StyleSheet, Text, View } from 'react-native';

import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import { makeStyles, spacing, typography } from '@/theme';

type DeletePlaylistDialogProps = {
  visible: boolean;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
};

/** Asks before a playlist is deleted. The songs themselves stay on the phone. */
export default function DeletePlaylistDialog({ visible, name, onClose, onConfirm }: DeletePlaylistDialogProps) {
  const styles = useStyles();

  return (
    <Dialog visible={visible} onClose={onClose} title={`Delete "${name}"?`}>
      <Text style={styles.message}>The playlist is removed. The songs stay on your phone.</Text>
      <View style={buttonStyles.row}>
        <Button label="Cancel" variant="secondary" onPress={onClose} style={buttonStyles.button} />
        <Button label="Delete" onPress={onConfirm} style={buttonStyles.button} />
      </View>
    </Dialog>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  message: {
    ...typography.body,
    color: colors.textSecondary,
  },
}));

const buttonStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});
