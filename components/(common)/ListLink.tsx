import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from "@/constants/colors";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';


interface ListLinkProps {
    onPress: () => void;
    icon: any;
    title: string;
    number?: number;
}

export default function ListLink({ onPress, icon, title, number }: ListLinkProps) {
    const { isDark } = useThemeStore();

    return (
      <TouchableOpacity className='flex-row items-center gap-3' onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={22} color={isDark ? colors.light : colors.dark} />
        <View className='flex-1 flex-row items-center justify-between'>
          <Text className='flex-1 text-dark dark:text-light text-lg'>{ title }</Text>
          <View className='flex-row items-center gap-2'>
              <Text className='text-secondary-darker dark:text-secondary-lighter text-lg font-semibold'>{ number }</Text>
              <Ionicons name="caret-forward" size={20} color={isDark ? colors.light : colors.dark } />
          </View>
        </View>
      </TouchableOpacity>
    );
}