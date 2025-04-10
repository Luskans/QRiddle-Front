import { Stack } from "expo-router";

export default function GameLayout() {
  return (
    <Stack>
      <Stack.Screen name="active" options={{ headerShown: false }} />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerBackTitle: 'Quit'
        }} 
      />
    </Stack>
  );
}