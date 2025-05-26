import React from 'react';
import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="[sessionId]"
        options={{ 
          title: "Partie en cours"
        }}
      />
      <Stack.Screen
        name="steps/[stepId]"
        options={{ 
          title: "Partie en cours"
        }}
      />
      <Stack.Screen
        name="[sessionId]/complete"
        options={{ 
          title: 'Laisser un avis'
        }}
      />
    </Stack>
  );
}