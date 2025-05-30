import ErrorView from '@/components/(common)/ErrorView';
import LoadingView from '@/components/(common)/LoadingView';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import LeaderboardHeader from '@/components/(leaderboard)/LeaderboardHeader';
import LeaderboardRow from '@/components/(leaderboard)/LeaderboardRow';
import LeaderboardUser from '@/components/(leaderboard)/LeaderboardUser';
import TabButton from '@/components/(leaderboard)/TabButton';
import colors from '@/constants/colors';
import { useGlobalLeaderboard } from '@/hooks/useLeaderboards';
import { useThemeStore } from '@/stores/useThemeStore';
import { useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';


export default function GlobalLeaderboardScreen() {
  const { isDark } = useThemeStore();
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  const { 
    data, 
    isLoading, 
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGlobalLeaderboard(period, 20);

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
      <View className='flex-1 pt-6 px-6'>
        
        <View className="flex-row justify-between bg-gray-100 dark:bg-gray-darker rounded-full mb-6">
          <TabButton
            title="Semaine"
            isActive={period === 'week'}
            onPress={() => setPeriod('week')}
          />
          <TabButton
            title="Mois"
            isActive={period === 'month'}
            onPress={() => setPeriod('month')}
          />
          <TabButton
            title="Total"
            isActive={period === 'all'}
            onPress={() => setPeriod('all')}
          />
        </View>

        {userInfos && ( <LeaderboardUser userInfos={userInfos} /> )}
        
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
          <Text className='text-dark dark:text-light mt-6'>Il n'y a aucun classement pour le moment.</Text>
        )}

      </View>
    </SecondaryLayoutWithoutScrollView>
  );
}