import { StyleSheet, Text } from 'react-native';

import { colors, fonts, letterSpacing, screenPadding, spacing, typography } from '@/theme';

type SectionLabelProps = {
  label: string;
};

/** Small uppercase label above a group of options, e.g. "SORT BY". */
export default function SectionLabel({ label }: SectionLabelProps) {
  return <Text style={styles.label}>{label.toUpperCase()}</Text>;
}

const styles = StyleSheet.create({
  label: {
    ...typography.caption,
    fontFamily: fonts.semiBold,
    letterSpacing: letterSpacing.label,
    color: colors.textSecondary,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
