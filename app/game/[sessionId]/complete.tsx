import ErrorView from '@/components/(common)/ErrorView';
import LoadingView from '@/components/(common)/LoadingView';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import colors from '@/constants/colors';
import {  DESCRIPTION_MAX_LENGTH } from '@/constants/constants';
import { useCompleteSession } from '@/hooks/useGame';
import { useThemeStore } from '@/stores/useThemeStore';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import { ReviewFormData } from '@/interfaces/review';
import { useCreateReview } from '@/hooks/useReviews';
import { reviewSchema } from '@/lib/validationSchemas';
import FormField from '@/components/(common)/FormField';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import { getFormattedDuration } from '@/lib/getFormattedDuration';
import FullButton from '@/components/(common)/FullButton';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import Toast from 'react-native-toast-message';
import GhostButton from '@/components/(common)/GhostButton';


export default function CompleteScreen() {
  const { isDark } = useThemeStore();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { data, isLoading, isError, error } = useCompleteSession(sessionId);
  const createReviewMutation = useCreateReview();

  const handleSubmit = async (values: ReviewFormData) => {
    if (!data) return;

    createReviewMutation.mutate({riddleId: data.riddle_id.toString(), data: values}, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text2: 'Avis publié !'
        });
        router.navigate(`/(tabs)`);
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

  if (isLoading) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <LoadingView />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (isError) {
    return (
      <SecondaryLayoutWithoutScrollView>
        {/* @ts-ignore */}
        <ErrorView error={ error.response.data.message } />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (!data) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <ErrorView error="Aucune donnée disponible" />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <SecondaryLayout>
        <View className='py-10 gap-10'>

          <View className='gap-6 px-6'>
            <Text className='font-h text-dark dark:text-light font-semibold text-4xl text-center'>Félicitations !</Text>
            
            <View className='gap-2'>
              <Text className='text-dark dark:text-light text-center'>Vous êtes arrivés au bout de l'énigme en :</Text>
              <Text className='text-secondary-darker dark:text-secondary-lighter text-center text-2xl font-semibold'>{moment.utc(data.duration * 1000).format("HH:mm:ss")}</Text>
            </View>

            <View className='gap-2'>
              <Text className='text-dark dark:text-light text-center'>Score final :</Text>
              <Text className='text-secondary-darker dark:text-secondary-lighter text-center text-2xl font-semibold'>{data.score}</Text>
            </View>
          </View>

          <View className='bg-gray-100 dark:bg-gray-darker px-6 py-10 gap-6'>
            {data.session_steps.map((step, index) => (
              <View key={index} className='flex-row justify-between items-center'>
                <Text className='text-dark dark:text-light'>Étape {index + 1}</Text>
                <Text className='text-secondary-darker dark:text-secondary-lighter'>{ getFormattedDuration(step.start_time, step.end_time) }</Text>
                <Text className='text-dark dark:text-light'>
                  Indices utilisés :
                    <Text className='text-secondary-darker dark:text-secondary-lighter'> {step.extra_hints + 1}</Text>
                </Text>
              </View>
            ))}
          </View>

          <Text className='font-h px-6 text-dark dark:text-light font-semibold text-2xl font-bold'>Laissez un avis</Text>
          
          <Formik
            initialValues={{ rating: 0, difficulty: 0, content: '' }}
            validationSchema={reviewSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, setFieldValue, values, isValid, isSubmitting }) => (
              <View className="gap-8">

                {/* Rating */}
                <View className='px-6 gap-4'>
                  <View className='flex-row gap-3'>
                    <Text className="text-dark dark:text-light font-semibold">Note :</Text>
                    <Text className="text-secondary-darker dark:text-secondary-lighter font-bold">{values.rating}</Text>
                  </View>
                  <Slider
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={values.rating}
                    onValueChange={(value) => setFieldValue('rating', value)}
                    minimumTrackTintColor={isDark ? colors.secondary.lighter : colors.secondary.darker}
                    maximumTrackTintColor={isDark ? colors.gray.four : colors.gray.five}
                    thumbTintColor={isDark ? colors.secondary.lighter : colors.secondary.darker}
                  />
                </View>

                {/* Difficulty */}
                <View className='px-6 gap-4'>
                  <View className='flex-row gap-3'>
                    <Text className="text-dark dark:text-light font-semibold">Difficulté :</Text>
                    <Text className="text-secondary-darker dark:text-secondary-lighter font-bold">{values.difficulty}</Text>
                  </View>
                  <Slider
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={values.difficulty}
                    onValueChange={(value) => setFieldValue('difficulty', value)}
                    minimumTrackTintColor={isDark ? colors.secondary.lighter : colors.secondary.darker}
                    maximumTrackTintColor={isDark ? colors.gray.four : colors.gray.five}
                    thumbTintColor={isDark ? colors.secondary.lighter : colors.secondary.darker}
                  />
                </View>

                {/* --- Description --- */}
                <View className='px-6'>
                  <FormField
                    name="content"
                    label="Commentaire :"
                    multiline
                    numberOfLines={10}
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    placeholder="Veuillez ne pas spoiler des parties de l'énigme..."
                    style={{ height: 150, textAlignVertical: 'top' }}
                  />
                  <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-right">
                    {DESCRIPTION_MAX_LENGTH - (values.content?.length || 0)} caractères restants
                  </Text>
                </View>

                {/* --- Erreurs de mutation --- */}
                {/* {createReviewMutation.isError && (
                  <View className="mx-6 px-6 py-2 bg-red-100 rounded-md">
                    <Text className="text-red-600">
                      {createReviewMutation.error?.message || "Une erreur est survenue"}
                    </Text>
                  </View>
                )} */}

                {/* --- Bouton de soumission --- */}
                <View className='px-6 flex-1'>
                  {data.has_reviewed ? (
                    <GhostButton
                      onPress={() => router.navigate('/(tabs)')}
                      title="Accueil"
                      color={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                      textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'}
                    />
                  ) : (
                    <FullButton
                      onPress={handleSubmit}
                      title="Publier votre avis"
                      border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                      color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
                      textColor={isDark ? 'text-dark' : 'text-light'}
                      isLoading={isSubmitting || createReviewMutation.isPending}
                      disabled={isSubmitting || !isValid || createReviewMutation.isPending}
                    />
                  )}
                </View>
              </View>
            )}
          </Formik>

        </View>
      </SecondaryLayout>
    </KeyboardAvoidingView>
  )
}