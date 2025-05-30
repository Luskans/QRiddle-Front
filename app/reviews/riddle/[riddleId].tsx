import { useLocalSearchParams } from 'expo-router';
import { View, ActivityIndicator, FlatList, Text } from 'react-native';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import ReviewListItem from '@/components/(riddles)/common/ReviewListItem';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { useReviewsByRiddle } from '@/hooks/useReviews';
import LoadingView from '@/components/(common)/LoadingView';
import ErrorView from '@/components/(common)/ErrorView';


export default function ReviewsScreen() {
  const { riddleId } = useLocalSearchParams<{ riddleId: string }>();
  const { isDark } = useThemeStore();
  const { 
      data, 
      isLoading, 
      isError,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage
    } = useReviewsByRiddle(riddleId, 20);

  // TODO : utiliser useMemo
  const reviews = data?.pages.flatMap(page => page.items) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <LoadingView />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (isError) {
    return (
      <SecondaryLayoutWithoutScrollView>
        {/* @ts-ignore */}
        <ErrorView error={ error.response.data.message } />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (!data) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <ErrorView error="Aucune donnée disponible" />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  return (
    <SecondaryLayoutWithoutScrollView>
      <View className='py-10 px-6'>
        {reviews.length > 0 ? (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ReviewListItem review={item} />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => (
              isFetchingNextPage ? (
                <View className="py-4 flex justify-center items-center">
                  <ActivityIndicator size="small" color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
                </View>
              ) : null
            )}
          />
        ) : (
          <Text className='text-dark dark:text-light mt-6'>L'énigme n'a aucun avis pour le moment.</Text>
        )}
      </View>
    </SecondaryLayoutWithoutScrollView>
  );
}