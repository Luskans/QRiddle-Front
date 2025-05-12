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


export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Adresse email invalide';
      isValid = false;
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      alert('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Appel API pour l'inscription
      // const response = await api.register(formData);
      
      // Envoi email de vérification
      // await api.sendVerificationEmail(formData.email);
      
      router.push('/auth/verify-email');
    } catch (error) {
      alert('Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <SecondaryLayout>
        <View className="flex-1 p-6 justify-center pt-20">

          {/* FORM */}
          <View className="flex-col gap-4">
            {/* Username Input */}
            <View>
              <Text className="text-gray-700 dark:text-gray-100 mb-2">Nom d'utilisateur</Text>
              <TextInput
                className={`bg-white border ${
                  errors.username ? 'border-red-400' : 'border-gray-300'
                } rounded-lg p-3`}
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                placeholder="Entrez votre nom d'utilisateur"
              />
              {errors.username && (
                <Text className="text-red-400 text-sm mt-1">{errors.username}</Text>
              )}
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-gray-700 dark:text-gray-100 mb-2">Email</Text>
              <TextInput
                className={`bg-white border ${
                  errors.email ? 'border-red-400' : 'border-gray-300'
                } rounded-lg p-3`}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Entrez votre email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text className="text-red-400 text-sm mt-1">{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-gray-700 dark:text-gray-100 mb-2">Mot de passe</Text>
              <View className="relative">
                <TextInput
                  className={`bg-white border ${
                    errors.password ? 'border-red-400' : 'border-gray-300'
                  } rounded-lg p-3 pr-12`}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  placeholder="Entrez votre mot de passe"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-400 text-sm mt-1">{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View>
              <Text className="text-gray-700 dark:text-gray-100 mb-2">Confirmer le mot de passe</Text>
              <TextInput
                className={`bg-white border ${
                  errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                } rounded-lg p-3`}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                placeholder="Confirmez votre mot de passe"
                secureTextEntry={!showPassword}
              />
              {errors.confirmPassword && (
                <Text className="text-red-400 text-sm mt-1">{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Terms Checkbox */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                className="mr-2"
                onPress={() => setAcceptedTerms(!acceptedTerms)}
              >
                <View className={`w-6 h-6 border rounded ${
                  acceptedTerms ? 'bg-primary-mid border-primary-mid' : 'border-gray-400'
                } items-center justify-center`}>
                  {acceptedTerms && (
                    <Ionicons name="checkmark" size={18} color="white" />
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

            {/* Submit Button */}
            <TouchableOpacity
              className={`rounded-xl py-3 ${
                isLoading ? 'bg-gray-300' : 'bg-primary-mid dark:bg-primary-lighter'
              }`}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-light dark:text-dark text-center font-semibold">
                  S'inscrire
                </Text>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </SecondaryLayout>
    </KeyboardAvoidingView>
  );
}