import GhostButton from '@/components/(common)/GhostButton';
import GradientButton from '@/components/(common)/GradientButton';
import Separator from '@/components/(common)/Separator';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import HintList from '@/components/(steps)/HintList';
import colors from '@/constants/colors';
import { defaultHintsByStepState, useHintStore } from '@/stores/useHintStore2';
import { defaultStepsByRiddleState, StepFormData, useStepStore } from '@/stores/useStepStore2';
import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';

export default function StepDetailScreen() {
  const { isDark } = useThemeStore();
  const { stepId } = useLocalSearchParams<{ stepId: string }>();
  const { fetchStepById, updateStep, deleteStep } = useStepStore();
  const { step, isLoading: stepLoading, error: stepError } = useStepStore(state => state.stepById[stepId] || defaultStepsByRiddleState);
  const { fetchHintsByStepId, updateHint, deleteHint } = useHintStore();
  const { hints, isLoading: hintLoading, error: hintError } = useHintStore(state => state.hintsByStep[stepId] || defaultHintsByStepState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapCoordinate, setMapCoordinate] = useState({
    latitude: parseFloat(step?.latitude ?? '45.041446'),
    longitude: parseFloat(step?.longitude ?? '3.883930'),
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

   useFocusEffect(
    useCallback(() => {
      if (stepId) {
        fetchStepById(stepId);
        fetchHintsByStepId(stepId);
      }
    }, [stepId, fetchStepById, fetchHintsByStepId])
  );

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
    
    setIsSubmitting(true);
    const newStep = await updateStep(stepId, data);

    if (newStep) {
      alert(`Étape ${newStep.order_number} mise à jour !`);
    } else {
      alert("Échec mise à jour de l'étape !");
    }

    setIsSubmitting(false);
  }

  const handleDelete = async () => {
    const response = await deleteStep(stepId);
    if (response) {
      alert('Étape supprimée')
      router.dismiss();
    } else {
      alert('Erreur suppression de l\'étape')
    }
  };

  if (stepLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (stepError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Erreur : {stepError}</Text>
      </View>
    );
  }

  if (!step) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Aucune étape trouvée.</Text>
      </View>
    );
  }

  return (
    <SecondaryLayout>
      <View className='py-10 gap-6'>
        <Text className='text-dark dark:text-light text-center px-6 font-semibold text-xl'>Etape {step.order_number}</Text>

        <View className="h-64 overflow-hidden">
          <MapView
            style={{ flex: 1 }}
            initialRegion={mapCoordinate}
            onPress={onMapPress}
            showsUserLocation={true}
          >
            <Marker coordinate={{ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude }} />
          </MapView>
        </View>

        <View className='px-6 flex-1 flex-row gap-3 items-center justify-center'>
          <GradientButton
            onPress={() => handleUpdate()}
            title="Modifier"
            colors={isDark ? [colors.primary.mid, colors.primary.lighter] : [colors.primary.darker, colors.primary.mid]}
            textColor={isDark ? 'text-dark' : 'text-light'}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />

          <GhostButton
            onPress={handleDelete}
            title="Supprimer"
            color={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
            textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'}
          />
        </View>

        <Separator />

        {hintLoading && <ActivityIndicator />}
        {hintError && <Text className='text-dark dark:text-light text-center px-6'>{hintError}</Text>}
        {!hintLoading && !hintError && (hints.length === 0) && <Text>Aucun indice pour cette étape.</Text>}
        {!hintLoading && !hintError && (hints.length > 0) && <HintList hints={hints} />}
      
        <Link href={`/hints/steps/${stepId}/create`} asChild className='flex-1 justify-center'>
          <TouchableOpacity className='flex-row items-center gap-1'>
            <Ionicons name="add-circle-outline" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
            <Text className='text-secondary-darker dark:text-secondary-lighter'>Ajouter un indice</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SecondaryLayout>
  );
}