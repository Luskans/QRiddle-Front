import { View, Text } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import GhostButton from '@/components/(common)/GhostButton';
import moment from "moment";
import { router } from 'expo-router';
import { ActiveGameSession } from '@/interfaces/home';
import Toast from 'react-native-toast-message';
import { useAbandonSession } from '@/hooks/useGame';
import { useState } from 'react';
import ConfirmationModal from '../(common)/ConfirmationModal';
import FullButton from '../(common)/FullButton';


export default function ActiveGameSessionCard({ activeGameSession }: { activeGameSession: ActiveGameSession }) {
  const { isDark } = useThemeStore();
  const abandonSessionMutation = useAbandonSession();
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  
  const handleResume = () => {
    router.push(`/game/${activeGameSession.id.toString()}`);    
  };

  const confirmAbandonGame = async () => {
    if (!activeGameSession) {
      return;
    }
    abandonSessionMutation.mutate(activeGameSession.id.toString(), {
      onSuccess: () => {
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

  const openAbandonModal = () => {
    setShowAbandonModal(true);
  };

  const closeAbandonModal = () => {
    setShowAbandonModal(false);
  };

  return (
    <View className='py-10 gap-8'>
      <Text className='text-secondary-darker dark:text-secondary-lighter text-2xl text-center font-semibold uppercase'>Enigme en cours !</Text>
      
      <View className='flex-1 flex-row justify-between items-center gap-6'>
        <View className='flex-1 flex-col'>
          <Text
            className='text-dark dark:text-light text-lg'
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            { activeGameSession.riddle.title }
          </Text>
    
          <View className=''>
            <Text className='text-gray-500 dark:text-gray-400 text-sm'>
              {moment(activeGameSession.created_at).isSame(moment(), 'day')
                ? moment(activeGameSession.created_at).fromNow()
                : moment(activeGameSession.created_at).format('DD-MM-YYYY')}
            </Text>
          </View>

          <View className=''>
            <Text className='text-gray-500 dark:text-gray-400 text-sm'>Localisation</Text>
          </View>
        </View>

        <Text className='text-secondary-darker dark:text-secondary-lighter text-lg'>{ activeGameSession.latest_active_session_step.step.order_number }/{ activeGameSession.riddle.steps_count }</Text>
      </View>

      <View className='flex-1 flex-row gap-3 items-center justify-center'>
        <View className='flex-grow'>
          <GhostButton
            onPress={openAbandonModal}
            title="Abandonner"
            color={isDark ? 'border-secondary-lighter' : 'border-secondary-darker'}
            textColor={isDark ? 'text-secondary-lighter' : 'text-secondary-darker'}
            isLoading={abandonSessionMutation.isPending}
            disabled={abandonSessionMutation.isPending}
          />
        </View>
        <View className='flex-grow'>
          <FullButton
            onPress={handleResume}
            title={'Reprendre'}
            border={isDark ? 'border-secondary-lighter' : 'border-secondary-darker'}
            color={isDark ? 'bg-secondary-lighter' : 'bg-secondary-darker'}
            textColor={isDark ? 'text-dark' : 'text-light'}
            disabled={abandonSessionMutation.isPending}
          />
        </View>
      </View>

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
    </View>
  );
}