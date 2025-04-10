import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '@/stores/useThemeStore';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import colors from '@/constants/colors';

type Props = {
  children: React.ReactNode;
};

export default function SecondaryLayout({ children }: Props) {
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
    <View className='flex-1'>
      <StatusBar style={ isDark ? 'dark' : 'light' } backgroundColor='transparent' />
      
      <ScrollView className='flex-1 bg-white dark:bg-dark'>
        {children}
      </ScrollView>
    </View>
  );
};