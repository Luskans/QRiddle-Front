import PrimaryLayout from '@/components/(layouts)/PrimaryLayout';
import { router } from 'expo-router';
import { View } from 'react-native';
import Separator from '@/components/(common)/Separator';
import ListLink from '@/components/(common)/ListLink';
import { useHome } from '@/hooks/useHome';
import LoadingView from '@/components/(common)/LoadingView';
import ErrorView from '@/components/(common)/ErrorView';


export default function ListScreen() {
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
        {/* @ts-ignore */}
        <ErrorView error={ error.response.data.message } />
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
      <View className='py-20 gap-10'>

        <View className='flex-col gap-10 px-6'>
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

        <View className='px-6'>
          <ListLink
            onPress={() => router.push("/riddles/create")}
            icon="plus-circle-outline"
            title="Créer une nouvelle énigme"
          />
        </View>

      </View>
    </PrimaryLayout>
  );
}