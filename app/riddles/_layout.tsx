import { useThemeStore } from '@/stores/useThemeStore';
import { Stack } from 'expo-router';
import colors from "@/constants/colors";
import HeaderBackButton from '@/components/common/HeaderBackButton';

export default function RiddlesLayout() {
  const { isDark } = useThemeStore();
  
  return (
    // <Stack
    //   screenOptions={{
    //     contentStyle: { backgroundColor: 'transparent' },
    //     headerStyle: { backgroundColor: 'transparent' },
    //     headerShadowVisible: false,
    //     headerTintColor: isDark ? colors.light : colors.dark,
    //     animation: 'slide_from_right'
    //   }}
    // >
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="created/index"
        options={{ 
          title: 'Mes créations',
        }}
      />
      <Stack.Screen 
        name="created/[id]/index"
        options={{ 
          title: '',
          headerBackVisible: false,
          headerLeft: () => <HeaderBackButton />,
          // gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="created/[id]/steps/stepCreate"
        options={{ 
          title: '',
        }}
      />
      <Stack.Screen 
        name="created/[id]/steps/[id]/index"
        options={{ 
          title: '',
        }}
      />
      <Stack.Screen 
        name="created/[id]/steps/[id]/qrcode"
        options={{ 
          title: '',
        }}
      />
      <Stack.Screen 
        name="created/[id]/steps/[id]/hintCreate"
        options={{ 
          title: '',
        }}
      />
      <Stack.Screen 
        name="participated/index"
        options={{ 
          title: 'Mes participations',
        }}
      />
      <Stack.Screen 
        name="participated/[id]"
        options={{ 
          title: '',
        }}
      />
    </Stack>
  );
}