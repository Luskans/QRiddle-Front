import "@/global.css";
import { Stack } from "expo-router";
import { useThemeStore } from "@/stores/useThemeStore";


export default function RootLayout() {
  const { isDark } = useThemeStore();

  return (
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
  );
}