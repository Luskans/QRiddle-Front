import GhostButton from '@/components/(common)/GhostButton';
import { ThemeToggle } from '@/components/(common)/ThemeToggle';
import PrimaryLayout from '@/components/(layouts)/PrimaryLayout';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  const { isDark } = useThemeStore();
  const { logout } = useAuthStore();
  // TODO : fetch les infos users de authstore, mettre les formulaires d'update
  
  return (
    <PrimaryLayout>
      <View className='py-20 px-6 gap-10'>
        <Text className='text-green-400 dark:text-blue-400'>Page Profil avec: photo, membre depuis, badges, statistiques?, pages, deconnexion </Text>
        <ThemeToggle />
        <GhostButton 
          title="Déconnexion" 
          color={isDark ? 'border-secondary-lighter' : 'border-secondary-darker'} 
          textColor={isDark ? 'text-secondary-lighter' : 'text-secondary-darker'} 
          onPress={() => {logout()}}
        />
      </View>
    </PrimaryLayout>
  );
}