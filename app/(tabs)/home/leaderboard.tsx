import Leaderboard from '@/components/leaderboard/Leaderboard';
import { View, ActivityIndicator } from 'react-native';
import { useGlobalScoreStore } from '@/stores/useGlobalScoreStore';
import React, { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import SecondaryLayoutWithoutScrollView from '@/components/layouts/SecondaryLayoutWithoutScrollView';


export default function LeaderboardScreen() {
  const { ranking, userRank, offset, fetchGlobalScore, isLoading, error, resetGlobalScore } = useGlobalScoreStore();

  useFocusEffect(
    useCallback(() => {
      resetGlobalScore();
      fetchGlobalScore({ limit: 20, offset: 0 });
    }, [fetchGlobalScore, resetGlobalScore])
  );

  const handleLoadMore = async () => {
    if (!isLoading) {
      await fetchGlobalScore({ limit: 20, offset });
    }
  };

  if (isLoading && offset === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SecondaryLayoutWithoutScrollView>
      <View className='flex-1 pb-20 px-6'>
        <Leaderboard
          ranking={ranking}
          userRank={userRank}
          infiniteScroll={true}
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoading}
        />
      </View>
    </SecondaryLayoutWithoutScrollView>
  );
}