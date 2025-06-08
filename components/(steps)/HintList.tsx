import React from 'react';
import { View, FlatList } from 'react-native';
import HintListItem from './HintListItem';
import { HintItem } from '@/interfaces/hint';


export default function HintList({ hints }: { hints: HintItem[] }) {
  // TODO : use memo
  
  return (
    <View className='gap-4'>
      {/* <FlatList
        style={{flex: 1}}
        data={hints}
        renderItem={({ item }) => <HintListItem hint={item} />}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className='mb-4' />}
      /> */}
      {hints.map((hint) => (
        <HintListItem key={hint.id} hint={hint} />
      ))}
    </View>
  );
}