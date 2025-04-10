import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from "expo-font";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useThemeStore } from "@/stores/useThemeStore";
import useAuthRedirection from "@/hooks/useAuthRedirection";
import { useAssets } from "expo-asset";

// Show splashscreen during assets and fonts loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  // Pour les conditions de colors pour le dark theme
  const { isDark } = useThemeStore();

  // Load fonts
  const [fontsLoading] = useFonts({
    'Abel': require('@/assets/fonts/Abel-Regular.ttf'),
    'Cabin': require('@/assets/fonts/Cabin-Variable.ttf'),
    'Lexend': require('@/assets/fonts/Lexend-Variable.ttf'),
    'Mulish': require('@/assets/fonts/Mulish-Variable.ttf'),
    'Nunito': require('@/assets/fonts/Nunito-Variable.ttf'),
    'Playfair': require('@/assets/fonts/Playfair-Variable.ttf'),
  });

  // Load assets
  const [assetsLoading] = useAssets([require('@/assets/images/logo1.png'), require('@/assets/images/test6.png')]);

  // Use auth redirection for all the app
  useAuthRedirection();

  useEffect(() => {
    if (fontsLoading || assetsLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoading, assetsLoading]);


  return (
    <ThemeProvider>
      <StatusBar style="auto" backgroundColor="transparent" translucent />
      <Stack
        screenOptions={{
          headerShown: false,
          // contentStyle: { backgroundColor: 'transparent' },
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="game" />
        <Stack.Screen name="riddles" />
        <Stack.Screen name="auth" />
      </Stack>
    </ThemeProvider>
  );
}