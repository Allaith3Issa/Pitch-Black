import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import IconButton from '@/components/IconButton';
import SearchInput from '@/components/SearchInput';
import { useTheme } from '@/hooks/useTheme';
import { iconSizes, screenPadding, spacing } from '@/theme';

type SearchHeaderProps = {
  query: string;
  onChangeQuery: (text: string) => void;
};

/** Back button + search input (design screen 05). */
export default function SearchHeader({ query, onChangeQuery }: SearchHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <IconButton
        icon={<ChevronLeft color={colors.text} size={iconSizes.md} />}
        accessibilityLabel="Back"
        onPress={() => router.back()}
      />
      <SearchInput value={query} onChangeText={onChangeQuery} placeholder="Search songs" autoFocus />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingLeft: spacing.xs,
    paddingRight: screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
});
