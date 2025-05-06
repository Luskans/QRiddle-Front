import React from 'react';
import { View, Text } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';

export default function CreatedView() {
  const { isDark } = useThemeStore();  

  return (
    <View className='px-6 gap-6'>
      <Text>dans created view</Text>
    </View>
  );
};