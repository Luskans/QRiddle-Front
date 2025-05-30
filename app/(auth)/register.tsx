import React, { useState } from 'react';
import {View, Text, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { Formik } from 'formik';
import { registerSchema } from '@/lib/validationSchemas';
import { RegisterFormData } from '@/interfaces/auth';
import FormField from '@/components/(common)/FormField';
import FullButton from '@/components/(common)/FullButton';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { useAuthStore } from '@/stores/useAuthStore';


export default function RegisterScreen() {
  const { isDark } = useThemeStore();
  const { register, isLoading, error } = useAuthStore();
  const [initialValues, setInitialValues] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (values: RegisterFormData) => {
    if (!acceptedTerms) {
      alert("Vous devez accepter les conditions d'utilisation pour créer un compte.");
      return;
    }
    await register(values.name, values.email, values.password, values.password_confirmation);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <SecondaryLayout>
        <View className='py-10 px-6'>
          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, isValid, isSubmitting, errors, touched }) => (
              <View className="gap-8">

                <FormField
                  name="name"
                  label="Nom :"
                  placeholder="Entrez un nom d'utilisateur"
                  autoCapitalize="none"
                />

                <FormField
                  name="email"
                  label="Email :"
                  placeholder="Entrez votre adresse email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View>
                  <FormField
                    name="password"
                    label="Mot de passe :"
                    placeholder="Créez un mot de passe sécurisé"
                    isPassword
                  />
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Le mot de passe doit contenir au moins 12 caractères, une majuscule, 
                    une minuscule, un chiffre et un caractère spécial.
                  </Text>
                </View>

                <FormField
                  name="password_confirmation"
                  label="Confirmation du mot de passe :"
                  placeholder="Confirmez votre mot de passe"
                  isPassword
                />

                <View className="flex-row items-center mb-6">
                  <TouchableOpacity
                    className="mr-2"
                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                  >
                    <View 
                      className={`w-6 h-6 border rounded ${acceptedTerms ? (isDark ? 'bg-primary-lighter border-primary-lighter' : 'bg-primary-darker border-primary-darker') : 'border-gray-400'} items-center justify-center`}>
                      {acceptedTerms && (
                        <Ionicons name="checkmark" size={18} color={isDark ? colors.dark : colors.light} />
                      )}
                    </View>
                  </TouchableOpacity>
                  <Text className="text-gray-600 dark:text-gray-200 flex-1">
                    J'accepte les{' '}
                    <Text className="text-primary-darker dark:text-primary-lighter underline">
                      conditions d'utilisation
                    </Text>
                    {' '}et la{' '}
                    <Text className="text-primary-darker dark:text-primary-lighter  underline">
                      politique de confidentialité
                    </Text>
                  </Text>
                </View>

                {error && (
                  <View className="px-6 py-2 bg-red-100 border border-red-500 rounded-lg">
                    <Text className="text-red-600">
                      {error || "Une erreur est survenue"}
                    </Text>
                  </View>
                )}

                <View className=''>
                  <FullButton
                    onPress={handleSubmit}
                    title="Créer un compte"
                    border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                    color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
                    textColor={isDark ? 'text-dark' : 'text-light'}
                    isLoading={isSubmitting || isLoading}
                    disabled={isSubmitting || !isValid || isLoading}
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