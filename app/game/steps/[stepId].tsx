import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { useGameSessionStore } from '@/stores/useGameSessionStore2';
import { View, Text } from 'react-native';

export default function GameScreen() {
  const { session, isLoading, error } = useGameSessionStore(state => state.activeGameSession);

  if (isLoading && !session) {
    return (
      <View>
        <ActivityIndicator size="large" color={isDark ? colors.primary.lighter : colors.primary.darker} />
        <Text className='text-dark dark:text-light'>Chargement des détails...</Text>
      </View>
    );
  }

  if (error && !session) {
    return (
      <View>
        <Text className='text-dark dark:text-light'>Erreur : {error}</Text>
      </View>
    );
  }

  return (
    <SecondaryLayout>
      <View>
        <Text>Page</Text>
      </View>
    </SecondaryLayout>
  );
}