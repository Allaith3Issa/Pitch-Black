import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { makeStyles, radius, sizes, spacing, typography } from '@/theme';

type DialogProps = {
  visible: boolean;
  /** Called when the user taps the scrim or presses the Android back button. */
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/** Centered dialog (DESIGN.md: width 312, `surface`, radius 24) with a dark scrim behind it. */
export default function Dialog({ visible, onClose, title, children }: DialogProps) {
  const styles = useStyles();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      {/* Moves the dialog up when the keyboard opens. */}
      <KeyboardAvoidingView style={styles.center} behavior="height">
        <Pressable style={[StyleSheet.absoluteFill, styles.scrim]} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.title}>{title}</Text>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  scrim: {
    backgroundColor: colors.scrim,
  },
  card: {
    width: '100%',
    maxWidth: sizes.dialog,
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: sizes.hairline,
    borderColor: colors.border,
  },
  title: {
    ...typography.dialogTitle,
    color: colors.text,
  },
}));
