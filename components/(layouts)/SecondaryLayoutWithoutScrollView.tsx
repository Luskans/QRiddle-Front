import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '@/stores/useThemeStore';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import colors from '@/constants/colors';
import { useFocusEffect } from 'expo-router';


export default function SecondaryLayoutWithoutScrollView({ children }: { children: React.ReactNode}) {
  const { isDark, setIsPrimaryLayout } = useThemeStore();
  const navigation = useNavigation();
  const headerColor = isDark ? colors.primary.lighter : colors.primary.darker;
  // TODO : utiliser useMemo

  useFocusEffect(
    useCallback(() => {
      setIsPrimaryLayout(false);
    }, [setIsPrimaryLayout])
  );

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: headerColor },
      headerTintColor: isDark ? colors.dark : colors.light,
    });
  }, [navigation]);
  
  return (
    <View className='flex-1'>
      <StatusBar style={ isDark ? 'dark' : 'light' } />
      <View className='flex-1 bg-light dark:bg-dark'>
        {children}
      </View>
    </View>
  );
};