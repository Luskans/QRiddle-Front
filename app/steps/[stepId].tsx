import ConfirmationModal from '@/components/(common)/ConfirmationModal';
import ErrorView from '@/components/(common)/ErrorView';
import FullButton from '@/components/(common)/FullButton';
import GhostButton from '@/components/(common)/GhostButton';
import LoadingView from '@/components/(common)/LoadingView';
import Separator from '@/components/(common)/Separator';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import HintList from '@/components/(steps)/HintList';
import colors from '@/constants/colors';
import { MAP_LATITUDE, MAP_LATITUDE_DELTA, MAP_LONGITUDE, MAP_LONGITUDE_DELTA } from '@/constants/constants';
import { useDeleteStep, useStep, useUpdateStep } from '@/hooks/useSteps';
import { StepFormData } from '@/interfaces/step';
import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import Toast from 'react-native-toast-message';


export default function StepDetailScreen() {
  const { isDark } = useThemeStore();
  const { stepId } = useLocalSearchParams<{ stepId: string }>();
  const { data, isLoading, isError, error } = useStep(stepId);
  const updateStepMutation = useUpdateStep();
  const deleteStepMutation = useDeleteStep();
  const [mapCoordinate, setMapCoordinate] = useState({
    latitude: MAP_LATITUDE,
    longitude: MAP_LONGITUDE,
    latitudeDelta: MAP_LATITUDE_DELTA,
    longitudeDelta: MAP_LONGITUDE_DELTA,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (data) {
      if (data.latitude && data.longitude) {
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
          setMapCoordinate({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          });
        }
      }
    }
  }, [data]);

  const onMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMapCoordinate((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const handleUpdate = async () => {
    const data: StepFormData = {
      latitude: String(mapCoordinate.latitude),
      longitude: String(mapCoordinate.longitude),
    };

    updateStepMutation.mutate({id: stepId, data}, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text2: 'Étape mise à jour !'
        });
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: `${error.response.data.message}`
        });
      },
    });
  };

  const confirmDelete = async () => {
    deleteStepMutation.mutate(stepId), {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text2: 'Étape supprimée.'
        });
        router.dismiss();
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: `${error.response.data.message}`
        });
      },
    };
    setShowDeleteModal(false);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  if (isLoading) {
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

  if (!data) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <ErrorView error="Aucune donnée disponible" />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  return (
    <SecondaryLayout>
      <View className='py-10 gap-6'>
        <Text className='text-dark dark:text-light text-center px-6 font-semibold text-xl'>Etape {data.order_number}</Text>

        <View className="h-64 overflow-hidden">
          <MapView
            style={{ flex: 1 }}
            region={mapCoordinate}
            onRegionChangeComplete={setMapCoordinate}
            onPress={onMapPress}
            zoomEnabled={!updateStepMutation.isPending}
            scrollEnabled={!updateStepMutation.isPending}
          >
            <Marker coordinate={{ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude }} />
          </MapView>
        </View>

        <View className='px-6 flex-1 flex-row gap-3 items-center justify-center'>
          <View className='flex-grow'>
            <GhostButton
              onPress={openDeleteModal}
              title="Supprimer"
              color={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
              textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'}
              isLoading={deleteStepMutation.isPending}
              disabled={deleteStepMutation.isPending}
            />
          </View>

          <View className='flex-grow'>
            <FullButton
              onPress={handleUpdate}
              title="Modifier"
              border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
              color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
              textColor={isDark ? 'text-dark' : 'text-light'}
              isLoading={updateStepMutation.isPending}
              disabled={updateStepMutation.isPending}
            />
          </View>
        </View>

        <Separator />

        {data?.hints?.length > 0 ? (
          <HintList hints={data.hints} />
        ) : (
          <Text className='px-6 text-dark dark:text-light'>Aucun indice pour le moment.</Text>
        )}

        <Link href={`/hints/steps/${stepId}/create`} asChild className='flex-1 justify-center mt-6'>
          <TouchableOpacity className='flex-row items-center gap-1'>
            <Ionicons name="add-circle-outline" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
            <Text className='text-secondary-darker dark:text-secondary-lighter font-semibold'>Ajouter un indice</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Supprimer l'étape"
        message={`Êtes-vous sûr de vouloir supprimer l'étape ${data.order_number} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
        isLoading={deleteStepMutation.isPending}
        isDanger={true}
      />
    </SecondaryLayout>
  );
}