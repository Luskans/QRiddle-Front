import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from "@/constants/colors";

interface RiddleLinkProps {
    riddle: any;
}

export default function RiddleParticipatedLink({ riddle }: RiddleLinkProps) {
    const { isDark } = useThemeStore();
    const riddle2 = {
      title: "Les facettes du Puy",
      date: "12/05/24",
      rating: 4.2,
      difficulty: 3.4,
      isPrivate: true,
      score: 1487,
      status: "completed"
    }
    const getStatusColor = (status: string) => {
      switch (status) {
          case "completed": return 'bg-primary-lighter text-primary-darker dark:bg-primary-darker dark:text-primary-lighter';
          case "abandoned": return 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
          case "pending": return 'bg-secondary-lighter text-secondary-darker dark:bg-secondary-darker dark:text-secondary-lighter';
          default: return 'black';
      }
  };

    return (
      <View className='flex-row justify-between items-center gap-3 border-b border-gray-200 dark:border-gray-600 pb-3 mb-3'>
        <View className='flex-col '>

          <View className='flex-row items-center gap-3'>
            { riddle2.isPrivate ? <Ionicons name="lock-closed" size={16} color={isDark ? colors.light : colors.dark } /> : ''}
            <Text className='text-dark dark:text-light text-xl font-semibold'>{ riddle2.title }</Text>
          </View>

          <View className='flex-row gap-4'>
            <Text className='text-gray-400 dark:text-gray-400'>{ riddle2.date }</Text>
            <Text className={`${getStatusColor(riddle2.status)} text-sm py-0.5 px-2 rounded-full`}>{ riddle2.status }</Text>
          </View>

          <View className='flex-row gap-4'>
            <View className='flex-row items-center gap-1'>
              <Ionicons name="star-outline" size={16} color={isDark ? colors.secondary.lighter : colors.secondary.darker } />
              <Text className='text-secondary-darker dark:text-secondary-lighter'>{ riddle2.rating }</Text>
            </View>
            <View className='flex-row items-center gap-1'>
              <Ionicons name="trending-up-sharp" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker } />
              <Text className='text-secondary-darker dark:text-secondary-lighter'>{ riddle2.difficulty }</Text>
            </View>
          </View>

        </View>
        <View className='flex-row gap-2'>
          <Text className='text-dark dark:text-light text-lg'>{ riddle2.score }</Text>
          <Ionicons name="caret-forward" size={20} color={isDark ? colors.light : colors.dark } />
        </View>
      </View>
    );
}