import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, ActivityIndicator, ListRenderItemInfo } from 'react-native';
import TabButton from '@/components/leaderboard/TabButton';
import LeaderboardRow from '@/components/leaderboard/LeaderboardRow';

export default function RiddleLeaderboard({}) {
  


  return (
    <View className="mt-6">
      
      {/* Utilisateur */}
      {userRank && (
        <View className="mb-6 flex-row justify-center gap-8">
          <Text className="text-lg text-center text-dark dark:text-light">
            Votre rang :
            <Text className='text-xl font-bold text-secondary-darker dark:text-secondary-lighter'> # {userRank?.rank}</Text>
          </Text>
          <Text className="text-lg text-center text-dark dark:text-light">
            Score :
            <Text className='text-xl font-bold text-secondary-darker dark:text-secondary-lighter'> {userRank?.score}</Text>
          </Text>
        </View>
      )}

      {/* Entête */}
      <View className="flex-row justify-between py-2 border-b border-gray-200 dark:border-gray-600">
        <Text className="italic w-12 text-center text-gray-400 dark:text-gray-400 text-sm">
          Rang
        </Text>
        <Text className="italic text-gray-400 dark:text-gray-400 text-sm">
          Joueur
        </Text>
        <Text className="italic w-20 text-right text-gray-400 dark:text-gray-400 text-sm">
          Score
        </Text>
      </View>

      {/* Liste des résultats du classement */}
      <FlatList
        data={}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <LeaderboardRow data={item} index={index} />}
        scrollEnabled={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator size="large" color="#2563EB" className='mt-4' />
          ) : null
        }
      />
    </View>
  );
};