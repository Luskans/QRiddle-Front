import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import QrCodeListItem from '@/components/(riddles)/created/QrCodeListItem';
import { Step, StepItem } from '@/stores/useStepStore2';

export default function QrCodeList({ steps }: { steps: StepItem[] }) {
  const { isDark } = useThemeStore();  

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
      {/* <View className='flex-row justify-center'>
        <TouchableOpacity className='flex-row items-center gap-1'>
          <Ionicons name="download-outline" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
          <Text className='text-secondary-darker dark:text-secondary-lighter'>Télécharger les QR codes</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    gap: 38,
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
    marginBottom: 15,
  }
});