import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from "@/constants/colors";
import { memo } from 'react';


interface SectionLinkProps {
    onPress: () => void;
    icon: any;
    title: string;
}

export default function SectionLink({ onPress, icon, title }: SectionLinkProps) {
    const { isDark } = useThemeStore();

    return (
      <TouchableOpacity className='flex-row items-center gap-3 mb-6' onPress={onPress}>
        <Ionicons name={icon} size={22} color={isDark ? colors.light : colors.dark} />
        <View className='flex-1 flex-row items-center gap-3'>
          <Text className='font-h dark:text-light text-2xl'>{ title }</Text>
          <Ionicons name="arrow-forward" size={24} color={isDark ? colors.light : colors.dark } />
        </View>
      </TouchableOpacity>
    );
}