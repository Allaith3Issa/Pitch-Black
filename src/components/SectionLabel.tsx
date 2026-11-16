import { Text } from 'react-native';

import { fonts, letterSpacing, makeStyles, screenPadding, spacing, typography } from '@/theme';

type SectionLabelProps = {
  label: string;
};

/** Small uppercase label above a group of options, e.g. "SORT BY". */
export default function SectionLabel({ label }: SectionLabelProps) {
  const styles = useStyles();
  return <Text style={styles.label}>{label.toUpperCase()}</Text>;
}

const useStyles = makeStyles(({ colors }) => ({
  label: {
    ...typography.caption,
    fontFamily: fonts.semiBold,
    letterSpacing: letterSpacing.label,
    color: colors.textSecondary,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
}));
