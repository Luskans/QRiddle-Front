import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { View, Text } from 'react-native';

export default function MapScreen() {

  useFocusEffect(
      useCallback(() => {
        // TODO : fetch riddles list, les fetch conditionnels lors du détail et pas la card
      }, [])
    );

  return (
    <SecondaryLayout>
      <View>
        <Text>Page Carte</Text>
      </View>
    </SecondaryLayout>
  );
}