import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const theme = useTheme();
  theme.colors.background = 'transparent';

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
      }}
    >     
      <Stack.Screen 
        name="index" 
        options={{ 
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
        name="email-validation" 
        options={{ 
          title: 'Vérification email',
        }} 
      />
    </Stack>
  );
}