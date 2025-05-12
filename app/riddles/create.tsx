import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Formik } from 'formik';
import { FormField } from '@/components/(common)/FormField';
import { riddleSchema } from '@/lib/validationSchemas';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import GradientButton from '@/components/(common)/GradientButton';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { DESCRIPTION_MAX_LENGTH } from '@/constants/constants';
import { RiddleFormData, useRiddleStore } from '@/stores/useRiddleStore2';
import { router } from 'expo-router';


interface FormValues {
  title: string;
  description: string;
  is_private: boolean;
  password: string | null;
  status: string;
}

export default function CreateScreen() {
  const { isDark } = useThemeStore();
  const { createRiddle } = useRiddleStore();
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
      password: values.is_private ? values.password : null,
      status: 'draft',
      latitude: String(mapCoordinate.latitude),
      longitude: String(mapCoordinate.longitude),
    };

    const newRiddle = await createRiddle(data);

    if (newRiddle) {
      alert('Énigme crée avec succès !');
      router.replace(`/riddles/${newRiddle.id}`);
    } else {
      // Échec : Afficher une alerte ou utiliser l'état d'erreur du store
      Alert.alert('Erreur', 'La création de l\'énigme a échoué.');
      alert('Échec mise à jour de l\'énigme !');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <SecondaryLayout>
        <View className='py-10'>
          <Formik
            initialValues={initialValues}
            validationSchema={riddleSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ handleSubmit, values, setFieldValue, isValid, isSubmitting, errors, touched }) => (
              <View className="gap-8">
                {/* Affichage global des erreurs (si tu as un état d'erreur dans le store pour la création) */}
                {/* {creationError && <Text className="text-red-500">{creationError}</Text>} */}

                {/* Privée ou publique */}
                <View className="px-6 flex-1 gap-3">
                  <Text className="text-dark dark:text-light font-semibold">Visibilité :</Text>
                  <View className='flex-row'>
                    <TouchableOpacity onPress={() => { setFieldValue('is_private', false); setFieldValue('password', null); }} className="flex-1 flex-row items-center">
                      <View className={`w-5 h-5 border border-gray-400 rounded-full ${!values.is_private ? 'bg-secondary-darker dark:bg-secondary-lighter' : ''}`} />
                      <Text className="ml-2 text-dark dark:text-light">Publique</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFieldValue('is_private', true)} className="flex-1 flex-row items-center">
                      <View className={`w-5 h-5 border border-gray-400 rounded-full ${values.is_private ? 'bg-secondary-darker dark:bg-secondary-lighter' : ''}`} />
                      <Text className="ml-2 text-dark dark:text-light">Privée</Text>
                    </TouchableOpacity>
                  </View>
                  {/* Afficher l'erreur pour is_private si touché */}
                  {touched.is_private && errors.is_private && <Text className="text-red-500 text-sm mt-1">{errors.is_private}</Text>}

                  {/* Mot de passe (affiché si privé) */}
                  {values.is_private && (
                    <FormField
                      name="password"
                      placeholder="Entrez un mot de passe"
                      isPassword
                    />
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
                      onPress={onMapPress} // Met à jour au clic
                    >
                      <Marker coordinate={{ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude }} />
                    </MapView>
                  </View>
                </View>

                {/* --- Bouton de soumission --- */}
                <View className='px-6'>
                  <GradientButton
                    onPress={() => handleSubmit()}
                    title="Créer l'énigme"
                    colors={isDark ? [colors.primary.mid, colors.primary.lighter] : [colors.primary.darker, colors.primary.mid]}
                    textColor={isDark ? 'text-dark' : 'text-light'}
                    isLoading={isSubmitting}
                    disabled={isSubmitting || !isValid}
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