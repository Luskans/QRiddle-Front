import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Profil",
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Paramètres"
        }} 
      />
      <Stack.Screen 
        name="history" 
        options={{ 
          title: "Historique"
        }} 
      />
    </Stack>
  );
}