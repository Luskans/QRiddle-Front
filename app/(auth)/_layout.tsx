import { Stack } from 'expo-router';


export default function AuthLayout() {

  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        headerTitleStyle: { fontFamily: 'Spectral' }
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