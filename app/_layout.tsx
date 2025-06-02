import "@/global.css";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useFonts } from "expo-font";
import { ThemeProvider } from "@/providers/ThemeProvider";
import useAuthRedirection from "@/hooks/useAuthRedirection";
import { useAssets } from "expo-asset";
import { useAuthStore } from "@/stores/useAuthStore";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import useTheme from "@/hooks/useTheme";
import Toast from 'react-native-toast-message';
import { toastConfig } from "@/lib/toastConfig";


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
    'RubikDirt': require('@/assets/fonts/RubikDirt-Regular.ttf'),
    'Satisfy': require('@/assets/fonts/Satisfy-Regular.ttf'),
    'SyneMono': require('@/assets/fonts/SyneMono-Regular.ttf'),
  });
  const [assetsLoaded] = useAssets([
    require('@/assets/images/logo-light.png'),
    require('@/assets/images/logo-dark.png'),
    require('@/assets/images/background-light.webp'),
    require('@/assets/images/background-dark.webp'),
    require('@/assets/images/default-user.png'),
    require('@/assets/images/default-hint.jpg'),
    require('@/assets/audios/default-hint.mp3')
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
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider> */}
          <Stack screenOptions={{ headerShown: false }} />
          <Toast config={toastConfig} />
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}