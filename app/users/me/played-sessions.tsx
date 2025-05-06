import { Link, useFocusEffect } from 'expo-router';
import { View, ActivityIndicator, FlatList, TouchableOpacity, Text } from 'react-native';
import { useCallback, useRef } from 'react';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import CreatedCard from '@/components/(user)/CreatedCard';
import { useRiddleStore } from '@/stores/useRiddleStore';
import Separator from '@/components/(common)/Separator';
import { useGameSessionStore } from '@/stores/useGameSessionStore2';
import PlayedSessionCard from '@/components/(user)/PlayedSessionCard';

export default function PLayedSessionsListScreen() {
  const { playedList, fetchPlayedList } = useGameSessionStore();

  useFocusEffect(
    useCallback(() => {
      if (playedList.sessions.length === 0 && !playedList.isLoading) {
        fetchPlayedList({ limit: 20, offset: 0 });
      }
    }, [fetchPlayedList, playedList.sessions.length, playedList.isLoading])
  );

  const handleLoadMore = async () => {
    if (!playedList.isLoading && playedList.hasMore) {
      await fetchPlayedList({ limit: 20, offset: playedList.offset });
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <>
      <PlayedSessionCard session={item} />
      <Separator />
    </>
  );

  if (playedList.isLoading && playedList.offset === 0) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (playedList.error) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Une erreur est survenue...</Text>
        </View>
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (!playedList.isLoading && playedList.sessions.length === 0 && !playedList.error) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Aucune énigme créée pour le moment.</Text>
        </View>
      </SecondaryLayoutWithoutScrollView>
    );
  }

  return (
    <SecondaryLayoutWithoutScrollView>
      <View className='flex-1 py-10 gap-6'>
        <FlatList
          data={playedList.sessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            playedList.isLoading ? (
              <ActivityIndicator size="large" color="#2563EB" className='mt-4' />
            ) : null
          }
        />
      </View>
    </SecondaryLayoutWithoutScrollView>
  );
}