import { Text, View } from 'react-native';

import AccentSwatch from '@/components/AccentSwatch';
import SectionLabel from '@/components/SectionLabel';
import SegmentedControl, { type Segment } from '@/components/SegmentedControl';
import SettingsCard from '@/components/SettingsCard';
import { useSettingsStore } from '@/store/settingsStore';
import { makeStyles, spacing, typography } from '@/theme';
import { ACCENTS, accentColors } from '@/theme/palettes';
import type { Accent, ThemeMode } from '@/types/theme';

const THEME_SEGMENTS: readonly Segment<ThemeMode>[] = [
  { value: 'system', label: 'System' },
  { value: 'oled', label: 'OLED' },
  { value: 'light', label: 'Light' },
];

const ACCENT_LABELS: Record<Accent, string> = {
  purple: 'Purple',
  blue: 'Blue',
  green: 'Green',
  orange: 'Orange',
  pink: 'Pink',
  red: 'Red',
};

/** Settings: APPEARANCE section (Figma "12d"), theme and accent color. Changes apply right away. */
export default function AppearanceSection() {
  const styles = useStyles();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const accent = useSettingsStore((state) => state.accent);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const setAccent = useSettingsStore((state) => state.setAccent);

  return (
    <View>
      <SectionLabel label="Appearance" />
      <SettingsCard style={styles.card}>
        <Text style={styles.label}>Theme</Text>
        <SegmentedControl segments={THEME_SEGMENTS} value={themeMode} onChange={setThemeMode} />

        <Text style={[styles.label, styles.accentLabel]}>Accent color</Text>
        <View style={styles.swatches} accessibilityRole="radiogroup">
          {ACCENTS.map((item) => (
            <AccentSwatch
              key={item}
              color={accentColors[item].primary}
              label={`${ACCENT_LABELS[item]} accent`}
              selected={item === accent}
              onPress={() => setAccent(item)}
            />
          ))}
        </View>
      </SettingsCard>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  card: {
    padding: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  accentLabel: {
    marginTop: spacing.xl,
  },
  swatches: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
