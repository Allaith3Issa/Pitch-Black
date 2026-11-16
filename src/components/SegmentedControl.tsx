import { Pressable, Text, View } from 'react-native';

import { fonts, makeStyles, radius, sizes, spacing, typography } from '@/theme';

export type Segment<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  segments: readonly Segment<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** A row of equal buttons where exactly one is selected (e.g. System | OLED | Light). */
export default function SegmentedControl<T extends string>({ segments, value, onChange }: SegmentedControlProps<T>) {
  const styles = useStyles();

  return (
    <View style={styles.track} accessibilityRole="radiogroup">
      {segments.map((segment) => {
        const selected = segment.value === value;
        return (
          <Pressable
            key={segment.value}
            onPress={() => onChange(segment.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{segment.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  track: {
    height: sizes.segmentedControl,
    flexDirection: 'row',
    padding: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.surface2,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  segmentSelected: {
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
  labelSelected: {
    fontFamily: fonts.semiBold,
    color: colors.onPrimary,
  },
}));
