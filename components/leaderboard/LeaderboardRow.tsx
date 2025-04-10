import React from 'react';
import { View, Text, Image } from 'react-native';

interface RankingProps {
  name: string;
  image: string;
  score: number;
}

interface LeaderboardRowProps {
  data: RankingProps;
  index: number;
}

const rankColors: Record<number, string> = {
  0: 'bg-yellow-500',
  1: 'bg-gray-400',
  2: 'bg-amber-600',
};

export default function LeaderboardRow({ data, index }: LeaderboardRowProps) {
  return (
    <View className="flex-row items-center py-3">
      {/* Rang */}
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
      {/* Image et nom */}
      <View className="flex-1 flex-row items-center">
        <Image source={{ uri: data.image }} className="w-10 h-10 rounded-full" />
        <Text
          className="ml-3 font-medium text-gray-400 dark:text-gray-400"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {data.name}
        </Text>
      </View>
      {/* Score */}
      <View className="w-20">
        <Text className="text-right font-bold text-secondary-darker dark:text-secondary-lighter">
          {data.score}
        </Text>
      </View>
    </View>
  );
};