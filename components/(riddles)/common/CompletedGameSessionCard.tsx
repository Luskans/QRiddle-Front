import { View, Text } from 'react-native';
import { getFormattedDuration } from '@/lib/getFormattedDuration';
import { RiddleSession } from '@/interfaces/game';


export default function CompletedGameSessionCard({ session }: {session: RiddleSession}) {
  
  return (
    <View className='py-10 gap-8'>
      <Text className='font-h text-secondary-darker dark:text-secondary-lighter text-2xl text-center font-semibold uppercase'>
        {session.status === 'active' && ('Partie en cours !')}
        {session.status === 'completed' && ('Énigme terminée')}
        {session.status === 'abandoned' && ('Énigme échouée')}
      </Text>
      <View className='gap-6'>
        {session.session_steps.map((step, index) => (
          <View key={index} className='flex-row justify-between items-center'>
            <Text className='text-dark dark:text-light'>Étape {index + 1}</Text>
            {step.status === 'active' && (<Text className='text-secondary-darker dark:text-secondary-lighter'>en cours</Text>)}
            {step.status === 'completed' && (<Text className='text-secondary-darker dark:text-secondary-lighter'>{ getFormattedDuration(step.start_time, step.end_time) }</Text>)}
            {step.status === 'abandoned' && (<Text className='text-secondary-darker dark:text-secondary-lighter'>abandonnée</Text>)}
          </View>
        ))}
      </View>
    </View>
  );
}