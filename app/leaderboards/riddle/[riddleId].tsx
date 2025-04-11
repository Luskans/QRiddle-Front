import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import RiddleLeaderboard from '@/components/(leaderboard)/RiddleLeaderboard';
import { View } from 'react-native';

export default function RiddleLeaderboardScreen() {

  return (
    <SecondaryLayoutWithoutScrollView>
      <View className='flex-1 pt-6 px-6'>
        <RiddleLeaderboard riddleId={'1'}/>
      </View>
    </SecondaryLayoutWithoutScrollView>
  );
}