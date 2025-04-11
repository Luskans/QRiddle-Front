import { defaultRiddleLeaderboard, useLeaderboardStore } from '@/stores/useLeaderboardStore';
import LeaderboardHeader from '@/components/(leaderboard)/LeaderboardHeader';
import LeaderboardList from '@/components/(leaderboard)/LeaderboardList';
import LeaderboardUser from '@/components/(leaderboard)/LeaderboardUser';
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';


export default function RiddleLeaderboard({ riddleId }: { riddleId: string }) {
  const { isDark } = useThemeStore();
  const { fetchRiddleLeaderboard } = useLeaderboardStore();
  const { list, offset, hasMore, userRank, isLoading, error } = useLeaderboardStore(state => state.riddleLeaderboard[riddleId] || defaultRiddleLeaderboard);

  useEffect(() => {
    if (riddleId) {
      fetchRiddleLeaderboard(riddleId);
    }
  }, [riddleId, fetchRiddleLeaderboard]);

  const loadMore = async () => {
    if (!isLoading && hasMore) {
      await fetchRiddleLeaderboard(riddleId, { offset });
    }
  };

  return (
    <View>
      {userRank && <LeaderboardUser userRank={userRank} />}

      <LeaderboardHeader />

      <LeaderboardList
        list={list}
        isLoading={isLoading}
        error={error}
        hasMore={hasMore}
        loadMore={loadMore}
        scrollEnabled={true}
      />
    </View>
  );
}