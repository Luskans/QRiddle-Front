import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';


interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

export default function TabButton({ title, isActive, onPress }: TabButtonProps) {
  // TODO : utiliser useMemo

  return (
    <TouchableOpacity onPress={onPress} className="flex-1 px-4">
      <View className="items-center">
        <Text className={`text-center font-medium py-3 ${isActive ? "text-primary-darker dark:text-primary-lighter" : "text-gray-400 dark:text-gray-400"}`}>
          {title}
        </Text>
        {isActive && (
          <View className="w-14 h-0.5 bg-primary-darker dark:bg-primary-lighter" />
        )}
      </View>
    </TouchableOpacity>
  );
};