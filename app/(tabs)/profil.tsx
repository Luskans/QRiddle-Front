import GhostButton from '@/components/(common)/GhostButton';
import { ThemeToggle } from '@/components/(common)/ThemeToggle';
import PrimaryLayout from '@/components/(layouts)/PrimaryLayout';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  const { isDark } = useThemeStore();
  const { logout } = useAuthStore();
  
  return (
    <PrimaryLayout>
      <View className='py-20 px-6 gap-10'>
        <ThemeToggle />
        <GhostButton 
          title="Déconnexion" 
          color={isDark ? 'border-primary-lighter' : 'border-primary-darker'} 
          textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'} 
          onPress={logout}
        />
      </View>
    </PrimaryLayout>
  );
}