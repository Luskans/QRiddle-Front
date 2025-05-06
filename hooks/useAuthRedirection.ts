import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';

export default function useAuthRedirection(isAppReady: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!isAppReady) return;

    const inAuthSegment = segments[0] === '(auth)';

    if (!(user || token) && !inAuthSegment) {
      router.replace('/(auth)');

    } else if ((user && token) && inAuthSegment) {
      router.replace('/(tabs)');
    }
  }, [user, token, segments, router, isAppReady]);
}