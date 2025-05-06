import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useFonts } from "expo-font";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useThemeStore } from "@/stores/useThemeStore";
import useAuthRedirection from "@/hooks/useAuthRedirection";
import { useAssets } from "expo-asset";
import { useAuthStore } from "@/stores/useAuthStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isDark } = useThemeStore();
  const initialize = useAuthStore(state => state.initialize);
  const isLoading = useAuthStore(state => state.isLoading);
  const [isAppReady, setIsAppReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'Abel': require('@/assets/fonts/Abel-Regular.ttf'),
    'Cabin': require('@/assets/fonts/Cabin-Variable.ttf'),
    'Lexend': require('@/assets/fonts/Lexend-Variable.ttf'),
    'Mulish': require('@/assets/fonts/Mulish-Variable.ttf'),
    'Nunito': require('@/assets/fonts/Nunito-Variable.ttf'),
    'Playfair': require('@/assets/fonts/Playfair-Variable.ttf'),
  });
  const [assetsLoaded] = useAssets([
    require('@/assets/images/logo1.png'),
    require('@/assets/images/test6.png')
  ]);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (fontsLoaded && assetsLoaded && !isLoading) {
      setIsAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, assetsLoaded, isLoading]);
  
  useAuthRedirection(isAppReady);

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          // contentStyle: { backgroundColor: 'transparent' },
          // animation: 'slide_from_right'
        }}
      >
        {/* <Stack.Screen name="index" /> */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        {/* <Stack.Screen name="game-sessions" />
        <Stack.Screen name="hints" />
        <Stack.Screen name="leaderboards" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="reviews" />
        <Stack.Screen name="riddles" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="steps" />
        <Stack.Screen name="users" /> */}
        <Stack.Screen name="users/me" />
      </Stack>
    </ThemeProvider>
  );
}