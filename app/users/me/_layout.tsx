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
import { SafeAreaView } from "react-native-safe-area-context";


export default function RootLayout() {
  const { isDark } = useThemeStore();

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <Stack
      screenOptions={{
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen
        name="riddles/created"
        options={{ 
          title: 'Mes énigmes créées',
        }}
      />
      <Stack.Screen
        name="played-sessions"
        options={{ 
          title: 'Mes énigmes jouées',
        }}
      />
    </Stack>
    </SafeAreaView>
  );
}