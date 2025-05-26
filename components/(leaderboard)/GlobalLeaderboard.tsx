import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, ActivityIndicator, ListRenderItemInfo } from 'react-native';
import TabButton from '@/components/(leaderboard)/TabButton';
import LeaderboardRow from '@/components/(leaderboard)/LeaderboardRow';
import { defaultGlobalLeaderboard, LeaderboardItem, useLeaderboardStore, UserRank } from '@/stores/useLeaderboardStore';
import LeaderboardUser from './LeaderboardUser';
import LeaderboardHeader from './LeaderboardHeader';
import LeaderboardList from './LeaderboardList';


export default function GlobalLeaderboard() {
  const [activePeriod, setActivePeriod] = useState<'week' | 'month' | 'all'>('week');
  const { fetchGlobalLeaderboard, fetchGlobalUserRank } = useLeaderboardStore();
  const {
    list,
    offset,
    isLoading,
    hasMore,
    error
  } = useLeaderboardStore(state => state.globalLeaderboard[activePeriod] || defaultGlobalLeaderboard);
  const userRank = useLeaderboardStore(state => state.globalUserRanks[activePeriod]);

  useEffect(() => {
    fetchGlobalLeaderboard(activePeriod);
    fetchGlobalUserRank();
  }, [activePeriod, fetchGlobalLeaderboard, fetchGlobalUserRank]);

  const loadMore = async () => {
    if (!isLoading && hasMore) {
      await fetchGlobalLeaderboard(activePeriod, { offset });
    }
  };

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
        list={list}
        isLoading={isLoading}
        error={error}
        hasMore={hasMore}
        loadMore={loadMore}
        scrollEnabled={true}
        period={activePeriod}
      />
    </View>
  );
};