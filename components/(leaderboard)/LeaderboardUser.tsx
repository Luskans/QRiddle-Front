import { UserRank } from '@/stores/useLeaderboardStore';
import React from 'react';
import { View, Text } from 'react-native';

export default function LeaderboardUser({ userRank }: { userRank: UserRank }) {
  return (
    <View className="mb-6 flex-row justify-center gap-8">
      <Text className="text-lg text-center text-dark dark:text-light">
        Votre rang :
        <Text className='text-xl font-bold text-secondary-darker dark:text-secondary-lighter'> # {userRank.rank}</Text>
      </Text>
      <Text className="text-lg text-center text-dark dark:text-light">
        Score :
        <Text className='text-xl font-bold text-secondary-darker dark:text-secondary-lighter'> {userRank.score}</Text>
      </Text>
    </View>
  );
};