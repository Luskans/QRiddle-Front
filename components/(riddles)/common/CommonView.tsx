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
import CompletedGameSessionCard from './CompletedGameSessionCard';
import { MAP_LATITUDE, MAP_LONGITUDE, BACKEND_URL } from '@/constants/constants';
import { RiddleDetail } from '@/interfaces/riddle';
import { useAbandonSession, usePlayRiddle, useSessionByRiddle } from '@/hooks/useGame';
import TopRiddleLeaderboard from './TopRiddleLeaderboard';
import TopReviewList from './TopReviewsList';
import GhostButton from '@/components/(common)/GhostButton';
import FullButton from '@/components/(common)/FullButton';
import Toast from 'react-native-toast-message';
import ConfirmationModal from '@/components/(common)/ConfirmationModal';


export default function CommonView({ riddle }: { riddle: RiddleDetail }) {
  const { isDark } = useThemeStore();
  const [mapCoordinate] = useState({
    latitude: parseFloat(riddle.latitude ?? MAP_LATITUDE),
    longitude: parseFloat(riddle.longitude ?? MAP_LONGITUDE),
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [password, setPassword] = useState<string>('');
  const { data, isLoading } = useSessionByRiddle(riddle.id.toString());
  const creatorName = riddle.creator?.name || 'Inconnu';
  const creatorImage = riddle.creator?.image || '/default/user.png';
  const playRiddleMutation = usePlayRiddle();
  const abandonSessionMutation = useAbandonSession();
  const [showStartModal, setShowStartModal] = useState(false);
  const [showAbandonModal, setShowAbandonModal] = useState(false);

  const confirmStartGame = async () => {  
    if (data && data.status === 'active') {
      router.navigate(`/game/${data.id.toString()}`);
      
    } else {
      playRiddleMutation.mutate({riddleId: riddle.id.toString(), password}, {
        onSuccess: (data) => {
          Toast.show({
            type: 'success',
            text2: `Nouvelle partie lancée !`
          });
          router.navigate(`/game/${data.id.toString()}`);
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: 'Erreur',
            text2: `${error.response.data.message}`
          });
        },
      });
    }

    setShowStartModal(false);
  };

  const confirmAbandonGame = async () => {
    if (!data || data.status !== 'active') {
      return;
    }
    abandonSessionMutation.mutate(data.id.toString(), {
      onSuccess: (data) => {
        Toast.show({
          type: 'info',
          text2: `Partie abandonnée.`
        });
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: `${error.response.data.message}`
        });
      },
    });
    setShowAbandonModal(false);
  };

  const openStartModal = () => {
    setShowStartModal(true);
  };

  const closeStartModal = () => {
    setShowStartModal(false);
  };

  const openAbandonModal = () => {
    setShowAbandonModal(true);
  };

  const closeAbandonModal = () => {
    setShowAbandonModal(false);
  };

  return (
    <SecondaryLayout>
      <View className='py-10 gap-10'>

        {/* GENERAL */}
        <View className="px-6 gap-8">
          <Text className='font-h text-dark dark:text-light font-semibold text-2xl text-center'>{riddle.title}</Text>

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
              <Text className='font-h text-dark dark:text-light text-sm'>Étapes :</Text>
              <Text className='text-secondary-darker dark:text-secondary-lighter font-semibold'>{riddle.stepsCount}</Text>
            </View>
            <View className='flex-row gap-1 items-center'>
              <Ionicons name="star-outline" size={17} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
              <Text className='font-h text-dark dark:text-light text-sm'>Note :</Text>
              <Text className='text-secondary-darker dark:text-secondary-lighter font-semibold'>{riddle.averageRating || '-'}</Text>
            </View>
            <View className='flex-row gap-1 items-center'>
              <Ionicons name="trending-up-sharp" size={22} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
              <Text className='font-h text-dark dark:text-light text-sm'>Difficulté :</Text>
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
          <View className="flex-1 px-6">
            {riddle.is_private && !data && (
              <View className='gap-2'>
                <Text className="text-dark dark:text-light">Mot de passe :</Text>
                <TextInput
                  className={`bg-gray-50 border rounded-lg p-3 mb-8 'border-gray-300'`}
                  placeholder="Entrez le mot de passe"
                  placeholderTextColor={isDark ? colors.gray.lighter : colors.gray.darker}
                  onChangeText={(text) => {setPassword(text);}}
                  value={password}
                  autoCapitalize='none'
                />
              </View>
            )}
            {data?.status === 'active' ? (
              <View className='flex-1 flex-row gap-3 items-center justify-center'>
                <View className='flex-grow'>
                  <GhostButton
                    onPress={openAbandonModal}
                    title="Abandonner"
                    color={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                    textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'}
                    isLoading={abandonSessionMutation.isPending}
                    disabled={abandonSessionMutation.isPending || playRiddleMutation.isPending}
                  />
                </View>
                <View className='flex-grow'>
                  <FullButton
                    onPress={confirmStartGame}
                    title={'Reprendre'}
                    border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                    color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
                    textColor={isDark ? 'text-dark' : 'text-light'}
                    isLoading={playRiddleMutation.isPending}
                    disabled={playRiddleMutation.isPending || abandonSessionMutation.isPending}
                  />
                </View>
              </View>
            ) : (
              <FullButton
                onPress={openStartModal}
                title={'Nouvelle partie'}
                border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
                textColor={isDark ? 'text-dark' : 'text-light'}
                isLoading={playRiddleMutation.isPending}
                disabled={riddle.is_private && !password && !data || playRiddleMutation.isPending || abandonSessionMutation.isPending}
              />
            )}
          </View>
        )}

        {/* PLAYED SESSION */}
        {isLoading && (
          <View className='bg-gray-200 dark:bg-gray-darker px-6 py-10'>
            <ActivityIndicator size="large" color={isDark ? colors.primary.lighter : colors.primary.darker} />
          </View>
        )}

        {data && (
          <View className='bg-gray-200 dark:bg-gray-darker px-6'>
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

      <ConfirmationModal
        visible={showStartModal}
        title="Attention"
        message={`Commencer une nouvelle partie abandonnera la partie en cours. Êtes-vous sûr de vouloir continuer ?`}
        confirmText="Confirmer"
        cancelText="Annuler"
        onConfirm={confirmStartGame}
        onCancel={closeStartModal}
        isLoading={playRiddleMutation.isPending}
        isDanger={true}
      />

      <ConfirmationModal
        visible={showAbandonModal}
        title="Abandonner l'énigme"
        message={`Êtes-vous sûr de vouloir abandonner l'énigme en cours ? Vous ne pourrez pas reprendre la partie et devrez en recommencer une nouvelle.`}
        confirmText="Abandonner"
        cancelText="Annuler"
        onConfirm={confirmAbandonGame}
        onCancel={closeAbandonModal}
        isLoading={abandonSessionMutation.isPending}
        isDanger={true}
      />
    </SecondaryLayout>
  );
};