import { useThemeStore } from '@/stores/useThemeStore';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';


export const ThemeProvider = ({ children }: { children: React.ReactNode}) => {
  const { isDark, isPrimaryLayout } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  // let areaBackground = isPrimaryLayout ? 'transparent' : (isDark ? colors.primary.lighter : colors.primary.darker);
  let areaBackground = isDark ? colors.primary.lighter : colors.primary.darker;

  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''}`} >
      {/* {isPrimaryLayout ? ( 
        children
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: areaBackground }} >
          {children}
        </SafeAreaView>
      )} */}
      {children}
    </View>
  );
};
// TODO: des fois il y a besoin de la safeArea, des fois non ...