import React, { useRef, useState } from 'react';
import { TouchableOpacity, View, Text, LayoutAnimation, Platform, UIManager, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from "@/constants/colors";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  number?: number;
  children: React.ReactNode;
  initialCollapsed?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  number,
  children,
  initialCollapsed = true,
}) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const rotationAnim = useRef(new Animated.Value(initialCollapsed ? 0 : 1)).current;
  const { isDark } = useThemeStore();

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(rotationAnim, {
      toValue: collapsed ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setCollapsed(prev => !prev);
  };

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View className='flex-1'>
      <TouchableOpacity onPress={toggleExpanded} className='bg-gray-100 dark:bg-gray-darker p-6'>
        <View className='flex-row items-center justify-between'>
          <View className='flex-row gap-3'>
            {icon ? (
              //@ts-ignore
              <Ionicons name={icon} size={24} color={collapsed? (isDark ? colors.light : colors.dark) : (isDark ? colors.primary.lighter : colors.primary.darker)} />
            ) : null}
            <Text className={`${collapsed ? "text-dark dark:text-light" : "text-primary-darker dark:text-primary-lighter"} text-lg font-semibold`}>{title}</Text>
          </View>
          <View className='flex-row items-center gap-2'>
            <Text className={`${collapsed ? "text-dark dark:text-light" : "text-primary-darker dark:text-primary-lighter"} text-lg font-semibold`}>{ number }</Text>
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <Ionicons name="chevron-down" size={24} color={collapsed? (isDark ? colors.light : colors.dark) : (isDark ? colors.primary.lighter : colors.primary.darker)} />
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
      {!collapsed && (
        <View className='py-6'>
          {children}
        </View>
      )}
    </View>
  );
};