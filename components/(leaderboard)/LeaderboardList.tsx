import { GlobalLeaderboard, LeaderboardItem } from '@/stores/useLeaderboardStore';
import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import LeaderboardRow from './LeaderboardRow';

interface LeaderboardListProps {
  list: LeaderboardItem[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  offset?: number; // Offset actuel pour calculer le rang
  scrollEnabled?: boolean;
  limit?: number;
  period?: string;
}

export default function LeaderboardList({
  list,
  isLoading,
  error,
  hasMore,
  loadMore,
  offset,
  scrollEnabled,
  limit,
  period
}: LeaderboardListProps) {

  return (
    <FlatList
      className='max-h-[78%]'
      data={list}
      keyExtractor={(item) => `${item.user_id.toString()}.${period}`}
      renderItem={({ item, index }) => (
        <LeaderboardRow data={item} index={index} />
      )}
      onEndReached={limit ? undefined : loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoading && list?.length > 0 && !limit ? (
          <ActivityIndicator size="large" color="#2563EB" className='mt-4' />
        ) : null
      }
      scrollEnabled={scrollEnabled}
    />
  );
};