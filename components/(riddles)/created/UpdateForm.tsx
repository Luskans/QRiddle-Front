import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import { FormField } from '@/components/(common)/FormField';
import { riddleSchema } from '@/lib/validationSchemas';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import GradientButton from '@/components/(common)/GradientButton';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { DESCRIPTION_MAX_LENGTH } from '@/constants/constants';
import { RiddleFormData, useRiddleStore } from '@/stores/useRiddleStore2';


interface FormValues {
  title: string;
  description: string;
  is_private: boolean;
  password: string | null;
  status: string;
}

export default function UpdateForm({ riddleId }: { riddleId: string }) {
  const { isDark } = useThemeStore();
  const { updateRiddle } = useRiddleStore();
  const { riddle, isLoading, error } = useRiddleStore(state => state.riddleById[riddleId]);
  const [initialValues, setInitialValues] = useState<FormValues>({
    title: '',
    description: '',
    is_private: false,
    password: null,
    status: 'draft',
  });
  const [mapCoordinate, setMapCoordinate] = useState({
    latitude: 45.041446,
    longitude: 3.883930,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (riddle && riddle.id.toString() === riddleId) {
      setInitialValues({
        title: riddle.title || '',
        description: riddle.description || '',
        is_private: riddle.is_private || false,
        password: riddle.password || null,
        status: riddle.status || 'draft',
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
  }, [riddle, riddleId]);

  const onMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMapCoordinate((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const handleSubmit = async (values: FormValues) => {
    const data: Partial<RiddleFormData> = {
      title: values.title,
      description: values.description,
      is_private: values.is_private,
      password: values.is_private ? values.password : null,
      status: 'draft',
      latitude: String(mapCoordinate.latitude),
      longitude: String(mapCoordinate.longitude),
    };

    const updatedRiddle = await updateRiddle(riddleId, data);

    if (updatedRiddle) {
      // TODO : mettre un toast
      alert('Énigme mise à jour avec succès !');
    } else {
      alert('Échec mise à jour de l\'énigme !');
    }
  };


  if (isLoading && !riddle) {
    return (
      <View>
        <ActivityIndicator size="large" color={isDark ? colors.primary.lighter : colors.primary.darker} />
        <Text className='text-dark dark:text-light'>Chargement des détails...</Text>
      </View>
    );
  }

  if (error && !riddle) {
    return (
      <View>
        <Text className='text-dark dark:text-light'>Erreur : {error}</Text>
      </View>
    );
  }

  if (!riddle) {
    return (
      <View>
        <Text className='text-dark dark:text-light'>Aucune donnée trouvée pour cette énigme.</Text>
      </View>
    );
  }

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
                onPress={() => {
                  setFieldValue('is_private', false);
                  setFieldValue('password', null);
                  setFieldTouched('is_private', true, false); // Marquer comme touché, ne pas valider immédiatement
                }}
                className="flex-1 flex-row items-center py-2"
              >
                <View className={`w-5 h-5 border-2 rounded-full mr-2 flex items-center justify-center ${isDark ? 'border-gray-400' : 'border-gray-500'}`}>
                    {!values.is_private && <View className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-secondary-lighter' : 'bg-secondary-darker'}`} />}
                </View>
                <Text className="text-dark dark:text-light">Publique</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setFieldValue('is_private', true);
                  setFieldTouched('is_private', true, false);
                  console.log("Formik State:", { isValid, errors, values });
                }}
                className="flex-1 flex-row items-center py-2"
              >
                  <View className={`w-5 h-5 border-2 rounded-full mr-2 flex items-center justify-center ${isDark ? 'border-gray-400' : 'border-gray-500'}`}>
                    {values.is_private && <View className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-secondary-lighter' : 'bg-secondary-darker'}`} />}
                </View>
                <Text className="text-dark dark:text-light">Privée</Text>
              </TouchableOpacity>
            </View>
            {/* Afficher l'erreur pour is_private si elle existe */}
            {touched.is_private && errors.is_private && (
                <Text className="text-red-500 text-sm mt-1">{errors.is_private}</Text>
            )}

            {/* Mot de passe (affiché si privé) */}
            {values.is_private && (
              <View className='mt-2'>
                <FormField
                  name="password"
                  placeholder="Entrez un mot de passe"
                  isPassword
                />
              </View>
            )}
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
              {mapCoordinate ? (
                <MapView
                  style={{ flex: 1 }}
                  region={mapCoordinate} // Contrôle la région affichée
                  // initialRegion={mapCoordinate} // Si vous ne voulez pas la contrôler après init
                  onPress={onMapPress}
                  showsUserLocation
                >
                  <Marker coordinate={{ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude }} />
                </MapView>
              ) : (
                <View>
                    {isLoading ? <ActivityIndicator/> : <Text className='text-gray-500 dark:text-gray-400'>Chargement de la carte...</Text>}
                </View>
              )}
            </View>
          </View>

          {/* --- Bouton de soumission --- */}
          <View className='px-6 mt-4'>
            <GradientButton
              onPress={() => handleSubmit()}
              title="Modifier"
              colors={isDark ? [colors.primary.mid, colors.primary.lighter] : [colors.primary.darker, colors.primary.mid]}
              textColor={isDark ? 'text-dark' : 'text-light'}
              isLoading={isSubmitting}
              disabled={!isValid || isSubmitting || !mapCoordinate}
            />
          </View>
        </View>
      )}
    </Formik>
  );
}