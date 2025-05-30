import LoadingView from '@/components/(common)/LoadingView';
import { useAuthStore } from '@/stores/useAuthStore';
import { Redirect } from 'expo-router';


export default function Index() {
  const { user, token, isLoading } = useAuthStore();
  
  if (isLoading) {
      return (
        <LoadingView />
      );
  }

  return <Redirect href={(user && token) ? '/(tabs)' : '/(auth)'} />;
}