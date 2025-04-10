import { useThemeStore } from '@/stores/useThemeStore';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  const { isDark } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''} dark:bg-dark bg-light`}>
      {children}
    </View>
  );
};