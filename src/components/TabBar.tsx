import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, Text, View } from 'react-native';

import MiniPlayer from '@/components/MiniPlayer';
import { useTheme } from '@/hooks/useTheme';
import { fonts, iconSizes, makeStyles, radius, sizes, spacing, typography } from '@/theme';

// Floating tab bar from DESIGN.md. Icons and labels come from each screen's options.
// The Mini Player sits right above it, so it shows on every tab.
export default function TabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + spacing.md }]}>
      <MiniPlayer />
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = index === state.index;
          const color = focused ? colors.primaryText : colors.textTertiary;
          const label = options.title ?? route.name;

          const onPress = () => {
            const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              navigateToTab(route.key);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
            >
              {options.tabBarIcon?.({ focused, color, size: iconSizes.tab })}
              <Text style={[styles.label, focused && styles.labelActive, { color }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  wrapper: {
    backgroundColor: colors.bg,
  },
  bar: {
    marginHorizontal: spacing.md,
    flexDirection: 'row',
    height: sizes.tabBar,
    backgroundColor: colors.surface,
    borderRadius: radius.tabBar,
    borderWidth: sizes.hairline,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  label: {
    ...typography.tabLabel,
  },
  labelActive: {
    fontFamily: fonts.semiBold,
  },
}));
