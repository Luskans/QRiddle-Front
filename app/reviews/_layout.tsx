import React from 'react';
import { Stack } from 'expo-router';

export default function ReviewsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'Spectral' }
      }}
    >
      <Stack.Screen
        name="riddle/[riddleId]"
        options={{ 
          title: 'Avis'
        }}
      />
    </Stack>
  );
}