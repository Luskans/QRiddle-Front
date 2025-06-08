import React from 'react';
import { Stack } from 'expo-router';


export default function RiddlesLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'Spectral' }
      }}
    >
      <Stack.Screen
        name="[riddleId]"
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