import { Tabs } from 'expo-router/js-tabs';
import { Heart, ListMusic, type LucideIcon, Music, Settings } from 'lucide-react-native';
import type { ColorValue } from 'react-native';

import TabBar from '@/components/TabBar';
import { colors, iconStrokes } from '@/theme';

type TabIconProps = { focused: boolean; color: ColorValue; size: number };

/** Tab icon: the active tab uses a bolder line. */
function tabIcon(Icon: LucideIcon) {
  function TabIcon({ focused, color, size }: TabIconProps) {
    return <Icon color={color} size={size} strokeWidth={focused ? iconStrokes.bold : iconStrokes.regular} />;
  }
  return TabIcon;
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Songs', tabBarIcon: tabIcon(Music) }} />
      <Tabs.Screen name="playlists" options={{ title: 'Playlists', tabBarIcon: tabIcon(ListMusic) }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites', tabBarIcon: tabIcon(Heart) }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: tabIcon(Settings) }} />
    </Tabs>
  );
}
