import React, { useState } from 'react';
import { ScrollView, View, Image, ImageSourcePropType } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const HEADER_HEIGHT = 220;
// const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;

type ParallaxScrollViewProps = {
  children: React.ReactNode;
  headerImage: ImageSourcePropType;
};

export default function ParallaxScrollView({ children, headerImage }: ParallaxScrollViewProps) {
  const [bgColor, setBgColor] = useState<string>('transparent');

  
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Dès que le défilement atteint HEADER_HEIGHT, on fixe le fond en rouge
    if (offsetY >= HEADER_HEIGHT - 60) {
      setBgColor('#ebad7f');
    } else {
      setBgColor('transparent');
    }
  };
  
  
  return (
    <View className='flex-1'>
      <StatusBar style="auto" backgroundColor={ bgColor } />
 
      <Image
        source={headerImage}
        className='absolute top-0 left-0 right-0 w-full'
        style={{ height: HEADER_HEIGHT }}
        resizeMode="cover" />
      
      <ScrollView 
        style={{ paddingTop: HEADER_HEIGHT }}
        className='bg-transparent'
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View className='flex-1 bg-white dark:bg-dark rounded-t-[40px] -mt-10 pt-8'>
          {children}
        </View>
      </ScrollView>
    </View>
  );
};