import PrimaryLayout from '@/components/(layouts)/PrimaryLayout';
import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import Separator from '@/components/(common)/Separator';
import ListLink from '@/components/(common)/ListLink';
import { useHomeStore } from '@/stores/useHomeStore';

export default function ListScreen() {
  const { isDark } = useThemeStore();
  const { createdCount, playedCount } = useHomeStore();

  return (
    <PrimaryLayout>
      <View className='py-20 gap-10'>

        <View className='flex-col gap-10 px-6'>
          <ListLink
            onPress={() => router.push("/users/me/played-sessions")}
            icon="puzzle-check-outline"
            title="Enigmes jouées"
            number={playedCount}
          />

          <ListLink
            onPress={() => router.push("/users/me/riddles/created")}
            icon="puzzle-plus-outline"
            title="Enigmes créées"
            number={createdCount}
          />
        </View>

        <Separator />

        <View className='px-6'>
          <ListLink
            onPress={() => router.push("/riddles/create")}
            icon="plus-circle-outline"
            title="Créer une nouvelle énigme"
          />
        </View>

      </View>
    </PrimaryLayout>
  );
}