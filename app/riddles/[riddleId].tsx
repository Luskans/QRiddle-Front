import ErrorView from '@/components/(common)/ErrorView';
import LoadingView from '@/components/(common)/LoadingView';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import CommonView from '@/components/(riddles)/common/CommonView';
import CreatedView from '@/components/(riddles)/created/CreatedView';
import { useRiddle } from '@/hooks/useRiddles';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';


export default function RiddleDetailScreen() {
  const [viewType, setViewType] = useState<'created' | 'common' | null>(null);
  const { riddleId } = useLocalSearchParams<{ riddleId: string }>();
  const { user } = useAuthStore();
  const { data, isLoading, isError, error } = useRiddle(riddleId);
  
  useEffect(() => {
    if (isLoading) return;
    console.log("id du createur", data?.creator.id)
    console.log("id du user", user?.user?.id)
    console.log("user du store", user)
    if (user?.id === data?.creator?.id) {
      setViewType('created');
    } else {
      setViewType('common');
    }
  }, [data, user]);

  if (isLoading || viewType === null) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <LoadingView />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (isError) {
    return (
      <SecondaryLayoutWithoutScrollView>
        {/* @ts-ignore */}
        <ErrorView error={ error.response.data.message } />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (!data || !user) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <ErrorView error="Aucune donnée disponible" />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  return viewType === 'created'
    ? <CreatedView riddle={data} /> 
    : <CommonView riddle={data} />;
}