import React from 'react';
import { Stack } from 'expo-router';

export default function LeaderboardsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="global"
        options={{ 
          title: 'Classement'
        }}
      />
      <Stack.Screen
        name="riddle/[riddleId]"
        options={{ 
          title: 'Classement'
        }}
      />
    </Stack>
  );
}