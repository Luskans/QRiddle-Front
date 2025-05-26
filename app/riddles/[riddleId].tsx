import ErrorView from '@/components/(common)/ErrorView';
import LoadingView from '@/components/(common)/LoadingView';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import CommonView from '@/components/(riddles)/common/CommonView';
import CreatedView from '@/components/(riddles)/created/CreatedView';
import { useRiddle } from '@/hooks/useRiddles';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';


export default function RiddleDetailScreen() {
  const [viewType, setViewType] = useState<'created' | 'common'>('common');
  const { riddleId } = useLocalSearchParams<{ riddleId: string }>();
  const { user } = useAuthStore();
  const { data, isLoading, isError, error } = useRiddle(riddleId);
  
  useEffect(() => {
    if (user?.id === data?.creator.id) {
      setViewType('created');
    } else {
      setViewType('common');
    }
  }, [data, user]);

  if (isLoading) {
    return (
      <SecondaryLayout>
        <LoadingView />
      </SecondaryLayout>
    );
  }

  if (isError) {
    return (
      <SecondaryLayout>
        <ErrorView error={ error.message } />
      </SecondaryLayout>
    );
  }

  if (!data) {
    return (
      <SecondaryLayout>
        <ErrorView error="Aucune donnée disponible" />
      </SecondaryLayout>
    );
  }

  if (viewType === 'created') {
    return <CreatedView riddle={data} />
  }

  if (viewType === 'common') {
    return <CommonView riddle={data} />
  }
}