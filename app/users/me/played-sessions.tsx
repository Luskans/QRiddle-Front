import { View, ActivityIndicator, FlatList, Text } from 'react-native';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import Separator from '@/components/(common)/Separator';
import PlayedSessionCard from '@/components/(user)/PlayedSessionCard';
import { usePlayedSessions } from '@/hooks/useGame';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import LoadingView from '@/components/(common)/LoadingView';
import ErrorView from '@/components/(common)/ErrorView';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';


export default function PLayedSessionsScreen() {
  const { isDark } = useThemeStore();
  const { 
    data, 
    isLoading, 
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePlayedSessions(20);

  const list = data?.pages.flatMap(page => page.items) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <SecondaryLayout>
        <LoadingView />
      </SecondaryLayout>
    );
  }

  if (isError) {
    return (
      <SecondaryLayout>
        <ErrorView error={ error.message } />
      </SecondaryLayout>
    );
  }

  if (!data) {
    return (
      <SecondaryLayout>
        <ErrorView error="Aucune donnée disponible" />
      </SecondaryLayout>
    );
  }

  if (list.length === 0) {
    return (
      <SecondaryLayout>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text className='text-dark dark:text-light'>Aucune énigme jouée pour le moment.</Text>
        </View>
      </SecondaryLayout>
    );
  }

  return (
    <SecondaryLayoutWithoutScrollView>
      <View className='flex-1 py-10 gap-6'>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <>
              <PlayedSessionCard session={item} />
              <Separator />
            </>
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
      </View>
    </SecondaryLayoutWithoutScrollView>
  );
}