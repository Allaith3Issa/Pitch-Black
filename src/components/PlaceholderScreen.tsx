import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { makeStyles, spacing, typography } from '@/theme';

type PlaceholderScreenProps = {
  title: string;
  children?: ReactNode;
};

// Temporary screen body used until each screen is built in its own step.
export default function PlaceholderScreen({ title, children }: PlaceholderScreenProps) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    backgroundColor: colors.bg,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
  },
}));
