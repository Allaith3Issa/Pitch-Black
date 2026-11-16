import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppearanceSection from '@/features/settings/AppearanceSection';
import SettingsHeader from '@/features/settings/SettingsHeader';

// Screen 12. Only APPEARANCE for now; the other sections come in Step 8.
export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView>
        <SettingsHeader />
        <AppearanceSection />
      </ScrollView>
    </SafeAreaView>
  );
}

// The background comes from the navigator (theme-aware), see src/app/_layout.tsx.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
