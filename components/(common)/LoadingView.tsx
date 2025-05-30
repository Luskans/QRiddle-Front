import { ActivityIndicator, View } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from "@/constants/colors";
import { memo } from 'react';


export default function LoadingView() {
    const { isDark } = useThemeStore();

    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
      </View>
    );
}