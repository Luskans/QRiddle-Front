import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '@/stores/useThemeStore';


export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`p-2 rounded-full ${isDark ? 'bg-gray-darker' : 'bg-gray-200'}`}
    >
      <Ionicons
        name={isDark ? 'moon' : 'sunny'}
        size={24}
        color={isDark ? '#FDB813' : '#FF8C00'}
      />
    </TouchableOpacity>
  );
};