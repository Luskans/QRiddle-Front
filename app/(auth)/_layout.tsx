import colors from '@/constants/colors';
import { useThemeStore } from '@/stores/useThemeStore';
import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  // const theme = useTheme();
  // theme.colors.background = 'transparent';
  const { isDark } = useThemeStore();

  return (
    <Stack
      screenOptions={{
        // headerShadowVisible: false,
        animation: 'slide_from_right',
        // headerStyle: { backgroundColor: isDark ? colors.primary.lighter : colors.primary.darker },
        // headerTintColor: isDark ? colors.dark : colors.light,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Connexion',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Inscription',
          headerShown: true,
        }} 
        />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'Mot de passe oublié',
        }} 
        />
      <Stack.Screen 
        name="email-validation" 
        options={{ 
          title: 'Vérification email',
        }} 
        />
    </Stack>
  );
}