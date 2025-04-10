import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, ActivityIndicator, ListRenderItemInfo } from 'react-native';
import TabButton from '@/components/leaderboard/TabButton';
import LeaderboardRow from '@/components/leaderboard/LeaderboardRow';

type Period = 'week' | 'month' | 'all';

interface RankingProps {
  name: string;
  image: string;
  score: number;
}

interface UserRankProps {
  rank: number;
  score: number;
}

interface LeaderboardProps {
  ranking: {
    week: RankingProps[];
    month: RankingProps[];
    all: RankingProps[];
  };
  userRank: {
    week: UserRankProps | null;
    month: UserRankProps | null;
    all: UserRankProps | null;
  };
  infiniteScroll?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export default function Leaderboard({
  ranking,
  userRank,
  infiniteScroll = false,
  onLoadMore,
  isLoadingMore = false
}: LeaderboardProps) {
  
  const [activePeriod, setActivePeriod] = useState<Period>('week');
  const currentData = ranking[activePeriod];

  // const getData = () => {
  //   switch (activePeriod) {
  //     case 'week':
  //       return ranking.week;
  //     case 'month':
  //       return ranking.month;
  //     case 'all':
  //       return ranking.all;
  //   }
  // };

  const renderRow = ({ item, index }: ListRenderItemInfo<RankingProps>) => (
    <LeaderboardRow data={item} index={index} />
  );

  return (
    <View className="mt-6">
      {/* Tabs de sélection */}
      <View className="flex-row justify-between bg-gray-100 dark:bg-gray-darker rounded-full mb-6">
        <TabButton
          title="Semaine"
          isActive={activePeriod === 'week'}
          onPress={() => setActivePeriod('week')}
        />
        <TabButton
          title="Mois"
          isActive={activePeriod === 'month'}
          onPress={() => setActivePeriod('month')}
        />
        <TabButton
          title="Total"
          isActive={activePeriod === 'all'}
          onPress={() => setActivePeriod('all')}
        />
      </View>

      {/* Utilisateur */}
      {userRank[activePeriod] && (
        <View className="mb-6 flex-row justify-center gap-8">
          <Text className="text-lg text-center text-dark dark:text-light">
            Votre rang :
            <Text className='text-xl font-bold text-secondary-darker dark:text-secondary-lighter'> # {userRank[activePeriod]?.rank}</Text>
          </Text>
          <Text className="text-lg text-center text-dark dark:text-light">
            Score :
            <Text className='text-xl font-bold text-secondary-darker dark:text-secondary-lighter'> {userRank[activePeriod]?.score}</Text>
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
      {infiniteScroll ? (
        <FlatList
          className='max-h-[84%]'
          data={currentData}
          keyExtractor={(item, index) => `${item.name}-${index}-${activePeriod}`}
          renderItem={renderRow}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="large" color="#2563EB" className='mt-4' />
            ) : null
          }
        />
      ) : (
        <View className="">
          {currentData.map((item, index) => (
            <LeaderboardRow key={index} data={item} index={index} />
          ))}
        </View>
      )}
    </View>
  );
};