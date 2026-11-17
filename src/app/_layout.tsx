import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useLibraryStartup } from '@/hooks/useLibraryStartup';
import { useNavigationTheme } from '@/hooks/useNavigationTheme';
import { usePlayerErrorToast } from '@/hooks/usePlayerErrorToast';
import { useSavedDataRematch } from '@/hooks/useSavedDataRematch';
import { useSystemUiTheme } from '@/hooks/useSystemUiTheme';
import { useTheme } from '@/hooks/useTheme';
import { configureAudio } from '@/services/audioPlayer';
import { useFavoritesStore } from '@/store/favoritesStore';
import { usePlayCountStore } from '@/store/playCountStore';
import { usePlaylistStore } from '@/store/playlistStore';
import { useSettingsStore } from '@/store/settingsStore';

// Keep the splash screen visible until the fonts, the saved data (settings, play counts, favorites, playlists)
// and the first permission check are ready.
SplashScreen.preventAutoHideAsync();

// Play on silent mode and pause when another app takes the audio (see services/audioPlayer).
// If it fails, playback still works with the default audio mode.
configureAudio().catch(() => undefined);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { isPermissionChecked, canEnterApp } = useLibraryStartup();
  usePlayerErrorToast();
  useSavedDataRematch();
  // The theme (OLED / Light + accent) for system bars, the root view and the navigators.
  useSystemUiTheme();
  const { colors, isDark } = useTheme();
  const navigationTheme = useNavigationTheme();
  // Wait for the saved sort, so the list does not show A–Z first and then jump.
  const isSettingsReady = useSettingsStore((state) => state.isHydrated);
  // Wait for the saved play counts too, so "Most played" is right from the first frame.
  const isPlayCountReady = usePlayCountStore((state) => state.isHydrated);
  // And for favorites and playlists, so their lists never flash empty.
  const isFavoritesReady = useFavoritesStore((state) => state.isHydrated);
  const isPlaylistsReady = usePlaylistStore((state) => state.isHydrated);

  // If the fonts fail to load we still open the app (with the system font) instead of hanging.
  const fontsReady = fontsLoaded || fontError !== null;
  const isReady =
    fontsReady && isPermissionChecked && isSettingsReady && isPlayCountReady && isFavoritesReady && isPlaylistsReady;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        {/* The app: only after access is granted or the user tapped "Not now". */}
        <Stack.Protected guard={canEnterApp}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="search" />
          {/* Transparent and without the navigator's animation: Now Playing slides itself up and down
              (see hooks/useNowPlayingSheet), and the app stays visible behind it while it moves. */}
          <Stack.Screen
            name="player"
            options={{
              presentation: 'transparentModal',
              animation: 'none',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Stack.Screen name="playlist/[id]/index" />
          <Stack.Screen name="playlist/[id]/add-songs" options={{ presentation: 'modal' }} />
        </Stack.Protected>

        <Stack.Protected guard={!canEnterApp}>
          <Stack.Screen name="permission" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
