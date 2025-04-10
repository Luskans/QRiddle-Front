import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';

export default function useAuthRedirection() {
  const segments = useSegments();
  const router = useRouter();
  const { user, token, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const inAuthSegment = segments[0] === 'auth';

    if (!(user || token) && !inAuthSegment) {
      router.replace('/auth');

    } else if ((user && token) && inAuthSegment) {
      router.replace('/(tabs)/home');
    }
  }, [user, token, segments, isLoading]);
}