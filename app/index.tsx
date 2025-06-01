import LoadingView from '@/components/(common)/LoadingView';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import { useAuthStore } from '@/stores/useAuthStore';
import { Redirect } from 'expo-router';


export default function Index() {
  const { user, token, isLoading } = useAuthStore();
  
  if (isLoading) {
      return (
        <SecondaryLayoutWithoutScrollView>
          <LoadingView />
        </SecondaryLayoutWithoutScrollView>
      );
  }

  return <Redirect href={(user && token) ? '/(tabs)' : '/(auth)'} />;
}