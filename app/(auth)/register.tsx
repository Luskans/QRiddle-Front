// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
// import { Formik } from 'formik';
// import { registerSchema } from '@/lib/validationSchemas';


// export default function RegisterScreen() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [acceptedTerms, setAcceptedTerms] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = {
//       username: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     };

//     // Username validation
//     if (formData.username.length < 3) {
//       newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
//       isValid = false;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       newErrors.email = 'Adresse email invalide';
//       isValid = false;
//     }

//     // Password validation
//     if (formData.password.length < 8) {
//       newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
//       isValid = false;
//     }

//     // Confirm password validation
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async () => {
//     if (!acceptedTerms) {
//       alert('Veuillez accepter les conditions d\'utilisation');
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Appel API pour l'inscription
//       // const response = await api.register(formData);
      
//       // Envoi email de vérification
//       // await api.sendVerificationEmail(formData.email);
      
//       router.push('/auth/verify-email');
//     } catch (error) {
//       alert('Une erreur est survenue lors de l\'inscription');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       className="flex-1"
//     >
//       <SecondaryLayout>
//         <View className="flex-1 p-6 justify-center pt-20">

//           {/* FORM */}
//           <View className="flex-col gap-4">
//             {/* Username Input */}
//             <View>
//               <Text className="text-gray-700 dark:text-gray-100 mb-2">Nom d'utilisateur</Text>
//               <TextInput
//                 className={`bg-white border ${
//                   errors.username ? 'border-red-400' : 'border-gray-300'
//                 } rounded-lg p-3`}
//                 value={formData.username}
//                 onChangeText={(text) => setFormData({ ...formData, username: text })}
//                 placeholder="Entrez votre nom d'utilisateur"
//               />
//               {errors.username && (
//                 <Text className="text-red-400 text-sm mt-1">{errors.username}</Text>
//               )}
//             </View>

//             {/* Email Input */}
//             <View>
//               <Text className="text-gray-700 dark:text-gray-100 mb-2">Email</Text>
//               <TextInput
//                 className={`bg-white border ${
//                   errors.email ? 'border-red-400' : 'border-gray-300'
//                 } rounded-lg p-3`}
//                 value={formData.email}
//                 onChangeText={(text) => setFormData({ ...formData, email: text })}
//                 placeholder="Entrez votre email"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />
//               {errors.email && (
//                 <Text className="text-red-400 text-sm mt-1">{errors.email}</Text>
//               )}
//             </View>

//             {/* Password Input */}
//             <View>
//               <Text className="text-gray-700 dark:text-gray-100 mb-2">Mot de passe</Text>
//               <View className="relative">
//                 <TextInput
//                   className={`bg-white border ${
//                     errors.password ? 'border-red-400' : 'border-gray-300'
//                   } rounded-lg p-3 pr-12`}
//                   value={formData.password}
//                   onChangeText={(text) => setFormData({ ...formData, password: text })}
//                   placeholder="Entrez votre mot de passe"
//                   secureTextEntry={!showPassword}
//                 />
//                 <TouchableOpacity
//                   className="absolute right-3 top-3"
//                   onPress={() => setShowPassword(!showPassword)}
//                 >
//                   <Ionicons
//                     name={showPassword ? 'eye-off' : 'eye'}
//                     size={24}
//                     color="gray"
//                   />
//                 </TouchableOpacity>
//               </View>
//               {errors.password && (
//                 <Text className="text-red-400 text-sm mt-1">{errors.password}</Text>
//               )}
//             </View>

//             {/* Confirm Password Input */}
//             <View>
//               <Text className="text-gray-700 dark:text-gray-100 mb-2">Confirmer le mot de passe</Text>
//               <TextInput
//                 className={`bg-white border ${
//                   errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
//                 } rounded-lg p-3`}
//                 value={formData.confirmPassword}
//                 onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
//                 placeholder="Confirmez votre mot de passe"
//                 secureTextEntry={!showPassword}
//               />
//               {errors.confirmPassword && (
//                 <Text className="text-red-400 text-sm mt-1">{errors.confirmPassword}</Text>
//               )}
//             </View>

//             {/* Terms Checkbox */}
//             <View className="flex-row items-center mb-6">
//               <TouchableOpacity
//                 className="mr-2"
//                 onPress={() => setAcceptedTerms(!acceptedTerms)}
//               >
//                 <View className={`w-6 h-6 border rounded ${
//                   acceptedTerms ? 'bg-primary-mid border-primary-mid' : 'border-gray-400'
//                 } items-center justify-center`}>
//                   {acceptedTerms && (
//                     <Ionicons name="checkmark" size={18} color="white" />
//                   )}
//                 </View>
//               </TouchableOpacity>
//               <Text className="text-gray-600 dark:text-gray-200 flex-1">
//                 J'accepte les{' '}
//                 <Text className="text-primary-darker dark:text-primary-lighter underline">
//                   conditions d'utilisation
//                 </Text>
//                 {' '}et la{' '}
//                 <Text className="text-primary-darker dark:text-primary-lighter  underline">
//                   politique de confidentialité
//                 </Text>
//               </Text>
//             </View>

//             {/* Submit Button */}
//             <TouchableOpacity
//               className={`rounded-xl py-3 ${
//                 isLoading ? 'bg-gray-300' : 'bg-primary-mid dark:bg-primary-lighter'
//               }`}
//               onPress={handleSubmit}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text className="text-light dark:text-dark text-center font-semibold">
//                   S'inscrire
//                 </Text>
//               )}
//             </TouchableOpacity>
//           </View>

//         </View>
//       </SecondaryLayout>
//     </KeyboardAvoidingView>
//   );
// }



import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { Formik } from 'formik';
import { registerSchema } from '@/lib/validationSchemas';
import { RegisterFormData } from '@/interfaces/auth';
import { FormField } from '@/components/(common)/FormField';
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

                {/* --- Name --- */}
                <FormField
                  name="name"
                  label="Nom :"
                  placeholder="Entrez un nom d'utilisateur"
                  autoCapitalize="none"
                />

                {/* --- Email --- */}
                <FormField
                  name="email"
                  label="Email :"
                  placeholder="Entrez votre adresse email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                {/* --- Password --- */}
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

                {/* --- Password confirmation --- */}
                <FormField
                  name="password_confirmation"
                  label="Confirmation du mot de passe :"
                  placeholder="Confirmez votre mot de passe"
                  isPassword
                />

                {/* --- Terms Checkbox --- */}
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

                {/* --- Butons --- */}
                <View className=''>
                  <FullButton
                    onPress={handleSubmit}
                    title="Créer un compte"
                    border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                    color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
                    textColor={isDark ? 'text-dark' : 'text-light'}
                    isLoading={isSubmitting}
                    disabled={isSubmitting || isValid}
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