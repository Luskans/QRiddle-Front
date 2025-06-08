import React from 'react';
import { Stack } from 'expo-router';


export default function StepsLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'Spectral' }
      }}
    >
      <Stack.Screen
        name="riddles/[riddleId]/create"
        options={{ 
          title: 'Nouvelle étape'
        }}
      />
      <Stack.Screen
        name="[stepId]"
        options={{ 
          title: ''
        }}
      />
    </Stack>
  );
}