import type { ReactNode } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { makeStyles, radius, screenPadding } from '@/theme';

type SettingsCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Rounded `surface` card that groups the rows of one Settings section. */
export default function SettingsCard({ children, style }: SettingsCardProps) {
  const styles = useStyles();
  return <View style={[styles.card, style]}>{children}</View>;
}

const useStyles = makeStyles(({ colors }) => ({
  card: {
    marginHorizontal: screenPadding,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
}));
