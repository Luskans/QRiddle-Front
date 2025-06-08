import FormField from '@/components/(common)/FormField';
import FullButton from '@/components/(common)/FullButton';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { HINT_MAX_LENGTH } from '@/constants/constants';
import { useCreateHint } from '@/hooks/useHints';
import { HintFormData } from '@/interfaces/hint';
import { hintSchema } from '@/lib/validationSchemas';
import { useThemeStore } from '@/stores/useThemeStore';
import { router, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';


export default function HintCreateScreen() {
  const { stepId } = useLocalSearchParams<{ stepId: string }>();
  const { isDark } = useThemeStore();
  const createHintMutation = useCreateHint();
  const [initialValues, setInitialValues] = useState<HintFormData>({
    type: 'text',
    content: ''
  });

  const handleSubmit = async (values: HintFormData) => {
    createHintMutation.mutate({stepId: stepId, data: values}, {
      onSuccess: (data) => {
        Toast.show({
          type: 'success',
          text2: `Indice ${data.order_number} ajouté !`
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
    });
  };

  return (
    <SecondaryLayout>
      <View className='py-10 gap-6'>
        <Formik
          initialValues={initialValues}
          validationSchema={hintSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleSubmit, values, setFieldValue, isValid, isSubmitting, touched, errors, setFieldTouched }) => (
            <View className="gap-8">
  
              {/* --- Type de contenu --- */}
              <View className="px-6 flex-1 gap-3">
                <Text className="text-dark dark:text-light font-semibold mb-1">Type d'indice :</Text>
                <View className='flex-row'>
                  <TouchableOpacity
                    onPress={() => {
                      setFieldValue('type', 'text');
                    }}
                    className="flex-1 flex-row items-center py-2"
                  >
                    <View className={`w-5 h-5 border-2 rounded-full mr-2 flex items-center justify-center ${isDark ? 'border-gray-400' : 'border-gray-500'}`}>
                        <View className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-secondary-lighter' : 'bg-secondary-darker'}`} />
                    </View>
                    <Text className="text-dark dark:text-light">Texte</Text>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    // onPress={() => {
                    //   setFieldValue('type', 'image');
                    // }}
                    className="flex-1 flex-row items-center py-2"
                  >
                    <View className={`w-5 h-5 border-2 rounded-full mr-2 flex items-center justify-center ${isDark ? 'border-gray-400' : 'border-gray-500'}`}>
                        {/* {!values.type && <View className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-secondary-lighter' : 'bg-secondary-darker'}`} />} */}
                    </View>
                    <Text className="text-gray-400">Image</Text>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    // onPress={() => {
                    //   setFieldValue('type', 'audio');
                    // }}
                    className="flex-1 flex-row items-center py-2"
                  >
                    <View className={`w-5 h-5 border-2 rounded-full mr-2 flex items-center justify-center ${isDark ? 'border-gray-400' : 'border-gray-500'}`}>
                        {/* {!values.type && <View className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-secondary-lighter' : 'bg-secondary-darker'}`} />} */}
                    </View>
                    <Text className="text-gray-400">Audio</Text>
                  </TouchableOpacity>
                </View>
                {/* Afficher l'erreur pour type si elle existe */}
                {touched.type && errors.type && (
                    <Text className="text-red-500 text-sm mt-1">{errors.type}</Text>
                )}
              </View>
  
              {/* --- Contenu --- */}
              <View className='px-6'>
                <Text className="text-dark dark:text-light font-semibold mb-1">Contenu de l'indice :</Text>
                {values.type === 'text' && (
                  <>
                    <FormField
                      name="content"
                      className="bg-gray-50 border border-gray-300 rounded-lg p-3"
                      multiline
                      numberOfLines={10}
                      maxLength={HINT_MAX_LENGTH}
                      placeholder="Entrez un indice pour le joueur puisse trouver le QR code afin de passer à l'étape suivante..."
                      style={{ height: 150, textAlignVertical: 'top' }}
                    />
                    <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-right">
                      {(values.content ? HINT_MAX_LENGTH - values.content.length : HINT_MAX_LENGTH)} caractères restants
                    </Text>
                  </>
                )}
                {/* {values.type === 'image' && (
                  
                )}
                {values.type === 'audio' && (
                  
                )} */}
              </View>
  
              {/* --- Bouton de soumission --- */}
              <View className='px-6'>
                <FullButton
                  onPress={handleSubmit}
                  title="Créer l'indice"
                  border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                  color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
                  textColor={isDark ? 'text-dark' : 'text-light'}
                  isLoading={isSubmitting || createHintMutation.isPending}
                  disabled={isSubmitting || createHintMutation.isPending}
                />
              </View>
  
            </View>
          )}
        </Formik>
      </View>
    </SecondaryLayout>
  );
}