import { useLeaderboardStore } from '@/stores/useLeaderboardStore';
import LeaderboardHeader from '@/components/(leaderboard)/LeaderboardHeader';
import LeaderboardList from '@/components/(leaderboard)/LeaderboardList';
import LeaderboardUser from '@/components/(leaderboard)/LeaderboardUser';
import TabButton from '@/components/(leaderboard)/TabButton';
import { View } from 'react-native';
import { useEffect, useState } from 'react';

export default function TopGlobalLeaderboard() {
  const [activePeriod, setActivePeriod] = useState<'week' | 'month' | 'all'>('week');
  const { fetchGlobalLeaderboard, fetchGlobalUserRank } = useLeaderboardStore();
  const { list, isLoading, error } = useLeaderboardStore(state => state.globalLeaderboard[activePeriod]);
  const userRank = useLeaderboardStore(state => state.globalUserRanks[activePeriod]);
  const displayedList = (list.length === 0) ? [] : list.slice(0, 5);

  useEffect(() => {
    if (list.length === 0) {
      fetchGlobalLeaderboard(activePeriod, { limit: 5 });
      fetchGlobalUserRank();
    }
  }, [activePeriod, fetchGlobalLeaderboard, fetchGlobalUserRank]);

  return (
    <View>
      <View className="flex-row justify-between bg-gray-100 dark:bg-gray-darker rounded-full mb-6">
        <TabButton
          title="Semaine"
          isActive={activePeriod === 'week'}
          onPress={() => setActivePeriod('week')}
        />
        <TabButton
          title="Mois"
          isActive={activePeriod === 'month'}
          onPress={() => setActivePeriod('month')}
        />
        <TabButton
          title="Total"
          isActive={activePeriod === 'all'}
          onPress={() => setActivePeriod('all')}
        />
      </View>

      {userRank && <LeaderboardUser userRank={userRank} />}

      <LeaderboardHeader />

      <LeaderboardList
        list={displayedList}
        isLoading={isLoading}
        error={error}
        hasMore={false}
        loadMore={() => {}}
        scrollEnabled={false}
        limit={5}
      />
    </View>
  );
}