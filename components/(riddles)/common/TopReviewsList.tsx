import React from 'react';
import { View, Text, FlatList } from 'react-native';
import ReviewListItem from '@/components/(riddles)/common/ReviewListItem';
import { useTopReviewsByRiddle } from '@/hooks/useReviews';
import LoadingView from '@/components/(common)/LoadingView';
import ErrorView from '@/components/(common)/ErrorView';

export default function TopReviewsList({ riddleId }: { riddleId: string }) {
  const { data, isLoading, isError, error } = useTopReviewsByRiddle(riddleId);

  if (isLoading) {
    return (
      <LoadingView />
    );
  }

  if (isError) {
    return (
      <ErrorView error={ error.message } />
    );
  }

  if (!data) {
    return (
      <ErrorView error="Aucune donnée disponible" />
    );
  }

  return (
    <View className='px-6 gap-6'>
      {data.items.length > 0 ? (
        <FlatList
          data={data.items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ReviewListItem review={item} />
          )}
          scrollEnabled={false}
        />
      ) : (
        <Text className='text-dark dark:text-light mb-10'>L'énigme n'a aucun avis pour le moment.</Text>
      )}
    </View>
  );
}