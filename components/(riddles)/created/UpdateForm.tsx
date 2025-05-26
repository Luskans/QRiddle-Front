import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import { FormField } from '@/components/(common)/FormField';
import { riddleSchema } from '@/lib/validationSchemas';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import GradientButton from '@/components/(common)/GradientButton';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { DESCRIPTION_MAX_LENGTH, MAP_LATITUDE, MAP_LATITUDE_DELTA, MAP_LONGITUDE, MAP_LONGITUDE_DELTA } from '@/constants/constants';
import { useUpdateRiddle } from '@/hooks/useRiddles';
import { RiddleDetail, RiddleFormData } from '@/interfaces/riddle';


interface FormValues {
  title: string;
  description: string;
  is_private: boolean;
}

export default function RiddleUpdateForm({ riddle }: { riddle: RiddleDetail }) {
  const { isDark } = useThemeStore();
  const [initialValues, setInitialValues] = useState<FormValues>({
    title: '',
    description: '',
    is_private: false,
  });
  const [mapCoordinate, setMapCoordinate] = useState({
    latitude: MAP_LATITUDE,
    longitude: MAP_LONGITUDE,
    latitudeDelta: MAP_LATITUDE_DELTA,
    longitudeDelta: MAP_LONGITUDE_DELTA,
  });

  const updateRiddleMutation = useUpdateRiddle();

  useEffect(() => {
    if (riddle) {
      setInitialValues({
        title: riddle.title || '',
        description: riddle.description || '',
        is_private: riddle.is_private || false,
      });
      if (riddle.latitude && riddle.longitude) {
        const lat = parseFloat(riddle.latitude);
        const lon = parseFloat(riddle.longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
          setMapCoordinate({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    }
  }, [riddle]);

  const onMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMapCoordinate((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const handleSubmit = async (values: FormValues) => {
    const data: RiddleFormData = {
      title: values.title,
      description: values.description,
      is_private: values.is_private,
      latitude: String(mapCoordinate.latitude),
      longitude: String(mapCoordinate.longitude),
    };
    console.log("datas envoyées", data)

    updateRiddleMutation.mutate({id: riddle.id.toString(), data}, {
      onSuccess: (data) => {
        console.log("datas retournées", data);
        alert('Énigme créée avec succès !');
      },
      onError: (error) => {
        alert(`Une erreur est survenue: ${error.message}`);
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={riddleSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ handleSubmit, values, setFieldValue, isValid, isSubmitting, touched, errors, setFieldTouched }) => (
        <View className="gap-8">
          {/* --- Privée ou publique --- */}
          <View className="px-6 flex-1 gap-3">
            <Text className="text-dark dark:text-light font-semibold mb-1">Visibilité :</Text>
            <View className='flex-row'>
              <TouchableOpacity
                onPress={() => {setFieldValue('is_private', false); setFieldTouched('is_private', true, false);}}
                className="flex-1 flex-row items-center py-2"
              >
                <View className={`w-5 h-5 border border-gray-400 rounded-full ${!values.is_private ? 'bg-secondary-darker dark:bg-secondary-lighter' : ''}`} />
                <Text className="ml-2 text-dark dark:text-light">Publique</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {setFieldValue('is_private', true); setFieldTouched('is_private', true, false);}}
                className="flex-1 flex-row items-center py-2"
              >
                <View className={`w-5 h-5 border border-gray-400 rounded-full ${values.is_private ? 'bg-secondary-darker dark:bg-secondary-lighter' : ''}`} />
                <Text className="ml-2 text-dark dark:text-light">Privée</Text>
              </TouchableOpacity>
            </View>
            {touched.is_private && errors.is_private && (<Text className="text-red-500 text-sm mt-1">{errors.is_private}</Text>)}
          </View>

          {/* --- Titre --- */}
          <View className='px-6'>
            <FormField
              name="title"
              label="Titre :"
              placeholder="Entrez le titre de votre énigme"
            />
          </View>

          {/* --- Description --- */}
          <View className='px-6'>
            <FormField
              name="description"
              label="Description :"
              className="bg-gray-50 border border-gray-300 rounded-lg p-3"
              multiline
              numberOfLines={10}
              maxLength={DESCRIPTION_MAX_LENGTH}
              placeholder="Décrivez votre énigme..."
              style={{ height: 150, textAlignVertical: 'top' }}
            />
            <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-right">
              {(values.description ? DESCRIPTION_MAX_LENGTH - values.description.length : DESCRIPTION_MAX_LENGTH)} caractères restants
            </Text>
          </View>

          {/* --- Carte --- */}
          <View className='gap-2'>
            <Text className='px-6 text-dark dark:text-light font-semibold'>Localisation :</Text>
            <View className="h-64 overflow-hidden mx-6 rounded-lg border border-gray-300 dark:border-gray-600">
              <MapView
                style={{ flex: 1 }}
                region={mapCoordinate}
                onRegionChangeComplete={setMapCoordinate}
                onPress={onMapPress}
                zoomEnabled={!updateRiddleMutation.isPending}
                scrollEnabled={!updateRiddleMutation.isPending}
              >
                <Marker coordinate={{ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude }} />
              </MapView>
            </View>
          </View>

          {/* --- Erreurs de mutation --- */}
          {updateRiddleMutation.isError && (
            <View className="mx-6 px-6 py-2 bg-red-100 rounded-md -mb-4">
              <Text className="text-red-600">
                {updateRiddleMutation.error?.message || "Une erreur est survenue"}
              </Text>
            </View>
          )}

          {/* --- Bouton de soumission --- */}
          <View className='px-6 mt-4'>
            <GradientButton
              onPress={() => handleSubmit()}
              title="Modifier"
              colors={isDark ? [colors.primary.mid, colors.primary.lighter] : [colors.primary.darker, colors.primary.mid]}
              textColor={isDark ? 'text-dark' : 'text-light'}
              isLoading={isSubmitting || updateRiddleMutation.isPending}
              disabled={!isValid || isSubmitting || updateRiddleMutation.isPending}
            />
          </View>
        </View>
      )}
    </Formik>
  );
}