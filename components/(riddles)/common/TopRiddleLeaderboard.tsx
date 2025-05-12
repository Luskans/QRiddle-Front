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


export default function TopRiddleLeaderboard({ riddleId }: { riddleId: string }) {
  const { isDark } = useThemeStore();
  const { fetchRiddleLeaderboard } = useLeaderboardStore();
  const { list, userRank, isLoading, error } = useLeaderboardStore(state => state.riddleLeaderboard[riddleId] || defaultRiddleLeaderboard);
  const displayedList = (list?.length === 0) ? [] : list?.slice(0, 5);

  useEffect(() => {
    if (riddleId) {
      fetchRiddleLeaderboard(riddleId, { limit: 5 });
    }
  }, [riddleId, fetchRiddleLeaderboard]);

  return (
    <View className='px-6'>
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

      <Link href={`/leaderboards/riddle/${riddleId}`} asChild className='flex-1 justify-center mt-6'>
        <TouchableOpacity className='flex-row items-center gap-1'>
          <Ionicons name="arrow-forward" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
          <Text className='text-secondary-darker dark:text-secondary-lighter'>Voir le classement entier</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}