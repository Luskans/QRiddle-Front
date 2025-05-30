import React, { memo } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';


interface GradientButtonProps {
  onPress: () => void;
  title: string;
  border: string;
  color: string;
  textColor: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function FullButton({
  onPress,
  title,
  border,
  color,
  textColor,
  isLoading = false,
  disabled = false,
}: GradientButtonProps) {

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || disabled}
      className="overflow-hidden"
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled }}
    >
      <View className={`px-6 py-3 items-center justify-center ${color} border ${border} rounded-lg ${disabled ? 'opacity-50' : ''}`} >
        {isLoading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className={`${textColor} font-semibold`} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}