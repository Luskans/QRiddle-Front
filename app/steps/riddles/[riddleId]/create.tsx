import FullButton from '@/components/(common)/FullButton';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { MAP_LATITUDE, MAP_LATITUDE_DELTA, MAP_LONGITUDE, MAP_LONGITUDE_DELTA } from '@/constants/constants';
import { useCreateStep } from '@/hooks/useSteps';
import { StepFormData } from '@/interfaces/step';
import { useThemeStore } from '@/stores/useThemeStore';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import Toast from 'react-native-toast-message';


export default function StepCreateScreen() {
  const { riddleId } = useLocalSearchParams<{ riddleId: string }>();
  const { isDark } = useThemeStore();
  const [mapCoordinate, setMapCoordinate] = useState({
    latitude: MAP_LATITUDE,
    longitude: MAP_LONGITUDE,
    latitudeDelta: MAP_LATITUDE_DELTA,
    longitudeDelta: MAP_LONGITUDE_DELTA,
  });

  const createStepMutation = useCreateStep();

  const onMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMapCoordinate((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const handleSubmit = async () => {
    const data: StepFormData = {
      latitude: String(mapCoordinate.latitude),
      longitude: String(mapCoordinate.longitude),
    };

    createStepMutation.mutate({riddleId: riddleId, data}, {
      onSuccess: (data) => {
        Toast.show({
          type: 'success',
          text2: `Étape ${data.order_number} ajoutée !`
        });
        router.replace(`/steps/${data.id}`);
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: `${error.response.data.message}`
        });
      },
    });
  }

  return (
    <SecondaryLayout>
      <View className='py-10 gap-6'>
        <Text className='text-dark dark:text-light px-6'>
          Placez le marqueur précisément à l'endroit où vous cacherez le QR code pour valider l'étape :
        </Text>

        <View className="h-[500px] overflow-hidden">
          <MapView
            style={{ flex: 1 }}
            region={mapCoordinate}
            onRegionChangeComplete={setMapCoordinate}
            onPress={onMapPress}
            showsUserLocation={true}
            zoomEnabled={!createStepMutation.isPending}
            scrollEnabled={!createStepMutation.isPending}
          >
            <Marker coordinate={{ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude }} />
          </MapView>
        </View>

        <View className='px-6'>
          <FullButton
            onPress={handleSubmit}
            title="Créer l'étape"
            border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
            color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
            textColor={isDark ? 'text-dark' : 'text-light'}
            isLoading={createStepMutation.isPending}
            disabled={createStepMutation.isPending}
          />
        </View>
      </View>
    </SecondaryLayout>
  );
}