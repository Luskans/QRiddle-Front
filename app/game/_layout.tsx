import React from 'react';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';


export default function GameLayout() {
  const { isDark } = useThemeStore();

  const HomeButton = () => (
    <TouchableOpacity className='mr-10' onPress={() => router.navigate('/(tabs)')}>
      <Ionicons name="home-sharp" size={22} color={isDark ? colors.dark : colors.light} />
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'Spectral' }
      }}
    >
      <Stack.Screen
        name="[sessionId]"
        options={{ 
          title: "Partie en cours",
          headerLeft: () => <HomeButton />
        }}
      />
      <Stack.Screen
        name="[sessionId]/scan"
        options={{ 
          title: "Scannez le QR code"
        }}
      />
      <Stack.Screen
        name="[sessionId]/complete"
        options={{ 
          title: 'Partie terminée',
          headerLeft: () => <HomeButton />
        }}
      />
    </Stack>
  );
}