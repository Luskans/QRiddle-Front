import React from 'react';
import { View, FlatList } from 'react-native';
import { Hint } from '@/stores/useHintStore2';
import HintListItem from './HintListItem';

export default function HintList({ hints }: { hints: Hint[] }) {

  return (
    <View className='gap-6'>
      <FlatList
        data={hints}
        renderItem={({ item }) => <HintListItem hint={item} />}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className='mb-4' />}
      />
    </View>
  );
}