import { useThemeStore } from '@/stores/useThemeStore';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';


export const ThemeProvider = ({ children }: { children: React.ReactNode}) => {
  const { isDark } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''}`} >
      {children}
    </View>
  );
};
