import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import FormField from '@/components/(common)/FormField';
import { riddleSchema } from '@/lib/validationSchemas';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import { useThemeStore } from '@/stores/useThemeStore';
import { DESCRIPTION_MAX_LENGTH, MAP_LATITUDE, MAP_LATITUDE_DELTA, MAP_LONGITUDE, MAP_LONGITUDE_DELTA } from '@/constants/constants';
import { router } from 'expo-router';
import { RiddleFormData } from '@/interfaces/riddle';
import { useCreateRiddle } from '@/hooks/useRiddles';
import FullButton from '@/components/(common)/FullButton';
import Toast from 'react-native-toast-message';


interface FormValues {
  title: string;
  description: string;
  is_private: boolean;
}

export default function RiddleCreateScreen() {
  const { isDark } = useThemeStore();
  const [mapCoordinate, setMapCoordinate] = useState({
    latitude: MAP_LATITUDE,
    longitude: MAP_LONGITUDE,
    latitudeDelta: MAP_LATITUDE_DELTA,
    longitudeDelta: MAP_LONGITUDE_DELTA,
  });

  const createRiddleMutation = useCreateRiddle();

  const onMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMapCoordinate(prev => ({
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

    createRiddleMutation.mutate(data, {
      onSuccess: (data) => {
        Toast.show({
          type: 'success',
          text2: 'Énigme créée !'
        });
        router.replace(`/riddles/${data.id}`);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <SecondaryLayout>
        <View className='py-10'>
          <Formik
            initialValues={{title: '', description: '', is_private: false}}
            validationSchema={riddleSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ handleSubmit, values, setFieldValue, isValid, isSubmitting, errors, touched, setFieldTouched }) => (
              <View className="gap-8">

                {/* --- Privée ou publique --- */}
                <View className="px-6 flex-1 gap-3">
                  <Text className="text-dark dark:text-light font-semibold">Visibilité :</Text>
                  <View className='flex-row'>
                    <TouchableOpacity 
                      onPress={() => {setFieldValue('is_private', false); setFieldTouched('is_private', true, false);}}
                      className="flex-1 flex-row items-center"
                    >
                      <View className={`w-5 h-5 border border-gray-400 rounded-full ${!values.is_private ? 'bg-secondary-darker dark:bg-secondary-lighter' : ''}`} />
                      <Text className="ml-2 text-dark dark:text-light">Publique</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => {setFieldValue('is_private', true); setFieldTouched('is_private', true, false);}}
                      className="flex-1 flex-row items-center"
                    >
                      <View className={`w-5 h-5 border border-gray-400 rounded-full ${values.is_private ? 'bg-secondary-darker dark:bg-secondary-lighter' : ''}`} />
                      <Text className="ml-2 text-dark dark:text-light">Privée</Text>
                    </TouchableOpacity>
                  </View>
                  {touched.is_private && errors.is_private && <Text className="text-red-500 text-sm mt-1">{errors.is_private}</Text>}
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
                    multiline
                    numberOfLines={10}
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    placeholder="Décrivez votre énigme..."
                    style={{ height: 150, textAlignVertical: 'top' }}
                  />
                  <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-right">
                    {DESCRIPTION_MAX_LENGTH - (values.description?.length || 0)} caractères restants
                  </Text>
                </View>

                {/* --- Carte --- */}
                <View className='gap-2'>
                  <Text className='px-6 text-dark dark:text-light font-semibold'>Localisation :</Text>
                  <View className="h-64 overflow-hidden mb-6">
                    <MapView
                      style={{ flex: 1 }}
                      region={mapCoordinate}
                      onRegionChangeComplete={setMapCoordinate}
                      onPress={onMapPress}
                      zoomEnabled={!createRiddleMutation.isPending}
                      scrollEnabled={!createRiddleMutation.isPending}
                    >
                      <Marker coordinate={{ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude }} />
                    </MapView>
                  </View>
                </View>

                {/* --- Erreurs de mutation --- */}
                {/* {createRiddleMutation.isError && (
                  <View className="mx-6 px-6 py-2 bg-red-100 rounded-md">
                    <Text className="text-red-600">
                      {createRiddleMutation.error?.message || "Une erreur est survenue"}
                    </Text>
                  </View>
                )} */}

                {/* --- Bouton de soumission --- */}
                <View className='px-6'>
                  <FullButton
                    onPress={handleSubmit}
                    title="Créer l'énigme"
                    border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                    color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
                    textColor={isDark ? 'text-dark' : 'text-light'}
                    isLoading={isSubmitting || createRiddleMutation.isPending}
                    disabled={isSubmitting || !isValid || createRiddleMutation.isPending}
                  />
                </View>
              </View>
            )}
          </Formik>
        </View>
      </SecondaryLayout>
    </KeyboardAvoidingView>
  );
}