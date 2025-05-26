import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Image } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import Separator from '@/components/(common)/Separator';
import SectionLink from '@/components/(common)/SectionLink';
import { router } from 'expo-router';
import moment from 'moment';
import MapView, { Marker } from 'react-native-maps';
import GradientButton from '@/components/(common)/GradientButton';
import CompletedGameSessionCard from './CompletedGameSessionCard';
import { MAP_LATITUDE, MAP_LONGITUDE, BACKEND_URL } from '@/constants/constants';
import { RiddleDetail } from '@/interfaces/riddle';
import { useSessionByRiddle } from '@/hooks/useGame';
import TopRiddleLeaderboard from './TopRiddleLeaderboard';
import TopReviewList from './TopReviewsList';

export default function CommonView({ riddle }: { riddle: RiddleDetail }) {
  const { isDark } = useThemeStore();
  const [mapCoordinate] = useState({
    latitude: parseFloat(riddle.latitude ?? MAP_LATITUDE),
    longitude: parseFloat(riddle.longitude ?? MAP_LONGITUDE),
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { data, isLoading, isError, error } = useSessionByRiddle(riddle.id.toString());
  const creatorName = riddle.creator?.name || 'Inconnu';
  const creatorImage = riddle.creator?.image || '/default/user.png';

  const handleStartGame = async () => {
    // TODO :mettre modal pour prévenir autre partie en cours abandonnées
    // if (riddle.is_private && !password.trim()) {
    //   setErrorMessage('Veuillez saisir le mot de passe pour lancer la partie');
    //   return;
    // }

    // let newGame;
    // if (!data || data.status !== 'active') {
    //   newGame = await createGame(riddle.id.toString(), password.trim());

    //   if (newGame) {
    //     router.replace(`/game/${newGame.id.toString()}`);

    //   } else {
    //     alert('Impossible de démarrer la partie.');
    //   }

    // } else if (data && data.status === 'active') {
    //   router.replace(`/game/${data.id.toString()}`);
    // }
  };

  return (
    <SecondaryLayout>
      <View className='py-10 gap-10'>

        {/* GENERAL */}
        <View className="px-6 gap-8">
          <Text className='text-dark dark:text-light font-bold text-2xl text-center'>{riddle.title}</Text>

          <View className="flex-row justify-center items-center gap-2">
            <View className="h-[36px] w-[36px] rounded-full">
              <Image 
                source={{ uri:`${BACKEND_URL}${creatorImage}` }}
                resizeMode="cover" 
                className="h-[36px] w-[36px] rounded-full"
                defaultSource={require('@/assets/images/default-user.png')}
              />
            </View>
            <View className="">
              <Text className="font-semibold text-dark dark:text-light">{creatorName}</Text>
              <Text className="text-sm text-gray-400 dark:text-gray-400">
                {moment(riddle.updated_at).isSame(moment(), 'day')
                  ? moment(riddle.updated_at).fromNow()
                  : moment(riddle.updated_at).format('DD-MM-YYYY')}
              </Text>
            </View>
          </View>

          <Text className='text-dark dark:text-light'>{riddle.description}</Text>

          <View className='flex-row justify-between'>
            <View className='flex-row gap-1 items-center'>
              <Ionicons name="footsteps-outline" size={18} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
              <Text className='text-dark dark:text-light text-sm'>Étapes :</Text>
              <Text className='text-secondary-darker dark:text-secondary-lighter font-semibold'>{riddle.stepsCount}</Text>
            </View>
            <View className='flex-row gap-1 items-center'>
              <Ionicons name="star-outline" size={17} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
              <Text className='text-dark dark:text-light text-sm'>Note :</Text>
              <Text className='text-secondary-darker dark:text-secondary-lighter font-semibold'>{riddle.averageRating || '-'}</Text>
            </View>
            <View className='flex-row gap-1 items-center'>
              <Ionicons name="trending-up-sharp" size={22} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
              <Text className='text-dark dark:text-light text-sm'>Difficulté :</Text>
              <Text className='text-secondary-darker dark:text-secondary-lighter font-semibold'>{riddle.averageDifficulty || '-'}</Text>
            </View>
          </View>
        </View>

        {/* MAP */}
        <View className="h-64 overflow-hidden">
          <MapView
            style={{ flex: 1 }}
            initialRegion={mapCoordinate}
          >
            <Marker coordinate={{ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude }} />
          </MapView>
        </View>

        {/* PASSWORD & BUTTONS */}
        {riddle.status === 'published' && (
          <View className="px-6">
            {riddle.is_private && (
              <>
                <Text className="text-dark dark:text-light mb-2">Mot de passe :</Text>
                <TextInput
                  className={`bg-gray-50 border rounded-lg p-3 mb-8 ${errorMessage !== '' ? 'border-red-500 dark:border-red-400' : 'border-gray-300'}`}
                  placeholder="Entrez le mot de passe"
                  placeholderTextColor={isDark ? colors.gray.lighter : colors.gray.darker}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrorMessage('');
                  }}
                  value={password}
                  autoCapitalize='none'
                />
                {errorMessage !== '' && (
                  <Text style={{ color: 'red', marginBottom: 8 }}>{errorMessage}</Text>
                )}
              </>
            )}
            <View className='flex-row items-center gap-6'>
              <GradientButton
                onPress={handleStartGame}
                title={data && data.status === 'active' ? 'Reprendre' : 'Lancer la partie'}
                colors={isDark ? [colors.primary.mid, colors.primary.lighter] : [colors.primary.darker, colors.primary.mid]}
                textColor={isDark ? 'text-dark' : 'text-light'}
                // isLoading={isSubmitting}
                disabled={riddle.is_private && !password}
              />
              {data && data.status === 'active' && (
                <Text className='px-6 py-3 justify-center text-dark dark:text-light underline'>Abandonner</Text>
              )}
            </View>
          </View>
        )}

        {/* PLAYED SESSION */}
        {isLoading && (
          <View className='bg-gray-100 dark:bg-gray-darker px-6 py-10'>
            <ActivityIndicator size="large" color={isDark ? colors.primary.lighter : colors.primary.darker} />
          </View>
        )}
        {/* {isError && (
          <View className='bg-gray-100 dark:bg-gray-darker px-6 py-10'>
            <Text className='text-dark dark:text-light'>{error.response.data.message}</Text>
          </View>
        )} */}
        {data && (
          <View className='bg-gray-100 dark:bg-gray-darker px-6'>
            <CompletedGameSessionCard session={data} />
          </View>
        )}

        {!data && (<Separator />)}

        {/* LEADERBOARD */}
        <View className='flex gap-8'>
          <View className='px-6'>
            <SectionLink
              onPress={() => router.push(`/leaderboards/riddle/${riddle.id.toString()}`)}
              icon="trophy-outline"
              title="Classement"
            />
          </View>
          <TopRiddleLeaderboard riddleId={riddle.id.toString()} />
        </View>

        <Separator />

        {/* REVIEWS */}
        <View className='flex gap-8'>
          <View className='px-6'>
            <SectionLink
              onPress={() => router.push(`/reviews/riddle/${riddle.id.toString()}`)}
              icon="chatbubble-ellipses-outline"
              title="Avis"
            />
          </View>
          <TopReviewList riddleId={riddle.id.toString()} />
        </View>
      </View>
    </SecondaryLayout>
  );
};