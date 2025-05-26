import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { useField } from 'formik';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface FormFieldProps extends TextInputProps {
  name: string;
  label?: string;
  isPassword?: boolean;
}

export function FormField({ name, label, isPassword = false, onChangeText, ...props }: FormFieldProps) {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeText = (text: string) => {
    field.onChange(name)(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <View className="">
      {label && (
        <Text className="text-dark dark:text-light mb-2 font-semibold">{label}</Text>
      )}
      <View className="relative">
        <TextInput
          className={`bg-gray-50 border rounded-lg p-3 ${
            meta.touched && meta.error ? 'border-red-500 dark:border-red-400' : 'border-gray-300'
          } ${isPassword ? 'pr-12' : ''}`}
          onChangeText={handleChangeText}
          onBlur={field.onBlur(name)}
          value={field.value}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize='none'
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
      {meta.touched && meta.error && (
        <Text className="text-red-500 dark:text-red-400 text-sm mt-1">{meta.error}</Text>
      )}
    </View>
  );
}