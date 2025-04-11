import { ThemeToggle } from '@/components/(common)/ThemeToggle';
import PrimaryLayout from '@/components/(layouts)/PrimaryLayout';
import { View, Text } from 'react-native';

export default function ProfileScreen() {

  // TODO : fetch les infos users de authstore, mettre les formulaires d'update
  
  return (
    <PrimaryLayout>
      <View>
        <Text className='text-green-400 dark:text-blue-400'>Page Profil avec: photo, membre depuis, badges, statistiques?, pages, deconnexion </Text>
        <ThemeToggle />
      </View>
    </PrimaryLayout>
  );
}