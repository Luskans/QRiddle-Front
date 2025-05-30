import { useEffect } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';
import { useColorScheme } from 'nativewind';


export default function useTheme() {
  const { isDark } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(isDark ? 'dark' : 'light');
  }, [isDark]);
}