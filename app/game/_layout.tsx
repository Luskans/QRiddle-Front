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
        name="[sessionId]/scan"
        options={{ 
          title: "Scannez le QR code"
        }}
      />
      <Stack.Screen
        name="[sessionId]/complete"
        options={{ 
          title: 'Partie terminée'
        }}
      />
    </Stack>
  );
}