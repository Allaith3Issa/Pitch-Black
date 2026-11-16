import { Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, iconSizes, radius, sizes, spacing, typography } from '@/theme';

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoFocus?: boolean;
};

/** Search field: search icon, text input and a clear (X) button when there is text. */
export default function SearchInput({ value, onChangeText, placeholder, autoFocus = false }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.focused]}>
      <Search color={colors.textSecondary} size={iconSizes.sm} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.primaryText}
        cursorColor={colors.primaryText}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value !== '' && (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={spacing.md}
        >
          <X color={colors.textSecondary} size={iconSizes.sm} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: sizes.input,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface2,
    // Same width when focused, so the layout does not jump.
    borderWidth: sizes.focusBorder,
    borderColor: colors.surface2,
  },
  focused: {
    borderColor: colors.primary,
  },
  input: {
    ...typography.body,
    flex: 1,
    height: '100%',
    color: colors.text,
    padding: 0,
  },
});
