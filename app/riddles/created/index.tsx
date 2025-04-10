import { Link, useFocusEffect } from 'expo-router';
import { View, ActivityIndicator, FlatList, TouchableOpacity, Text } from 'react-native';
import { useCallback, useRef } from 'react';
import SecondaryLayoutWithoutScrollView from '@/components/layouts/SecondaryLayoutWithoutScrollView';
import CreatedListCard from '@/components/list/CreatedListCard';
import { useRiddleStore } from '@/stores/useRiddleStore';

export default function CreatedListScreen() {
  const { createdList, fetchCreatedList } = useRiddleStore();

  useFocusEffect(
    useCallback(() => {
      if (createdList.riddles.length === 0 && !createdList.isLoading) {
        fetchCreatedList({ limit: 20, offset: 0 });
      }
    }, [fetchCreatedList, createdList.riddles.length, createdList.isLoading])
  );

  const handleLoadMore = async () => {
    if (!createdList.isLoading && createdList.hasMore) {
      await fetchCreatedList({ limit: 20, offset: createdList.offset });
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <>
      <Link href={`/riddles/created/${item.id.toString()}`} className='py-6' asChild>
        <TouchableOpacity className=''>
          <CreatedListCard riddle={item} />
        </TouchableOpacity>
      </Link>
      <View className='bg-gray-100 dark:bg-gray-darker h-2'></View>
    </>
  );

  if (createdList.isLoading && createdList.offset === 0) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (createdList.error) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Une erreur est survenue...</Text>
        </View>
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (!createdList.isLoading && createdList.riddles.length === 0 && !createdList.error) {
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
          data={createdList.riddles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            createdList.isLoading ? (
              <ActivityIndicator size="large" color="#2563EB" className='mt-4' />
            ) : null
          }
        />
      </View>
    </SecondaryLayoutWithoutScrollView>
  );
}