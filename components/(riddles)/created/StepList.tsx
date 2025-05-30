import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import StepListItem from '@/components/(riddles)/created/StepListItem';
import { StepItem } from '@/interfaces/riddle';


export default function StepList({ steps }: { steps: StepItem[] }) {
  // TODO : utiliser useMemo

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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 15,
  }
});