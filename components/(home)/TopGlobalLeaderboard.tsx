import LeaderboardHeader from '@/components/(leaderboard)/LeaderboardHeader';
import LeaderboardUser from '@/components/(leaderboard)/LeaderboardUser';
import TabButton from '@/components/(leaderboard)/TabButton';
import { FlatList, Text, View } from 'react-native';
import { useState } from 'react';
import { useTopGlobalLeaderboard } from '@/hooks/useLeaderboards';
import LoadingView from '@/components/(common)/LoadingView';
import ErrorView from '@/components/(common)/ErrorView';
import LeaderboardRow from '@/components/(leaderboard)/LeaderboardRow';

export default function TopGlobalLeaderboard() {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  const { data, isLoading, isError, error } = useTopGlobalLeaderboard(period);
  const userInfos = data?.data;

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
    <View>
      <View className="flex-row justify-between bg-gray-200 dark:bg-gray-darker rounded-full mb-6">
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

      {userInfos && userInfos.userRank && (<LeaderboardUser userInfos={userInfos} />)}

      <LeaderboardHeader />

      {data.items.length > 0 ? (
        <FlatList
          data={data.items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <LeaderboardRow data={item} index={index} />
          )}
          scrollEnabled={false}
        />
      ) : (
        <Text className='text-dark dark:text-light mt-6'>Aucun classement pour cette période pour le moment.</Text>
      )}
    </View>
  );
}