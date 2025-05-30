import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import colors from "@/constants/colors";
import { useThemeStore } from '@/stores/useThemeStore';
import GradientButton from '@/components/(common)/GradientButton';
import GhostButton from '@/components/(common)/GhostButton';
import PrimaryLayout from '@/components/(layouts)/PrimaryLayout';
import FullButton from '@/components/(common)/FullButton';


export default function AuthScreen() {
  const { isDark } = useThemeStore();

  return (
    <PrimaryLayout>
      <View className="flex p-6">
        <View className='flex-col justify-center h-full gap-20'>
        
          {/* LOGO */}
          <View className="items-center justify-center gap-6">
            <Image
              source={require('@/assets/images/logo.png')}
              className="w-40 h-40"
            />
            <Text className="text-4xl font-h  text-dark dark:text-light">
              <Text className='text-primary-darker dark:text-primary-lighter'>QR</Text>iddle
            </Text>
          </View>

          {/* OAUTH */}
          <View className="flex gap-4">
            <TouchableOpacity 
              className="flex-row bg-transparent items-center justify-center border border-gray-400 dark:border-gray-300 rounded-xl py-3 px-6"
              onPress={() => {/* Handle Google OAuth */}}
            >
              <AntDesign name="google" size={24} color={`${isDark ? colors.primary.lighter : colors.primary.darker}`} />
              <Text className="ml-2 font-semibold text-dark dark:text-light">
                Continuer avec Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row bg-transparent items-center justify-center border border-gray-400 dark:border-gray-300 rounded-xl py-3 px-6"
              onPress={() => {/* Handle Apple OAuth */}}
            >
              <AntDesign name="apple1" size={24} color={`${isDark ? colors.primary.lighter : colors.primary.darker}`} />
              <Text className="ml-2 font-semibold text-dark dark:text-light">
                Continuer avec Apple
              </Text>
            </TouchableOpacity>

            {/* SEPARATOR*/}
            <View className="flex-row items-center">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-400 dark:text-gray-300">ou</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            {/* BUTTONS */}
            <View className="flex-row glex-grow gap-4">
              <View className='flex-grow'>
                <FullButton
                  onPress={() => router.push("/(auth)/register")}
                  title="Inscription"
                  color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
                  border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                  textColor={isDark ? 'text-dark' : 'text-light'}
                />
              </View>

              <View className='flex-grow'>
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
      </View>
    </PrimaryLayout>
  );
}