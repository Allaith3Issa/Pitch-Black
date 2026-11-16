import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { makeStyles, spacing, typography } from '@/theme';

type StateMessageProps = {
  title: string;
  description?: string;
  /** Extra small text under the description (e.g. the original error in development). */
  detail?: string | null;
  /** Optional action under the text, e.g. a "Try again" button. */
  action?: ReactNode;
};

/** Centered message for empty / error states. */
export default function StateMessage({ title, description, detail, action }: StateMessageProps) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      {action}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
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
  detail: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
}));
