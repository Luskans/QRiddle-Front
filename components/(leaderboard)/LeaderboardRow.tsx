import { BACKEND_URL } from '@/constants/constants';
import { Leaderboard } from '@/interfaces/leaderboard';
import React from 'react';
import { View, Text, Image } from 'react-native';


const rankColors: Record<number, string> = {
  0: 'bg-yellow-500',
  1: 'bg-gray-400',
  2: 'bg-amber-600',
};

export default function LeaderboardRow({ data, index }: { data: Leaderboard, index: number }) {
  const userName = data?.user?.name || 'Inconnu';
  const userImage = data?.user?.image || '/default/user.png';
  // TODO : utiliser useMemo

  return (
    <View className="flex-row items-center py-3">

      <View className="w-14">
        {(index < 3)
        ? <View className={`w-8 h-8 rounded-full items-center justify-center ${rankColors[index]}`}>
            <Text className={`font-semibold text-dark dark:text-light`}>
              {index + 1}
            </Text>
          </View>
        : <Text className={`font-semibold text-dark dark:text-light`}>
            {'# ' + (index + 1)}
          </Text>
        }
      </View>

      <View className="flex-1 flex-row items-center">
        <Image 
          source={{ uri:`${BACKEND_URL}${userImage}` }}
          className="h-8 w-8 rounded-full"
          defaultSource={require('@/assets/images/default-user.png')}
        />
        <Text
          className="ml-3 font-medium text-gray-400 dark:text-gray-400"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {userName}
        </Text>
      </View>

      <View className="w-20">
        <Text className="text-right font-bold text-secondary-darker dark:text-secondary-lighter">
          {data.score}
        </Text>
      </View>

    </View>
  );
};