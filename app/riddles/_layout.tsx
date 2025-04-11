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
      <Stack.Screen
        name="[id]"
        options={{ 
          title: ''
        }}
      />
      <Stack.Screen
        name="create"
        options={{ 
          title: 'Nouvelle énigme'
        }}
      />
    </Stack>
  );
}