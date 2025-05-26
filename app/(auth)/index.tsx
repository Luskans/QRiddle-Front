import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import colors from "@/constants/colors";
import { useThemeStore } from '@/stores/useThemeStore';
import GradientButton from '@/components/(common)/GradientButton';
import GhostButton from '@/components/(common)/GhostButton';
import PrimaryLayout from '@/components/(layouts)/PrimaryLayout';


export default function AuthScreen() {
  const { isDark } = useThemeStore();

  return (
    <PrimaryLayout>
      <View className="flex p-6">
        <View className='flex-col justify-center h-full gap-20'>
        
          {/* Header avec Logo et Nom */}
          <View className="flex-row items-center justify-center gap-2">
            <Image
              source={require('@/assets/images/logo1.png')}
              className="w-10 h-10"
            />
            <Text className="text-2xl font-bold text-dark dark:text-light">
              <Text className='text-primary-mid'>QR</Text>iddle
            </Text>
          </View>

          {/* BUTTONS */}
          <View className="flex gap-4">
            {/* Button google */}
            <TouchableOpacity 
              className="flex-row bg-white dark:bg-transparent items-center justify-center border border-gray-400 dark:border-gray-300 rounded-xl py-3 px-6"
              onPress={() => {/* Handle Google OAuth */}}
            >
              <AntDesign name="google" size={24} color={`${colors.primary.mid}`} />
              <Text className="ml-2 font-semibold text-dark dark:text-light">
                Continuer avec Google
              </Text>
            </TouchableOpacity>

            {/* Button apple */}
            <TouchableOpacity 
              className="flex-row bg-white dark:bg-transparent items-center justify-center border border-gray-400 dark:border-gray-300 rounded-xl py-3 px-6"
              onPress={() => {/* Handle Apple OAuth */}}
            >
              <AntDesign name="apple1" size={24} color={`${colors.primary.mid}`} />
              <Text className="ml-2 font-semibold text-dark dark:text-light">
                Continuer avec Apple
              </Text>
            </TouchableOpacity>

            {/* Separator */}
            <View className="flex-row items-center">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-400 dark:text-gray-300">ou</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <View className="flex-row gap-4">
              {/* Button register */}
              <GradientButton
                onPress={() => router.push("/(auth)/register")}
                title="Inscription"
                colors={isDark ? [colors.primary.lighter, colors.primary.lighter] : [colors.primary.darker, colors.primary.darker]}
                textColor={isDark ? 'text-dark' : 'text-light'}
              />

              {/* Button login */}
              <GhostButton
                onPress={() => router.push("/(auth)/login")}
                title="Connexion"
                color={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'}
              />
            </View>
          </View>

        </View>
      </View>
    </PrimaryLayout>
  );
}