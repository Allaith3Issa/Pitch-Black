import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AboutSection from '@/features/settings/AboutSection';
import AppearanceSection from '@/features/settings/AppearanceSection';
import CoversSection from '@/features/settings/CoversSection';
import LibrarySection from '@/features/settings/LibrarySection';
import PlaybackSection from '@/features/settings/PlaybackSection';
import SettingsHeader from '@/features/settings/SettingsHeader';
import { spacing } from '@/theme';

// Screen 12 (Figma 12d + 12b).
export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <SettingsHeader />
        <AppearanceSection />
        <LibrarySection />
        <PlaybackSection />
        <CoversSection />
        <AboutSection />
      </ScrollView>
    </SafeAreaView>
  );
}

// The background comes from the navigator (theme-aware), see src/app/_layout.tsx.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },
});
