import { View, Text } from 'react-native';
import { router } from 'expo-router';
import ActiveGameSessionCard from '@/components/(home)/ActiveGameSessionCard';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import PrimaryLayout from '@/components/(layouts)/PrimaryLayout';
import TopGlobalLeaderboard from '@/components/(home)/TopGlobalLeaderboard';
import ListLink from '@/components/(common)/ListLink';
import SectionLink from '@/components/(common)/SectionLink';
import Separator from '@/components/(common)/Separator';
import { useHome } from '@/hooks/useHome';
import LoadingView from '@/components/(common)/LoadingView';
import ErrorView from '@/components/(common)/ErrorView';


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
        {/* NOTIFICATIONS */}
        {/* <View className='flex gap-2 px-6'>
          <SectionLink
            onPress={() => router.push("/notifications")}
            icon="notifications-outline"
            title="Notifications"
          />
          <Text>Vous avez 0 notifications en attente.</Text>
        </View> */}

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

        <Text>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is
          that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing
          packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.
          Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</Text>

        <Ionicons name="footsteps-outline" size={24} color="black" />
        <Ionicons name="qr-code-outline" size={24} color="black" />
        <Ionicons name="trophy-outline" size={24} color="black" />
        <MaterialIcons name="sports-score" size={24} color="black" />
        <AntDesign name="enviromento" size={24} color="black" />
        <AntDesign name="rocket1" size={24} color="black" />
        <Ionicons name="bulb-outline" size={24} color="black" />
        <Ionicons name="construct-outline" size={24} color="black" />
        <Ionicons name="contrast-outline" size={24} color="black" />
        <Ionicons name="dice-outline" size={24} color="black" />
        <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
        <Ionicons name="finger-print" size={24} color="black" />
        <Ionicons name="flag-outline" size={24} color="black" />
        <Ionicons name="flashlight-outline" size={24} color="black" />
        <Ionicons name="hourglass-outline" size={24} color="black" />
        <Ionicons name="information-circle-outline" size={24} color="black" />
        <Ionicons name="journal-outline" size={24} color="black" />
        <Ionicons name="location-outline" size={24} color="black" />
        <Ionicons name="log-out-outline" size={24} color="black" />
        <Ionicons name="log-in-outline" size={24} color="black" />
        <Ionicons name="mail-outline" size={24} color="black" />
        <Ionicons name="mail-unread-outline" size={24} color="black" />
        <Ionicons name="medal-outline" size={24} color="black" />
        <Ionicons name="navigate-circle-outline" size={24} color="black" />
        <Ionicons name="notifications-outline" size={24} color="black" />
        <Ionicons name="podium-outline" size={24} color="black" />
        <Ionicons name="ribbon-outline" size={24} color="black" />
        <Ionicons name="scan" size={24} color="black" />
        <Ionicons name="school-outline" size={24} color="black" />
        <Ionicons name="settings-outline" size={24} color="black" />
        <Ionicons name="time-outline" size={24} color="black" />
        <Ionicons name="timer-outline" size={24} color="black" />
        <Ionicons name="trail-sign-outline" size={24} color="black" />
        <Ionicons name="trash-outline" size={24} color="black" />
        <Ionicons name="warning-outline" size={24} color="black" />
        <Entypo name="price-ribbon" size={24} color="black" />
        <Ionicons name="happy-outline" size={24} color="black" />
        <Ionicons name="heart-circle-outline" size={24} color="black" />
        <Ionicons name="heart-outline" size={24} color="black" />
        <Ionicons name="people-outline" size={24} color="black" />
        <Ionicons name="star-outline" size={24} color="black" />
        <Ionicons name="thumbs-up-outline" size={24} color="black" />
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
        <Ionicons name="information-circle-outline" size={24} color="black" />
        <Text>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is
          that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is
          that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here.</Text>
      </View>
    </PrimaryLayout>
  );
}