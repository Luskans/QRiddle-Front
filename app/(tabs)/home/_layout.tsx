import { useThemeStore } from '@/stores/useThemeStore';
import { Stack } from 'expo-router';
import colors from "@/constants/colors";

export default function HomeLayout() {
  const { isDark } = useThemeStore();

  return (
    // <Stack
    //   screenOptions={{
    //     contentStyle: { backgroundColor: 'transparent' },
    //     headerStyle: { backgroundColor: 'transparent' },
    //     headerShadowVisible: false,
    //     headerTintColor: isDark ? colors.light : colors.dark,
    //     animation: 'slide_from_right'
    //   }}
    // >
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Accueil",
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="notifications" 
        options={{ 
          title: "Notifications"
        }} 
      />
      <Stack.Screen 
        name="leaderboard" 
        options={{ 
          title: "Classement"
        }} 
      />
    </Stack>
  );
}