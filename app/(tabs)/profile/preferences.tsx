import SecondaryLayout from '@/components/layouts/SecondaryLayout';
import { View, Text } from 'react-native';

export default function ProfilPreferencesScreen() {
  return (
    <SecondaryLayout>
      <View>
        <Text>Page de paramètre des preferences du profil (dark mode, notifications)</Text>
      </View>
    </SecondaryLayout>
  );
}