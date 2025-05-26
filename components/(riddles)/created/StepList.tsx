import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { Link } from 'expo-router';
import StepListItem from '@/components/(riddles)/created/StepListItem';
import { Ionicons } from '@expo/vector-icons';
import { StepItem } from '@/stores/useStepStore2';

export default function StepList({ steps }: { steps: {id: number, order_number: number, qr_code: string}[] }) {
  const { isDark } = useThemeStore();  

  return (
    <View className='px-6 gap-6'>
      <FlatList
        data={steps}
        renderItem={({ item }) => <StepListItem step={item} />}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        numColumns={4}
        columnWrapperStyle={styles.row}
      />
      {/* <Link href={`/steps/create`} asChild className='flex-1 justify-center'>
        <TouchableOpacity className='flex-row items-center gap-1'>
          <Ionicons name="add-circle-outline" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
          <Text className='text-secondary-darker dark:text-secondary-lighter'>Ajouter une étape</Text>
        </TouchableOpacity>
      </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    gap: 12,
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
    marginBottom: 15,
  }
});