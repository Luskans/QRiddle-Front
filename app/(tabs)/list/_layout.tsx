import { useThemeStore } from '@/stores/useThemeStore';
import { Stack } from 'expo-router';
import colors from "@/constants/colors";

export default function ListLayout() {
  const { isDark } = useThemeStore();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: 'transparent' },
        headerStyle: { backgroundColor: 'transparent' },
        headerShadowVisible: false,
        headerTintColor: isDark ? colors.light : colors.dark,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="index"
        options={{ 
          title: 'Énigmes',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="riddleCreate"
        options={{ 
          title: 'Nouvelle énigme',
        }}
      />
    </Stack>
  );
}