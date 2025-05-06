// src/screens/CreateScreen.tsx
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Alert } from 'react-native'; // Ajout de Alert
import { Formik } from 'formik';
import Slider from '@react-native-community/slider';
import { FormField } from '@/components/(common)/FormField';
import { riddleSchema } from '@/lib/validationSchemas'; // Assure-toi que ce schéma correspond à RiddleFormData
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import GradientButton from '@/components/(common)/GradientButton';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { DESCRIPTION_MAX_LENGTH } from '@/constants/constants';
import { useAutoSaveForm, loadFormState, clearFormState } from '@/hooks/useAutoSaveForm';
import { RiddleFormData, useRiddleStore } from '@/stores/useRiddleStore'; // Importe RiddleFormData
import { router } from 'expo-router';

const STORAGE_KEY = 'createRiddleDraft'; // Renommé pour clarté

export default function CreateScreen() {
  const { isDark } = useThemeStore();
  // Utilise la fonction createRiddle du nouveau store
  const createRiddle = useRiddleStore(state => state.createRiddle);
  // Optionnel: récupérer l'état de chargement/erreur si tu veux l'afficher
  // const { isLoading, error } = useRiddleStore(state => state.riddleDetail); // Ou un état dédié à la création

  const [initialValues, setInitialValues] = useState<RiddleFormData>({
    title: '',
    description: '',
    is_private: false,
    password: null, // Initialisé à null
    // status: 'draft', // Le statut est géré par le backend à la création ?
    latitude: '45.041446', // Valeurs initiales pour la carte
    longitude: '3.883930',
  });

  const [mapCoordinate, setMapCoordinate] = useState({
    latitude: parseFloat(initialValues.latitude), // Convertir en nombre pour MapView
    longitude: parseFloat(initialValues.longitude),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Charger l'état sauvegardé au montage
  useEffect(() => {
    (async () => {
      const savedState = await loadFormState(STORAGE_KEY);
      if (savedState) {
        setInitialValues(savedState);
        // Mettre à jour les coordonnées de la carte si elles sont dans l'état sauvegardé
        if (savedState.latitude && savedState.longitude) {
          setMapCoordinate(prev => ({
            ...prev,
            latitude: parseFloat(savedState.latitude),
            longitude: parseFloat(savedState.longitude),
          }));
        }
      }
    })();
  }, []);

  // Fonction pour transformer les valeurs avant sauvegarde auto
  const transformForAutoSave = (values: RiddleFormData) => {
    return {
      ...values,
      latitude: String(mapCoordinate.latitude),
      longitude: String(mapCoordinate.longitude),
    };
  };

  // Hook pour la sauvegarde automatique
  // Attention: passer `values` de Formik ici peut causer des re-renders fréquents.
  // Il est souvent mieux de déclencher la sauvegarde manuellement ou via un debounce.
  // Pour l'instant, on le laisse sur initialValues pour l'exemple.
  // useAutoSaveForm(initialValues, STORAGE_KEY, transformForAutoSave);

  // Gérer le clic sur la carte
  const onMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMapCoordinate(prev => ({
      ...prev,
      latitude,
      longitude,
    }));
    // Optionnel: Mettre à jour les valeurs Formik immédiatement si besoin
    // setFieldValue('latitude', String(latitude));
    // setFieldValue('longitude', String(longitude));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (values: RiddleFormData) => {
    // Préparer les données finales, incluant les coordonnées de la carte
    const finalData: RiddleFormData = {
      ...values,
      latitude: String(mapCoordinate.latitude),
      longitude: String(mapCoordinate.longitude),
      // Assurer que password est null si is_private est false
      password: values.is_private ? values.password : null,
    };

    // Appeler la fonction createRiddle du store
    const createdRiddle = await createRiddle(finalData);

    if (createdRiddle) {
      // Succès : Afficher un message, nettoyer le brouillon et naviguer
      Alert.alert('Succès', 'Énigme créée avec succès !'); // Remplacer par un Toast si tu en as un
      await clearFormState(STORAGE_KEY);
      // Naviguer vers la page de détail de l'énigme créée
      router.replace(`/riddles/created/${createdRiddle.id}`);
    } else {
      // Échec : Afficher une alerte ou utiliser l'état d'erreur du store
      Alert.alert('Erreur', 'La création de l\'énigme a échoué.');
      // Tu peux aussi récupérer l'erreur depuis le store si tu l'as stockée
      // const creationError = useRiddleStore.getState().riddleDetail.error; // Ou un état dédié
      // if (creationError) Alert.alert('Erreur', creationError);
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
            enableReinitialize // Important pour mettre à jour si initialValues change (après chargement)
            validationSchema={riddleSchema} // Assure-toi que ce schéma correspond à RiddleFormData
            onSubmit={handleSubmit}
          >
            {/* Utilise les props de Formik */}
            {({ handleSubmit, values, setFieldValue, isValid, isSubmitting, errors, touched }) => (
              <View className="gap-8">
                {/* Affichage global des erreurs (si tu as un état d'erreur dans le store pour la création) */}
                {/* {creationError && <Text className="text-red-500">{creationError}</Text>} */}

                {/* --- Section Privée/Publique --- */}
                <View className="px-6 flex-1 gap-3">
                  <Text className="text-dark dark:text-light">Visibilité :</Text>
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

                {/* --- Section Titre --- */}
                <View className='px-6'>
                  <FormField
                    name="title"
                    label="Titre :"
                    placeholder="Entrez le titre de votre énigme"
                  />
                </View>

                {/* --- Section Description --- */}
                <View className='px-6'>
                  <FormField
                    name="description"
                    label="Description :"
                    multiline
                    numberOfLines={10} // Ajuste si besoin
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    placeholder="Décrivez votre énigme..."
                    style={{ height: 150, textAlignVertical: 'top' }} // Style direct pour multiline
                    // className est appliqué au TextInput via FormField
                  />
                  <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-right">
                    {DESCRIPTION_MAX_LENGTH - (values.description?.length || 0)} caractères restants
                  </Text>
                </View>

                {/* --- Section Carte --- */}
                <View className='gap-2'>
                  <Text className='px-6 text-dark dark:text-light'>Localisation :</Text>
                  <View className="h-64 overflow-hidden mb-6">
                    <MapView
                      style={{ flex: 1 }}
                      region={mapCoordinate} // Utilise region pour contrôler la vue
                      onRegionChangeComplete={setMapCoordinate} // Met à jour quand la région change
                      onPress={onMapPress} // Met à jour au clic
                    >
                      <Marker coordinate={{ latitude: mapCoordinate.latitude, longitude: mapCoordinate.longitude }} />
                    </MapView>
                  </View>
                  {/* Afficher les erreurs pour latitude/longitude si nécessaire */}
                  {touched.latitude && errors.latitude && <Text className="text-red-500 text-sm px-6">{errors.latitude}</Text>}
                  {touched.longitude && errors.longitude && <Text className="text-red-500 text-sm px-6">{errors.longitude}</Text>}
                </View>

                {/* --- Bouton de soumission --- */}
                <View className='px-6'>
                  <GradientButton
                    onPress={() => handleSubmit()} // Utilise le handleSubmit de Formik
                    title="Créer l'énigme"
                    colors={isDark ? [colors.primary.mid, colors.primary.lighter] : [colors.primary.darker, colors.primary.mid]}
                    textColor={isDark ? 'text-dark' : 'text-light'}
                    isLoading={isSubmitting} // Utilise isSubmitting de Formik
                    disabled={isSubmitting || !isValid} // Désactive si soumission en cours ou formulaire invalide
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