import { ArrowDown, ArrowUp, Clock, Music, TrendingUp } from 'lucide-react-native';
import { View } from 'react-native';

import BottomSheet from '@/components/BottomSheet';
import SectionLabel from '@/components/SectionLabel';
import SheetOption from '@/components/SheetOption';
import { useSettingsStore } from '@/store/settingsStore';
import { makeStyles, sizes, spacing } from '@/theme';

type SortSheetProps = {
  visible: boolean;
  onClose: () => void;
};

/** Sort sheet (design screen 03). The list re-sorts as soon as an option is tapped. */
export default function SortSheet({ visible, onClose }: SortSheetProps) {
  const styles = useStyles();
  const sortBy = useSettingsStore((state) => state.sortBy);
  const sortOrder = useSettingsStore((state) => state.sortOrder);
  const setSortBy = useSettingsStore((state) => state.setSortBy);
  const setSortOrder = useSettingsStore((state) => state.setSortOrder);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <SectionLabel label="Sort by" />
      <SheetOption label="Name" icon={Music} selected={sortBy === 'name'} onPress={() => setSortBy('name')} />
      <SheetOption
        label="Date added"
        icon={Clock}
        selected={sortBy === 'dateAdded'}
        onPress={() => setSortBy('dateAdded')}
      />
      <SheetOption
        label="Most played"
        icon={TrendingUp}
        selected={sortBy === 'mostPlayed'}
        onPress={() => setSortBy('mostPlayed')}
      />

      <View style={styles.divider} />

      <SectionLabel label="Order" />
      <SheetOption
        label="Ascending"
        icon={ArrowUp}
        selected={sortOrder === 'asc'}
        onPress={() => setSortOrder('asc')}
      />
      <SheetOption
        label="Descending"
        icon={ArrowDown}
        selected={sortOrder === 'desc'}
        onPress={() => setSortOrder('desc')}
      />
    </BottomSheet>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  divider: {
    height: sizes.hairline,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
}));
