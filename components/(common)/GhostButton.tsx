import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface GhostButtonProps {
  onPress: () => void;
  title: string;
  color: string;
  textColor: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function GhostButton({
  onPress,
  title,
  color,
  textColor,
  isLoading = false,
  disabled = false,
}: GhostButtonProps) {

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || disabled}
      className="overflow-hidden"
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled }}
    >
      <View className={`px-6 py-3 items-center justify-center bg-transparent border ${color} rounded-lg ${disabled ? 'opacity-50' : ''}`} >
        {isLoading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className={`${textColor} font-semibold`}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}