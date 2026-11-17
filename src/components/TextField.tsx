import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { makeStyles, radius, sizes, spacing, typography } from '@/theme';
import { withArabicFont } from '@/theme/withArabicFont';

type TextFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  accessibilityLabel: string;
  autoFocus?: boolean;
  maxLength?: number;
  /** Shown under the field, e.g. "A playlist with this name already exists". */
  error?: string | null;
  onSubmitEditing?: () => void;
};

/** Text input (DESIGN.md "TextInput"): gray field, accent border when focused. */
export default function TextField({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  autoFocus = false,
  maxLength,
  error = null,
  onSubmitEditing,
}: TextFieldProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <TextInput
        style={withArabicFont(value, [styles.input, isFocused && styles.focused])}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.primaryText}
        cursorColor={colors.primaryText}
        accessibilityLabel={accessibilityLabel}
        autoFocus={autoFocus}
        maxLength={maxLength}
        returnKeyType="done"
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error !== null && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  wrap: {
    gap: spacing.sm,
  },
  input: {
    ...typography.body,
    height: sizes.input,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface2,
    color: colors.text,
    // Same width when focused, so the text does not move.
    borderWidth: sizes.focusBorder,
    borderColor: colors.surface2,
  },
  focused: {
    borderColor: colors.primary,
  },
  error: {
    ...typography.caption,
    color: colors.primaryText,
  },
}));
