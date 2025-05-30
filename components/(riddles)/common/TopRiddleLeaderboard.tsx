import LeaderboardHeader from '@/components/(leaderboard)/LeaderboardHeader';
import LeaderboardUser from '@/components/(leaderboard)/LeaderboardUser';
import { View, Text, FlatList } from 'react-native';
import { useTopRiddleLeaderboard } from '@/hooks/useLeaderboards';
import LoadingView from '@/components/(common)/LoadingView';
import ErrorView from '@/components/(common)/ErrorView';
import LeaderboardRow from '@/components/(leaderboard)/LeaderboardRow';


export default function TopRiddleLeaderboard({ riddleId }: { riddleId: string }) {
  const { data, isLoading, isError, error } = useTopRiddleLeaderboard(riddleId);
  const userInfos = data?.data;
  // TODO : use memo

  if (isLoading) {
    return (
      <LoadingView />
    );
  }

  if (isError) {
    return (
      // @ts-ignore
      <ErrorView error={ error.response.data.message } />
    );
  }

  if (!data) {
    return (
      <ErrorView error="Aucune donnée disponible" />
    );
  }

  return (
    <View className='px-6'>
      {userInfos && userInfos.userRank && (<LeaderboardUser userInfos={userInfos} />)}

      <LeaderboardHeader />

      {data.items && data.items.length > 0 ? (
        <FlatList
          data={data.items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <LeaderboardRow data={item} index={index} />
          )}
          scrollEnabled={false}
        />
      ) : (
        <Text className='text-dark dark:text-light mt-6'>L'énigme n'a aucun classement pour le moment.</Text>
      )}
    </View>
  );
}