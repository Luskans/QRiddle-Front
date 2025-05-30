import { LinearGradient } from 'expo-linear-gradient';
import React, { memo } from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';


interface GradientButtonProps {
  onPress: () => void;
  title: string;
  colors: [string, string];
  textColor: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function GradientButton({
  onPress,
  title,
  colors,
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
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className={`px-6 py-3 w-full items-center justify-center ${disabled ? 'opacity-50' : ''}`}
        style={{ borderRadius: 8 }}
      >
        {isLoading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className={`${textColor} font-semibold`} numberOfLines={1}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}