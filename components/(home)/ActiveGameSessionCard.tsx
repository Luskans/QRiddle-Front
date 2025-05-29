import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from "@/constants/colors";
import GhostButton from '@/components/(common)/GhostButton';
import moment from "moment";
import { router } from 'expo-router';
import { ActiveGameSession } from '@/interfaces/home';


export default function ActiveGameSessionCard({ activeGameSession }: { activeGameSession: ActiveGameSession }) {
  const { isDark } = useThemeStore();

  const handleResume = () => {
    router.push(`/game/${activeGameSession.id.toString()}`);

  };

  const handleAbandon = () => {
    // Logique pour abandonner la partie
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
            { activeGameSession.title }
          </Text>
    
          <View className=''>
            <Text className='text-gray-400 dark:text-gray-400 text-sm'>{ moment(activeGameSession.created_at).format('DD-MM-YYYY') }</Text>
          </View>

          <View className=''>
            <Text className='text-gray-400 dark:text-gray-400 text-sm'>Localisation</Text>
          </View>
        </View>

        <Text className='text-secondary-darker dark:text-secondary-lighter text-lg'>{ activeGameSession.latest_active_session_step.step.order_number }/{ activeGameSession.riddle.steps_count }</Text>
      </View>
      <View className='flex-row items-center gap-6'>
        <GhostButton 
          onPress={handleResume}
          title="Reprendre" 
          color={isDark ? 'border-secondary-lighter' : 'border-secondary-darker'} 
          textColor={isDark ? 'text-secondary-lighter' : 'text-secondary-darker'} 
        />
        <Text className='px-6 py-3 justify-center text-dark dark:text-light underline'>Abandonner</Text>
      </View>
    </View>
  );
}