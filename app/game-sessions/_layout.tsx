import React from 'react';
import { Stack } from 'expo-router';

export default function RiddleLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      {/* <Stack.Screen
        name="[sessionId]"
        options={{ 
          title: "Détail de l'énigme"
        }}
      />
      <Stack.Screen
        name="[sessionId]/complete"
        options={{ 
          title: 'Laisser un avis'
        }}
      /> */}
    </Stack>
  );
}