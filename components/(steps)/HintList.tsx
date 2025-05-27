import React from 'react';
import { View, FlatList } from 'react-native';
import HintListItem from './HintListItem';
import { HintItem } from '@/interfaces/hint';


export default function HintList({ hints }: { hints: HintItem[] }) {

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