import { Redirect, Tabs } from 'expo-router';
import { Entypo, Ionicons } from '@expo/vector-icons';
import colors from "@/constants/colors";
import { useThemeStore } from '@/stores/useThemeStore';


export default function TabsLayout() {
  const { isDark } = useThemeStore();

  return (
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: isDark ? colors.primary.mid : colors.primary.darker,
    //     tabBarInactiveTintColor: isDark ? colors.gray.mid : colors.gray.mid,
    //     headerShown: false,
    //     tabBarStyle: {
    //       backgroundColor: isDark ? colors.dark : colors.light,
    //       shadowColor: 'transparent',
    //       // borderRadius: 24,
    //       borderColor: isDark ? colors.primary.mid : colors.primary.darker,
    //       position: 'absolute',
    //       bottom: -10,
    //       height: 64,
    //       // borderLeftWidth: 1,
    //       // borderRightWidth: 1,
    //       elevation: 0, // Supprime l'ombre sur Android
    //       shadowOpacity: 0, // Supprime l'ombre sur iOS
    //     },
    //     // tabBarStyle: {
    //     //   position: 'absolute',
    //     //   bottom: 16,
    //     //   left: 16,
    //     //   right: 16,
    //     //   borderRadius: 24,
    //     //   height: 64,
    //     //   paddingBottom: 8,
    //     //   paddingTop: 8,
    //     //   backgroundColor: 'blue',
    //     //   borderTopWidth: 0,
    //     //   elevation: 8,
    //     //   shadowColor: 'green',
    //     //   shadowOffset: {
    //     //     width: 0,
    //     //     height: 4,
    //     //   },
    //     //   shadowOpacity: 0.1,
    //     //   shadowRadius: 8,
    //     // },
    //     // tabBarStyle: {
    //     //   position: 'absolute',
    //     //   bottom: -10,
    //     //   // left: 16,
    //     //   // right: 16,
    //     //   height: 64,
    //     //   borderRadius: 24,
    //     //   // backgroundColor: 'white',
    //     //   borderTopWidth: 0,
    //     //   elevation: 8,
    //     //   shadowColor: '#000',
    //     //   shadowOffset: {
    //     //     width: 0,
    //     //     height: 4,
    //     //   },
    //     //   shadowOpacity: 0.1,
    //     //   shadowRadius: 8,
    //     //   paddingBottom: 8,
    //     //   // paddingHorizontal: 16,
    //     // },
    //   }}
    // >
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? colors.primary.lighter : colors.primary.darker,
        tabBarInactiveTintColor: isDark ? colors.gray.three : colors.gray.four,
        headerShown: false,
        tabBarStyle: {
          // backgroundColor: isDark ? colors.dark : colors.light,
          backgroundColor: 'transparent',
          shadowColor: 'transparent',
          borderColor: isDark ? colors.primary.lighter : colors.primary.darker,
          height: 52,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Carte',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Énigmes',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="add-to-list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
