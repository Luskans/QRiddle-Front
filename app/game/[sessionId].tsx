import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import colors from '@/constants/colors';
import { useGameSessionStore } from '@/stores/useGameSessionStore2';
import { useThemeStore } from '@/stores/useThemeStore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function GameScreen() {
  const { isDark } = useThemeStore();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { fetchActiveGameSession } = useGameSessionStore();
  const { session, isLoading, error } = useGameSessionStore(state => state.activeGameSession);

  useEffect(() => {
    fetchActiveGameSession(sessionId);
  }, [fetchActiveGameSession])

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