import { KeyboardAvoidingView, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Formik } from 'formik';
import { useAuthStore } from '@/stores/useAuthStore';
import { FormField } from '@/components/(common)/FormField';
import { loginSchema } from '@/lib/validationSchemas';
import { useThemeStore } from '@/stores/useThemeStore';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { LoginFormData } from '@/interfaces/auth';
import FullButton from '@/components/(common)/FullButton';


export default function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();
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

                <FormField
                  name="email"
                  label="Email"
                  placeholder="Votre email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <FormField
                  name="password"
                  label="Mot de passe"
                  placeholder="Votre mot de passe"
                  isPassword
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  // onPress={() => router.push('/(auth)/forgot-password')}
                  className="self-end mb-4"
                >
                  <Text className="text-gray-600 dark:text-gray-200 underline">
                    Mot de passe oublié ?
                  </Text>
                </TouchableOpacity>

                {error && (
                  <View className="px-6 py-2 bg-red-100 border border-red-500 rounded-lg">
                    <Text className="text-red-600">
                      {error || "Une erreur est survenue"}
                    </Text>
                  </View>
                )}

                <FullButton
                  onPress={handleSubmit}
                  title="Se connecter"
                  border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                  color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
                  textColor={isDark ? 'text-dark' : 'text-light'}
                  isLoading={isSubmitting || isLoading}
                  disabled={isSubmitting || isLoading || !isValid}
                />
              </View>
            )}
          </Formik>
        </View>
      </SecondaryLayout>
    </KeyboardAvoidingView>
  );
}