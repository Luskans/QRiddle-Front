import React, { useCallback, useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import colors from '@/constants/colors';
import { useThemeStore } from '@/stores/useThemeStore';
import Constants from 'expo-constants';
import { HEADER_HEIGHT } from '@/constants/constants';
import { useFocusEffect } from 'expo-router';

const statusBarHeight = Constants.statusBarHeight;

type Props = {
  children: React.ReactNode;
};

export default function PrimaryLayout({ children }: Props) {
  const [statusBarColor, setStatusBarColor] = useState<StatusBarStyle>('dark');
  const [statusBarBackground, setStatusBarBackground] = useState<string>('transparent');
  const { isDark, setIsPrimaryLayout } = useThemeStore();

  useFocusEffect(
    useCallback(() => {
      setIsPrimaryLayout(true);
    }, [setIsPrimaryLayout])
  );

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY >= HEADER_HEIGHT - statusBarHeight - 40) {
      setStatusBarColor(isDark ? 'dark' : 'light');
      setStatusBarBackground(isDark ? colors.primary.lighter : colors.primary.darker);
    } else {
      setStatusBarColor('dark');
      setStatusBarBackground('transparent');
    }
  };
  
  return (
    <View className='flex-1'>
      <StatusBar style={ statusBarColor } backgroundColor={ statusBarBackground } />
 
      <Image
        source={require('@/assets/images/background.webp')}
        className='absolute top-0 left-0 right-0 w-full'
        style={{ height: HEADER_HEIGHT }}
        resizeMode="cover"
      />
      
      <ScrollView 
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT, flexGrow: 1 }}
        className='flex-1 bg-transparent'
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View className='flex-1 bg-white dark:bg-dark rounded-t-[40px] -mt-10'>
          {children}
        </View>
      </ScrollView>
    </View>
  );
};