import { View } from 'react-native';
import { router } from 'expo-router';
import ActiveGameSessionCard from '@/components/(home)/ActiveGameSessionCard';
import PrimaryLayout from '@/components/(layouts)/PrimaryLayout';
import TopGlobalLeaderboard from '@/components/(home)/TopGlobalLeaderboard';
import ListLink from '@/components/(common)/ListLink';
import SectionLink from '@/components/(common)/SectionLink';
import Separator from '@/components/(common)/Separator';
import { useHome } from '@/hooks/useHome';
import LoadingView from '@/components/(common)/LoadingView';
import ErrorView from '@/components/(common)/ErrorView';
import GradientButton from '@/components/(common)/GradientButton';


export default function HomeScreen() {
  const { data, isLoading, isError, error } = useHome();

  if (isLoading) {
    return (
      <PrimaryLayout>
        <LoadingView />
      </PrimaryLayout>
    );
  }

  if (isError) {
    return (
      <PrimaryLayout>
        <ErrorView error={ error.message } />
      </PrimaryLayout>
    );
  }

  if (!data) {
    return (
      <PrimaryLayout>
        <ErrorView error="Aucune donnée disponible" />
      </PrimaryLayout>
    );
  }

  return (
    <PrimaryLayout>
      <View className='py-20 gap-12'>

        <View className='px-6'>
          <GradientButton
            onPress={() => {router.push(`/game/2/complete`)}}
            title={'Scanner QR code'}
            colors={['red', 'orange']}
            textColor={'white'}
          />
        </View>

        {/* ACTIVE GAME SESSION */}
        {data.activeGameSession &&
        <View className='bg-gray-100 dark:bg-gray-darker px-6'>
          <ActiveGameSessionCard activeGameSession={data.activeGameSession} />
        </View>
        }

        {/* GAMES PLAYED & RIDDLES CREATED */}
        <View className='flex gap-10 px-6'>
          <ListLink
            onPress={() => router.push("/users/me/played-sessions")}
            icon="puzzle-check-outline"
            title="Enigmes jouées"
            number={data.playedCount}
          />

          <ListLink
            onPress={() => router.push("/users/me/riddles/created")}
            icon="puzzle-plus-outline"
            title="Enigmes créées"
            number={data.createdCount}
          />
        </View>

        <Separator />

        {/* LEADERBOARD */}
        <View className='flex gap-2 px-6'>
          <SectionLink
            onPress={() => router.push("/leaderboards/global")}
            icon="trophy-outline"
            title="Classement"
          />
          <TopGlobalLeaderboard />
        </View>

      </View>
    </PrimaryLayout>
  );
}