import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const theme = useTheme();
  theme.colors.background = 'transparent';

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        // animation: 'slide_from_right'
      }}
    >     
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Intro',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Connexion',
          headerTransparent: true,
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Inscription',
          headerTransparent: true,
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'Mot de passe oublié',
        }} 
      />
      <Stack.Screen 
        name="verify-email" 
        options={{ 
          title: 'Vérification email',
        }} 
      />
    </Stack>
  );
}