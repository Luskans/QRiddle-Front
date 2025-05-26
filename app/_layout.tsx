import "@/global.css";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useFonts } from "expo-font";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useThemeStore } from "@/stores/useThemeStore";
import useAuthRedirection from "@/hooks/useAuthRedirection";
import { useAssets } from "expo-asset";
import { useAuthStore } from "@/stores/useAuthStore";
import colors from "@/constants/colors";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

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
    require('@/assets/images/test6.png'),
    require('@/assets/images/default-user.png')
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

  // return (
  //   <ThemeProvider>
  //     <Stack
  //       screenOptions={{
  //         headerShown: false,
  //         // contentStyle: { backgroundColor: 'transparent' },
  //         // animation: 'slide_from_right',
  //         // headerStyle: { backgroundColor: isDark ? colors.primary.lighter : colors.primary.darker },
  //         // headerTintColor: isDark ? colors.dark : colors.light,
  //       }}
  //     >
  //       <Stack.Screen
  //         name="(auth)"
  //         options={{ 
  //           // title: 'test',
  //           headerShown: false,
  //         }}
  //       />
  //       <Stack.Screen
  //         name="(tabs)"
  //         options={{ 
  //           headerShown: false,
  //         }}
  //       />
  //       {/* <Stack.Screen name="game-sessions" />
  //       <Stack.Screen name="hints" />
  //       <Stack.Screen name="leaderboards" />
  //       <Stack.Screen name="notifications" />
  //       <Stack.Screen name="reviews" />
  //       <Stack.Screen name="riddles" />
  //       <Stack.Screen name="settings" />
  //       <Stack.Screen name="steps" />
  //       <Stack.Screen name="users" /> */}
  //       {/* <Stack.Screen name="users/me" /> */}
  //     </Stack>
  //   </ThemeProvider>
  // );

  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} >
      </Stack>
    </ThemeProvider>
    </QueryClientProvider>
  );
}