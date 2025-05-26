import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from "@/constants/colors";
import moment from "moment";
import { getStatusColor, getStatusName } from '@/lib/getStatusColor';
import { Link } from 'expo-router';
import { CreatedRiddle } from '@/interfaces/riddle';


export default function CreatedListCard({ riddle }: {riddle: CreatedRiddle}) {
    const { isDark } = useThemeStore();

    return (
      <Link href={`/riddles/${riddle.id.toString()}`} className='py-6' asChild>
        <TouchableOpacity className='flex-1 flex-row justify-between items-center px-6 gap-8'>
          <View className='flex-1 flex-col'>
            <View className='flex-row items-center gap-3'>
              { riddle.is_private
                ? <Ionicons name="lock-closed-outline" size={16} color={isDark ? colors.light : colors.dark } />
                : ''
              }
              <Text
                className='text-dark dark:text-light text-lg'
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                { riddle.title }
              </Text>
            </View>

            <View className=''>
              <Text className='text-gray-400 dark:text-gray-400 text-sm'>{ moment(riddle.updated_at).format('DD-MM-YYYY') }</Text>
            </View>

            <View className=''>
              <Text className='text-gray-400 dark:text-gray-400 text-sm'>Localisation</Text>
            </View>
          </View>

          <View className='flex-row gap-2'>
            <Text className={`${getStatusColor(riddle.status)} text-sm py-0.5 px-2.5 rounded-full`}>
              { getStatusName(riddle.status) }
            </Text>
            <Ionicons name="caret-forward" size={20} color={isDark ? colors.light : colors.dark } />
          </View>
        </TouchableOpacity>
      </Link>
    );
}