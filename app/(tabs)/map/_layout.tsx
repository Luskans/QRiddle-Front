import { Stack } from 'expo-router';

export default function MapLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Carte",
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: "Détails du jeu"
        }} 
      />
    </Stack>
  );
}