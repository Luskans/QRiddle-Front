import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import QrCodeListItem from '@/components/(riddles)/created/QrCodeListItem';
import { StepItem } from '@/stores/useStepStore2';

export default function QrCodeList({ steps }: { steps: StepItem[] }) {

  return (
    <View className='px-6 gap-6'>
      <FlatList
        data={steps}
        renderItem={({ item }) => <QrCodeListItem step={item} />}
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
    gap: 38,
    flexWrap: 'wrap',
    marginBottom: 15,
  }
});