import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import GlobalLeaderboard from '@/components/(leaderboard)/GlobalLeaderboard';
import { View, Text } from 'react-native';

export default function GlobalLeaderboardScreen() {

  return (
    <SecondaryLayoutWithoutScrollView>
      <View className='flex-1 pt-6 px-6'>
        <GlobalLeaderboard />
      </View>
    </SecondaryLayoutWithoutScrollView>
  );
}