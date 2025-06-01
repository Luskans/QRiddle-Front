import ErrorView from '@/components/(common)/ErrorView';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';

export default function NotFoundScreen() {
  return (
    <SecondaryLayoutWithoutScrollView>
      {/* @ts-ignore */}
      <ErrorView error={ 'Cette page n\'existe pas...' } />
    </SecondaryLayoutWithoutScrollView>
  );
}
