import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from "@/constants/colors";

interface SectionLinkProps {
    title: string;
}

export default function SectionLink({ title }: SectionLinkProps) {
    const { isDark } = useThemeStore();

    return (
        <View className='flex-1 flex-row items-center gap-3'>
            <Text className='dark:text-light text-2xl'>{ title }</Text>
            <Ionicons name="arrow-forward" size={24} color={isDark ? colors.light : colors.dark } />
        </View>
    );
}

