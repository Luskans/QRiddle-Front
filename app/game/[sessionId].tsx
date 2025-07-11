import ErrorView from '@/components/(common)/ErrorView';
import GhostButton from '@/components/(common)/GhostButton';
import LoadingView from '@/components/(common)/LoadingView';
import Separator from '@/components/(common)/Separator';
import Chronometer from '@/components/(gameplay)/Chronometer';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import colors from '@/constants/colors';
import { BACKEND_URL } from '@/constants/constants';
import { useActiveSession, useUnlockHint } from '@/hooks/useGame';
import { useThemeStore } from '@/stores/useThemeStore';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import Toast from 'react-native-toast-message';
import FullButton from '@/components/(common)/FullButton';


export default function GameScreen() {
  const { isDark } = useThemeStore();
  const SCREEN_WIDTH = Dimensions.get('window').width - 24;
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { data, isLoading, isError, error } = useActiveSession(sessionId);
  const unlockHintMutation = useUnlockHint();
  const [audioSource, setAudioSource] = useState('');
  const audioPlayer = useAudioPlayer(audioSource);

  const handleUnlock = async (hint_order_number: number) => {
    unlockHintMutation.mutate({id: sessionId, hint_order_number: hint_order_number}, {
      onSuccess: () => {
        Toast.show({
          type: 'info',
          text2: 'Indice dévérouillé !'
        });
      },
      onError: (error: any) => {
        Toast.show({
          type: 'erreur',
          text1: 'Erreur',
          text2: `${error.response.data.message}`
        });
      },
    });
  };

  if (isLoading) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <LoadingView />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (isError) {
    return (
      <SecondaryLayoutWithoutScrollView>
        {/* @ts-ignore */}
        <ErrorView error={ error.response.data.message } />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (!data) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <ErrorView error="Aucune donnée disponible" />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  return (
    <SecondaryLayout>
      <View className='pb-10 gap-4'>

        <View className='py-10 gap-6 bg-gray-200 dark:bg-gray-darker'>
          <View className='gap-2'>
            <Text className='font-h text-dark dark:text-light font-semibold text-2xl text-center'>
              Étape
                <Text className='font-h text-secondary-darker dark:text-secondary-lighter'> {data.step.order_number} </Text>
              sur {data.stepsCount}
            </Text>

            <Chronometer startTime={data.session_step.start_time} />

          </View>

          <View className='items-center'>
            <FullButton
              onPress={() => {router.push(`/game/${sessionId}/scan`)}}
              title={'Scanner QR code'}
              border={isDark ? 'border-secondary-lighter' : 'border-secondary-darker'}
              color={isDark ? 'bg-secondary-lighter' : 'bg-secondary-darker'}
              textColor={isDark ? 'text-dark' : 'text-light'}
              isLoading={unlockHintMutation.isPending}
              disabled={unlockHintMutation.isPending}
            />
          </View>
        </View>

        {data.hints && data.hints.map((hint) => (
          <View key={hint.id} className=''>

            {hint.unlocked ? (
              <>
                <View className='px-6 gap-4 mb-10'>
                  <Text className="font-h text-dark dark:text-light text-2xl font-semibold">
                    Indice {hint.order_number}
                  </Text>

                  {hint.type === 'text' && (
                    <Text className='text-dark dark:text-light'>{hint.content}</Text>
                  )}

                  {hint.type === 'image' && (
                    <Image 
                      source={{ uri:`${BACKEND_URL}${hint.content}` }}
                      className="rounded"
                      style={{ height: SCREEN_WIDTH }}
                      resizeMode="cover"
                      accessibilityLabel='Default hint image'
                      defaultSource={require('@/assets/images/default-hint.jpg')}
                    />
                  )}

                  {hint.type === 'audio' && (
                    <View className='flex-row justify-between gap-6'>
                      <TouchableOpacity
                        className={`flex-row flex-1 items-center rounded-lg gap-1 px-6 py-2 border ${audioPlayer.playing ? 'border-secondary-darker dark:border-secondary-lighter' : 'border-dark dark:border-light'}`}
                        onPress={() => {setAudioSource(`${BACKEND_URL}${hint.content}`), audioPlayer.play()}}
                      >
                        {audioPlayer.playing ? (
                          <ActivityIndicator size="small" color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
                        ) : (
                          <Ionicons name="play" size={20} color={isDark ? colors.light : colors.dark} />
                        )}
                        <Text className={`${audioPlayer.playing ? 'text-secondary-darker dark:text-secondary-lighter' : 'text-dark dark:text-light'}`}>Jouer le son</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className='flex-row items-center rounded-lg border gap-1 px-6 py-2 border-dark dark:border-light'
                        onPress={() => audioPlayer.pause()}
                      >
                        <Ionicons name="pause" size={20} color={isDark ? colors.light : colors.dark} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <Separator />
              </>

            ) : (
              <View className='bg-gray-200 dark:bg-gray-darker p-6 flex-row justify-between items-center'>
                <Text className='font-h text-dark dark:text-light text-2xl font-semibold'>Indice {hint.order_number}</Text>
                <View className=''>
                  <GhostButton
                    onPress={() => handleUnlock(hint.order_number)}
                    title="Dévérouiller"
                    color={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                    textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'}
                    isLoading={unlockHintMutation.isPending}
                    disabled={unlockHintMutation.isPending}
                  />
                </View>
              </View>
            )}

          </View>
        ))}

      </View>
    </SecondaryLayout>
  );
}