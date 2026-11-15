import { Tabs } from 'expo-router/js-tabs';
import { Heart, ListMusic, Music, SlidersHorizontal } from 'lucide-react-native';

import TabBar from '@/components/TabBar';
import { colors } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Songs', tabBarIcon: ({ color, size }) => <Music color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="playlists"
        options={{ title: 'Playlists', tabBarIcon: ({ color, size }) => <ListMusic color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="favorites"
        options={{ title: 'Favorites', tabBarIcon: ({ color, size }) => <Heart color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <SlidersHorizontal color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
