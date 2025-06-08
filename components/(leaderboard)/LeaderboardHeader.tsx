import React from 'react';
import { View, Text } from 'react-native';


export default function LeaderboardHeader() {
  // TODO : utiliser useMemo

  return (
    <View className="flex-row justify-between py-2 border-b border-gray-200 dark:border-gray-600 mb-6">
      <Text className="font-h w-12 text-center text-gray-400 dark:text-gray-400 text-sm">
        Rang
      </Text>
      <Text className="font-h text-gray-400 dark:text-gray-400 text-sm">
        Joueur
      </Text>
      <Text className="font-h w-20 text-right text-gray-400 dark:text-gray-400 text-sm">
        Score
      </Text>
    </View>
  );
};