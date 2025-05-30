import GhostButton from '@/components/(common)/GhostButton';
import { ThemeToggle } from '@/components/(profile)/ThemeToggle';
import PrimaryLayout from '@/components/(layouts)/PrimaryLayout';
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';


export default function ProfileScreen() {
  const { isDark } = useThemeStore();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  
  const handleLogout = () => {
    queryClient.clear();
    logout();
  }

  return (
    <PrimaryLayout>
      <View className='py-20 px-6 gap-10'>
        <ThemeToggle />
        <GhostButton 
          title="Déconnexion" 
          color={isDark ? 'border-primary-lighter' : 'border-primary-darker'} 
          textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'} 
          onPress={handleLogout}
        />
      </View>
    </PrimaryLayout>
  );
}