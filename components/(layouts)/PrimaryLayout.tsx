import React, { useCallback, useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '@/stores/useThemeStore';
import Constants from 'expo-constants';
import { HEADER_HEIGHT } from '@/constants/constants';
import { useFocusEffect } from 'expo-router';


const statusBarHeight = Constants.statusBarHeight;

export default function PrimaryLayout({ children }: { children: React.ReactNode}) {
  const { isDark, setIsPrimaryLayout } = useThemeStore();
  const [isScrolled, setIsScrolled] = useState(false);
  // TODO : utiliser useMemo

  useFocusEffect(
    useCallback(() => {
      setIsPrimaryLayout(true);
    }, [setIsPrimaryLayout])
  );

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY >= HEADER_HEIGHT - statusBarHeight - 40);
  };
  
  return (
    <View className='flex-1'>
      <StatusBar style={isDark ? 'dark' : 'light'} />

      <View className={`absolute top-0 left-0 right-0 ${isScrolled ? (isDark ? 'bg-primary-lighter' : 'bg-primary-darker') : 'bg-transparent'}`} style={{height: statusBarHeight, zIndex: 1}}/>

      <Image
        key={isDark ? 'dark-bg' : 'light-bg'}
        source={isDark ? require('@/assets/images/background2.webp') : require('@/assets/images/background.webp')}
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
        <View className='flex-1 bg-light dark:bg-dark rounded-t-[40px] -mt-10'>
          {children}
        </View>
      </ScrollView>
    </View>
  );
};