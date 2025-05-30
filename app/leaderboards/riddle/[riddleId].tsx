import ErrorView from '@/components/(common)/ErrorView';
import LoadingView from '@/components/(common)/LoadingView';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import LeaderboardHeader from '@/components/(leaderboard)/LeaderboardHeader';
import LeaderboardRow from '@/components/(leaderboard)/LeaderboardRow';
import LeaderboardUser from '@/components/(leaderboard)/LeaderboardUser';
import colors from '@/constants/colors';
import { useRiddleLeaderboard } from '@/hooks/useLeaderboards';
import { useThemeStore } from '@/stores/useThemeStore';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function RiddleLeaderboardScreen() {
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
  } = useRiddleLeaderboard(riddleId, 20);

  // TODO : utiliser useMemo
  const rankings = data?.pages.flatMap(page => page.items) || [];
  const userInfos = data?.pages[0].data;

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

  return (
    <SecondaryLayoutWithoutScrollView>
      <View className='flex-1 py-6 px-6'>

        {userInfos && userInfos.userRank && ( <LeaderboardUser userInfos={userInfos} /> )}
        
        <LeaderboardHeader />
        
        {rankings.length > 0 ? (
          <FlatList
            data={rankings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <LeaderboardRow data={item} index={index} />
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
          <Text className='text-dark dark:text-light mt-6'>L'énigme n'a aucun classement pour le moment.</Text>
        )}

      </View>
    </SecondaryLayoutWithoutScrollView>
  );
}