import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type StateMessageProps = {
  title: string;
  description?: string;
  /** Optional action under the text, e.g. a "Try again" button. */
  action?: ReactNode;
};

/** Centered message for empty / error states. */
export default function StateMessage({ title, description, action }: StateMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  title: {
    ...typography.itemTitle,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
