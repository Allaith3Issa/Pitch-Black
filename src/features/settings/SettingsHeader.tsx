import { Text, View } from 'react-native';

import { makeStyles, screenPadding, spacing, typography } from '@/theme';

/** "Settings" title + a note that more settings are coming. */
export default function SettingsHeader() {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.note}>More settings are coming in a later update.</Text>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
  },
  note: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
}));
