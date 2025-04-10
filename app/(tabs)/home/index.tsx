import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import SectionLink from '@/components/common/SectionLink';
import ModuleLink from '@/components/common/ModuleLink';
import Leaderboard from '@/components/leaderboard/Leaderboard';
import ActiveGameCard from '@/components/homeScreen/ActiveGameCard';
import { useHomeStore } from '@/stores/useHomeStore';


import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import PrimaryLayout from '@/components/layouts/PrimaryLayout';
import colors from '@/constants/colors';
import { useThemeStore } from '@/stores/useThemeStore';


export default function HomeScreen() {
  const { isDark } = useThemeStore();
  const {
    notificationsCount,
    activeRiddle,
    participatedCount,
    createdCount,
    ranking,
    userRank,
    fetchHomeData,
    isLoading,
  } = useHomeStore();

  useFocusEffect(
    useCallback(() => {
      fetchHomeData({ limit: 5 });
    }, [fetchHomeData])
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }
  
  return (
    <PrimaryLayout>
      <View className='py-20 gap-12'>
        {/* NOTIFICATIONS */}
        <View className='flex gap-2 px-6'>
          <Link href="/home/notifications" asChild>
            <TouchableOpacity className='flex-row items-center gap-3'>
              <Ionicons name="notifications-outline" size={22} color={isDark ? colors.light : colors.dark} />
              <SectionLink title="Notifications" />
            </TouchableOpacity>
          </Link>
          <Text className='dark:text-light text-lg'>
            Vous avez
            <Text className='text-secondary-darker dark:text-secondary-lighter font-semibold'> {notificationsCount} </Text>
            {notificationsCount > 1 ? 'notifications': 'notification'} en attente.</Text>
        </View>

        {/* CURRENT RIDDLE */}
        <View className='bg-gray-100 dark:bg-gray-darker px-6 -mb-12'>
          <ActiveGameCard activeGame="" />
        </View>

        <View className='bg-gray-100 dark:bg-gray-darker h-2'></View>
        
        <View className='flex-col gap-10 px-6'>
          {/* RIDDLES PARTICIPATED */}
          <Link href="/riddles/participated" asChild>
            <TouchableOpacity className='flex-row items-center gap-3'>
              <Ionicons name="footsteps-outline" size={22} color={isDark ? colors.light : colors.dark} />
              <ModuleLink title="Enigmes participées" number={participatedCount} />
            </TouchableOpacity>
          </Link>

          {/* RIDDLES CREATED */}
          <Link href="/riddles/created" asChild>
            <TouchableOpacity className='flex-row items-center gap-3'>
              <Ionicons name="footsteps-outline" size={22} color={isDark ? colors.light : colors.dark} />
              <ModuleLink title="Enigmes créées" number={createdCount} />
            </TouchableOpacity>
          </Link>
        </View>
        <View className='bg-gray-100 dark:bg-gray-darker h-2'></View>

        {/* LEADERBOARD */}
        <View className='flex gap-2 px-6'>
          <Link href="/home/leaderboard" asChild>
            <TouchableOpacity className='flex-row items-center gap-3'>
              <Ionicons name="trophy-outline" size={22} color={isDark ? colors.light : colors.dark} />
              <SectionLink title="Classement" />
            </TouchableOpacity>
          </Link>
          
          <Leaderboard
            ranking={ranking}
            userRank={userRank}
          />
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