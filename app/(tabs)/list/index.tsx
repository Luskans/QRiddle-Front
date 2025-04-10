import ModuleLink from '@/components/common/ModuleLink';
import PrimaryLayout from '@/components/layouts/PrimaryLayout';
import { useHomeStore } from '@/stores/useHomeStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';

export default function ListScreen() {
  const { isDark } = useThemeStore();
  const {
    participatedCount,
    createdCount,
  } = useHomeStore();

  return (
    <PrimaryLayout>
      <View className='py-20 gap-10'>
        <View className='flex-col gap-10 px-6'>
          <Link href="/riddles/participated" asChild>
            <TouchableOpacity className='flex-row items-center gap-3'>
              <Ionicons name="footsteps-outline" size={22} color={isDark ? colors.light : colors.dark} />
              <ModuleLink title="Enigmes participées" number={participatedCount} />
            </TouchableOpacity>
          </Link>

          <Link href="/riddles/created" asChild>
            <TouchableOpacity className='flex-row items-center gap-3'>
              <Ionicons name="footsteps-outline" size={22} color={isDark ? colors.light : colors.dark} />
              <ModuleLink title="Enigmes créées" number={createdCount} />
            </TouchableOpacity>
          </Link>
        </View>

        <View className='bg-gray-100 dark:bg-gray-darker h-2'></View>

        <View className='px-6'>
          <Link href="/list/create" asChild>
            <TouchableOpacity className='flex-row items-center gap-3'>
              <Ionicons name="add-circle-outline" size={22} color={isDark ? colors.light : colors.dark} />
              <ModuleLink title="Créer une nouvelle énigme" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </PrimaryLayout>
  );
}