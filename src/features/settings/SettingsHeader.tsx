import { Text, View } from 'react-native';

import { makeStyles, screenPadding, spacing, typography } from '@/theme';

/** "Settings" title. */
export default function SettingsHeader() {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.sm,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
  },
}));
