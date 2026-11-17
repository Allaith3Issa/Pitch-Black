import { ArrowUpDown, FolderSync } from 'lucide-react-native';
import { useState } from 'react';
import { ToastAndroid, View } from 'react-native';

import SectionLabel from '@/components/SectionLabel';
import SettingsCard from '@/components/SettingsCard';
import SettingsRow from '@/components/SettingsRow';
import SortSheet from '@/features/songs/SortSheet';
import { useNow } from '@/hooks/useNow';
import { useLibraryStore } from '@/store/libraryStore';
import { useSettingsStore } from '@/store/settingsStore';
import { formatLastScan } from '@/utils/formatLastScan';
import { getSortLabel } from '@/utils/getSortLabel';
import { getRescanMessage } from '@/utils/songChanges';

const RESCAN_ERROR = 'Could not scan your music. Please try again.';
// "Last scan: today, 20:14" turns into "yesterday" after midnight without leaving the screen.
const CLOCK_INTERVAL_MS = 60_000;

/** Settings: LIBRARY section. Rescan (quiet, the song list stays) and the default sort. */
export default function LibrarySection() {
  const hasAccess = useLibraryStore((state) => state.permission === 'granted');
  const isScanning = useLibraryStore((state) => state.isRefreshing || state.status === 'loading');
  const lastScanAt = useLibraryStore((state) => state.lastScanAt);
  const rescan = useLibraryStore((state) => state.rescan);
  const sortBy = useSettingsStore((state) => state.sortBy);
  const sortOrder = useSettingsStore((state) => state.sortOrder);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const now = useNow(CLOCK_INTERVAL_MS);

  const onRescan = async () => {
    const changes = await rescan();
    ToastAndroid.show(changes ? getRescanMessage(changes) : RESCAN_ERROR, ToastAndroid.SHORT);
  };

  let rescanSubtitle: string;
  if (!hasAccess) {
    rescanSubtitle = 'No access to your music';
  } else if (isScanning) {
    rescanSubtitle = 'Scanning…';
  } else if (lastScanAt !== null) {
    rescanSubtitle = `Last scan: ${formatLastScan(lastScanAt, Math.max(now, lastScanAt))}`;
  } else {
    rescanSubtitle = 'Not scanned yet';
  }

  return (
    <View>
      <SectionLabel label="Library" />
      <SettingsCard>
        <SettingsRow
          icon={FolderSync}
          title="Rescan music library"
          subtitle={rescanSubtitle}
          onPress={onRescan}
          disabled={!hasAccess || isScanning}
        />
        <SettingsRow
          icon={ArrowUpDown}
          title="Default sort"
          value={getSortLabel(sortBy, sortOrder)}
          onPress={() => setIsSortSheetOpen(true)}
        />
      </SettingsCard>
      <SortSheet visible={isSortSheetOpen} onClose={() => setIsSortSheetOpen(false)} />
    </View>
  );
}
