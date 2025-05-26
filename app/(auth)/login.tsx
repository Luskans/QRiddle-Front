import { KeyboardAvoidingView, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Formik } from 'formik';
import { useAuthStore } from '@/stores/useAuthStore';
import { FormField } from '@/components/(common)/FormField';
import GradientButton from '@/components/(common)/GradientButton';
import { loginSchema } from '@/lib/validationSchemas';
import { router } from 'expo-router';
import colors from '@/constants/colors';
import { useThemeStore } from '@/stores/useThemeStore';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { LoginFormData } from '@/interfaces/auth';


export default function LoginScreen() {
  const { login, error, setError } = useAuthStore();
  const { isDark } = useThemeStore();

  const handleSubmit = async (values: LoginFormData) => {
    await login(values.email, values.password);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <SecondaryLayout>
        <View className="flex-1 px-6 justify-center pt-20">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, isSubmitting, isValid }) => (
              <View className='gap-6'>
                {error && (
                  <View className="p-4 rounded-lg mb-8 bg-red-50 border dark:border-red-400 border-red-500">
                    <Text className="text-red-400 text-center">
                      {error}
                    </Text>
                  </View>
                )}

                <FormField
                  name="email"
                  label="Email"
                  placeholder="Votre email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={() => {
                    setError(null);
                  }}
                />

                <FormField
                  name="password"
                  label="Mot de passe"
                  placeholder="Votre mot de passe"
                  isPassword
                  onChangeText={() => {
                    setError(null);
                  }}
                />

                <TouchableOpacity
                  onPress={() => router.push('/(auth)/forgot-password')}
                  className="self-end mb-4"
                >
                  <Text className="text-gray-700 dark:text-gray-100">
                    Mot de passe oublié ?
                  </Text>
                </TouchableOpacity>

                <GradientButton
                  onPress={() => handleSubmit()}
                  title="Se connecter"
                  colors={isDark ? [colors.primary.mid, colors.primary.lighter] : [colors.primary.darker, colors.primary.mid]}
                  textColor={isDark ? 'text-dark' : 'text-light'}
                  isLoading={isSubmitting}
                  disabled={isSubmitting || !isValid}
                />
              </View>
            )}
          </Formik>
        </View>
      </SecondaryLayout>
    </KeyboardAvoidingView>
  );
}