import { TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';

export default function HeaderBackButton() {
  const router = useRouter();
  const navigation = useNavigation();
  const { isDark } = useThemeStore();

  const handlePress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // S'il n'y a pas de page précédente, on redirige vers l'accueil
      router.replace('/');
    }
  };

  return (
    <TouchableOpacity onPressOut={handlePress}>
      <Ionicons name="arrow-back" size={24} color={isDark ? colors.dark : colors.light} />
    </TouchableOpacity>
  );
}