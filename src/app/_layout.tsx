import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { useLibraryStartup } from '@/hooks/useLibraryStartup';
import { colors } from '@/theme';

// Keep the splash screen visible until the fonts and the first permission check are ready.
SplashScreen.preventAutoHideAsync();

// Black root view, so there is no white flash behind screens.
SystemUI.setBackgroundColorAsync(colors.bg);

// React Navigation theme with our OLED colors (used by headers and the navigation container).
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
  },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { isPermissionChecked, canEnterApp } = useLibraryStartup();

  // If the fonts fail to load we still open the app (with the system font) instead of hanging.
  const fontsReady = fontsLoaded || fontError !== null;
  const isReady = fontsReady && isPermissionChecked;

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
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        {/* The app: only after access is granted or the user tapped "Not now". */}
        <Stack.Protected guard={canEnterApp}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="search" />
          <Stack.Screen name="player" options={{ presentation: 'modal' }} />
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
