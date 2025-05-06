import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '@/stores/useThemeStore';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import colors from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
};

export default function SecondaryLayoutWithoutScrollView({ children }: Props) {
  const { isDark } = useThemeStore();
  const navigation = useNavigation();
  const headerColor = isDark ? colors.primary.lighter : colors.primary.darker;

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: headerColor },
      headerTintColor: isDark ? colors.dark : colors.light,
    });
  }, [navigation]);
  
  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <View className='flex-1'>
      <StatusBar style={ isDark ? 'dark' : 'light' } backgroundColor={isDark ? colors.primary.lighter : colors.primary.darker} />
      <View className='flex-1 bg-white dark:bg-dark'>
        {children}
      </View>
    </View>
    // </SafeAreaView>
  );
};