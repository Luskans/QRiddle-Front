// import React from 'react';
// import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useThemeStore } from '@/stores/useThemeStore';

// export const ThemeToggle = () => {
//   const { isDark, toggleTheme } = useThemeStore();
//   const [rotateValue] = React.useState(new Animated.Value(0));

//   const handlePress = () => {
//     Animated.sequence([
//       Animated.timing(rotateValue, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(rotateValue, {
//         toValue: 0,
//         duration: 0,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     toggleTheme();
//   };

//   const rotation = rotateValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   return (
//     <TouchableOpacity
//       onPress={handlePress}
//       className={`p-2 rounded-full ${
//         isDark ? 'bg-gray-800' : 'bg-gray-100'
//       }`}
//       style={styles.container}
//     >
//       <Animated.View style={{ transform: [{ rotate: rotation }] }}>
//         <Ionicons
//           name={isDark ? 'moon' : 'sunny'}
//           size={24}
//           color={isDark ? '#FDB813' : '#FF8C00'}
//         />
//       </Animated.View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
// });





import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '@/stores/useThemeStore';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();
//   const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
    >
      <Ionicons
        name={isDark ? 'moon' : 'sunny'}
        size={24}
        color={isDark ? '#FDB813' : '#FF8C00'}
      />
    </TouchableOpacity>
  );
};