import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from "@/constants/colors";

interface ModuleLinkProps {
    title: string;
    number?: number;
}

export default function ModuleLink({ title, number }: ModuleLinkProps) {
    const { isDark } = useThemeStore();

    return (
        <View className='flex-1 flex-row items-center justify-between'>
            <Text className='flex-1 text-dark dark:text-light text-lg'>{ title }</Text>
            <View className='flex-row items-center gap-2'>
                <Text className='text-secondary-darker dark:text-secondary-lighter text-lg font-semibold'>{ number }</Text>
                <Ionicons name="caret-forward" size={20} color={isDark ? colors.light : colors.dark } />
            </View>
        </View>
    );
}