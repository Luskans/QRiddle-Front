import GradientButton from '@/components/(common)/GradientButton';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import colors from '@/constants/colors';
import { StepFormData, useStepStore } from '@/stores/useStepStore2';
import { useThemeStore } from '@/stores/useThemeStore';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';

export default function StepCreateScreen() {
  const { riddleId } = useLocalSearchParams<{ riddleId: string }>();
  const { isDark } = useThemeStore();
  const { createStep } = useStepStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapCoordinate, setMapCoordinate] = useState({
    latitude: 45.041446,
    longitude: 3.883930,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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
    
    setIsSubmitting(true);
    const newStep = await createStep(riddleId, data);

    if (newStep) {
      alert(`Étape ${newStep.order_number} ajoutée !`);
      router.replace(`/steps/${newStep.id}`);
    } else {
      alert("Échec création de l'étape !");
    }

    setIsSubmitting(false);
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
            initialRegion={mapCoordinate}
            onPress={onMapPress}
            showsUserLocation={true}
          >
            <Marker coordinate={{ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude }} />
          </MapView>
        </View>

        <View className='px-6'>
          <GradientButton
            onPress={() => handleSubmit()}
            title="Créer"
            colors={isDark ? [colors.primary.mid, colors.primary.lighter] : [colors.primary.darker, colors.primary.mid]}
            textColor={isDark ? 'text-dark' : 'text-light'}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </SecondaryLayout>
  );
}