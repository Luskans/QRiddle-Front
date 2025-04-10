import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { Link, useLocalSearchParams } from 'expo-router';
import StepListItem from '@/components/riddleDetail/StepListItem';
import { StepState } from '@/stores/useStepStore';
import { Ionicons } from '@expo/vector-icons';

export default function StepList({ stepList }: { stepList: StepState["stepList"] }) {
  const { isDark } = useThemeStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  

  if (stepList.isLoading && stepList.steps.length === 0) {
    return (
      <View className='px-6 flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color={isDark ? colors.primary.lighter : colors.primary.darker} />
      </View>
    );
  }

  if (stepList.error) {
    return (
      <View className='px-6'>
        <Text className='text-red-300'>Erreur: {stepList.error}</Text>
      </View>
    );
  }

  if (!stepList.isLoading && stepList.steps.length === 0) {
    return (
      <View className='px-6'>
        <Text className='text-dark dark:text-light'>Aucune étape trouvée pour cette énigme.</Text>
      </View>
    );
  }

  return (
    <View className='px-6 gap-6'>
      <FlatList
        data={stepList.steps}
        renderItem={({ item }) => <StepListItem step={item} />}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        numColumns={4}
        columnWrapperStyle={styles.row}
      />
      <Link href={`/riddles/created/${id}/steps/create`} asChild className='flex-1 justify-center'>
        <TouchableOpacity className='flex-row items-center gap-1'>
          <Ionicons name="add-circle-outline" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
          <Text className='text-secondary-darker dark:text-secondary-lighter'>Ajouter une étape</Text>
        </TouchableOpacity>
      </Link>
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