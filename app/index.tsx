import { useAuthStore } from '@/stores/useAuthStore';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { user, token, isLoading } = useAuthStore();
  
  if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      );
  }

  return <Redirect href={(user && token) ? '/(tabs)' : '/(auth)'} />;
}