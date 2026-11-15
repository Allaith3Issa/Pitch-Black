import { Folder, Music } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import { useAllowAccess } from '@/hooks/useAllowAccess';
import { useLibraryStore } from '@/store/libraryStore';
import { colors, fonts, iconSizes, radius, sizes, spacing, typography } from '@/theme';

// Design screen 01. When access is granted (or skipped), the root layout's guard moves us to the tabs.
export default function PermissionView() {
  const skipPermission = useLibraryStore((state) => state.skipPermission);
  const allowAccess = useAllowAccess('Allow access');

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.illustration}>
        <Music color={colors.text} size={iconSizes.hero} />
      </View>

      <Text style={styles.label}>B4F PLAYER</Text>
      <Text style={styles.title}>Access your music</Text>
      <Text style={styles.body}>
        B4F Player needs permission to read the audio files on your device so you can play them offline.
      </Text>

      <Button
        label={allowAccess.label}
        icon={Folder}
        onPress={allowAccess.onPress}
        style={styles.allowButton}
      />
      <Button label="Not now" variant="text" onPress={skipPermission} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.bg,
  },
  illustration: {
    width: sizes.illustration,
    height: sizes.illustration,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  label: {
    ...typography.caption,
    fontFamily: fonts.semiBold,
    color: colors.textTertiary,
    // Section labels use ~10% letter spacing (DESIGN.md).
    letterSpacing: typography.caption.fontSize * 0.1,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.heroTitle,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  body: {
    ...typography.body,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  allowButton: {
    alignSelf: 'stretch',
    minHeight: sizes.buttonLarge,
    marginBottom: spacing.sm,
  },
});
