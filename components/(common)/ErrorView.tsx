import { View, Text } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import { router } from 'expo-router';
import GhostButton from './GhostButton';
import { memo } from 'react';


export default function ErrorView({ error }: { error: string }) {
    const { isDark } = useThemeStore();

    return (
      <View className='flex-1 h-full px-6 justify-center items-center gap-10'>
        <Text className='text-dark dark:text-light'>{error}</Text>

        <GhostButton
          onPress={() => router.dismissAll()}
          title="Accueil"
          color={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
          textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'}
        />
      </View>
    );
}