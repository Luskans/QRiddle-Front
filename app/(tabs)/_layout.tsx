import { Tabs } from 'expo-router';
import { Entypo, Ionicons } from '@expo/vector-icons';
import colors from "@/constants/colors";
import { useThemeStore } from '@/stores/useThemeStore';


export default function TabsLayout() {
  const { isDark } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? colors.primary.lighter : colors.primary.darker,
        tabBarInactiveTintColor: isDark ? colors.gray.three : colors.gray.four,
        headerShown: false,
        tabBarStyle: {
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
        name="index"
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
        name="profil"
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
