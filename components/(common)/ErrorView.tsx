import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from "@/constants/colors";
import { router } from 'expo-router';


export default function ErrorView({ error }: { error: string }) {
    const { isDark } = useThemeStore();

    return (
      <View className='flex-1 justify-center items-center gap-6'>
        <Text>Erreur :-|</Text>
        <Text>{error}</Text>

        <TouchableOpacity onPress={() => router.reload()}>
          <Text>Recharger</Text>
        </TouchableOpacity>
      </View>
    );
}