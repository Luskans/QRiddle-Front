import React from 'react';
import { Stack } from 'expo-router';

export default function HintsLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'Spectral' }
      }}
    >
      <Stack.Screen
        name="steps/[stepId]/create"
        options={{ 
          title: 'Nouvel indice'
        }}
      />
    </Stack>
  );
}