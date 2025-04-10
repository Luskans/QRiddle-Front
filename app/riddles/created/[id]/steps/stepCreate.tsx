import SecondaryLayout from '@/components/layouts/SecondaryLayout';
import { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import Slider from '@react-native-community/slider';
import { FormField } from '@/components/common/FormField';
import { riddleSchema } from '@/lib/validationSchemas';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import GradientButton from '@/components/common/GradientButton';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { DESCRIPTION_MAX_LENGTH } from '@/constants/constants';
import { useAutoSaveForm, loadFormState, clearFormState } from '@/hooks/useAutoSaveForm';
import { DraftCreate, useRiddleStore } from '@/stores/useRiddleStore';
import { router, useLocalSearchParams } from 'expo-router';
import { useStepStore } from '@/stores/useStepStore';

const STORAGE_KEY = 'createRiddle';

export default function CreateStepScreen() {
  const { id: riddleId } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useThemeStore();
  const { draftCreate, createStep } = useStepStore();
  const [mapCoordinate, setMapCoordinate] = useState({
    latitude: 45.041446,
    longitude: 3.883930,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);


  const onMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMapCoordinate((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const handleSubmit = async () => {
    if (!riddleId) {
      alert("ID de l'énigme manquant.");
      return;
    }

    setIsSubmitting(true);
    const data = {
      latitude: String(mapCoordinate.latitude),
      longitude: String(mapCoordinate.longitude),
    };

    try {
      const newStep = await createStep(riddleId, data);

      if (newStep) {
        alert(`Étape ${newStep.order_number} ajoutée !`);
        router.replace(`/riddles/created/${riddleId}/steps/${newStep.id}`);

      } else {
        alert("La création de l'étape a échoué.");
      }

    } catch (error) {
      console.error("Erreur inattendue lors de la création :", error);
      alert("Une erreur inattendue est survenue.");

    } finally {
       setIsSubmitting(false);
    }
  }

  return (
    <SecondaryLayout>
      <View className='py-10 gap-6'>
        <Text className='text-dark dark:text-light px-6'>
          Placez le marqueur précisément à l'endroit où vous cacherez le QR code pour valider l'étape :
        </Text>

        {/* Carte */}
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

        {/* Bouton de soumission */}
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