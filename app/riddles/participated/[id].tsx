import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, TextInput, } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function RiddlesParticipatedDetailsScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ScrollView className="flex-1 bg-transparent p-6">
      {/* Title */}
      <Text>Title de l'énigme</Text>

      {/* Creator */}
      <View>
        <View className='flex-row'>
          <Text>Crée par :</Text>
          <Link href="">
            <TouchableOpacity>
              <View></View>
              <Text>Nom de l'auteur</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <Text>xx .xx .xxxx</Text>
      </View>

      {/* Description */}
      <Text>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is
      that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</Text>

      {/* Stats */}
      <View>
        <View>
          <View>
            <Text>number</Text>
            <Text>icone</Text>
          </View>
          <Text>la stat</Text>
        </View>

        <View>
          <View>
            <Text>number</Text>
            <Text>icone</Text>
          </View>
          <Text>la stat</Text>
        </View>

        <View>
          <View>
            <Text>number</Text>
            <Text>icone</Text>
          </View>
          <Text>la stat</Text>
        </View>

        <View>
          <View>
            <Text>number</Text>
            <Text>icone</Text>
          </View>
          <Text>la stat</Text>
        </View>   
      </View>

      {/* Map */}
      <View></View>

      {/* Password */}
      <View>
        <Text className="text-gray-700 dark:text-gray-100 mb-2">Mot de passe</Text>
        <View className="relative">
          <TextInput
            className={`bg-white border ${
              errors.password ? 'border-red-400' : 'border-gray-300'
            } rounded-lg p-3 pr-12`}
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              setErrors({ ...errors, password: '', general: '' });
            }}
            placeholder="Entrez votre mot de passe"
            secureTextEntry={!showPassword}
            autoComplete="password"
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
    </ScrollView>
  );
}