import React from 'react';
import { Stack } from "expo-router";


export default function RootLayout() {

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