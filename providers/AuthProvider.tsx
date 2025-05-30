import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import LoadingView from '@/components/(common)/LoadingView';


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { user, token, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!(user && token) && !inAuthGroup) {
      router.replace('/(auth)');

    } else if ((user && token) && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, token, segments, isLoading]);

  if (isLoading) {
    return (
      <LoadingView />
    );
  }

  return <>{children}</>;
}