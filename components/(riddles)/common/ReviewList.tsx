import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { StepState } from '@/stores/useStepStore';
import { Ionicons } from '@expo/vector-icons';
import QrCodeListItem from '../created/QrCodeListItem';
import { Link, useLocalSearchParams } from 'expo-router';
import { useReviewStore } from '@/stores/useReviewStore';
import ReviewListItem from '@/components/riddleDetail/ReviewListItem';

export default function ReviewList() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useThemeStore();
  const { reviewList, isLoading, error, fetchReviewList } = useReviewStore();
  
  useEffect(() => {
    if (id) {
      fetchReviewList(id, { limit: 5 });
    }
  }, [id, fetchReviewList]);
  console.log(reviewList)

  if (isLoading && reviewList.length === 0) {
    return (
      <View className='px-6 flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color={isDark ? colors.primary.lighter : colors.primary.darker} />
      </View>
    );
  }

  if (error) {
    return (
      <View className='px-6'>
        <Text className='text-red-300'>Erreur: {error}</Text>
      </View>
    );
  }

  if (!isLoading && reviewList.length === 0) {
    return (
      <View className='px-6'>
        <Text className='text-dark dark:text-light'>Aucun avis trouvé pour cette énigme.</Text>
      </View>
    );
  }

  return (
    <View className='px-6 gap-6'>
      <FlatList
        data={reviewList}
        renderItem={({ item }) => <ReviewListItem review={item} />}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
      <Link href={`/riddles/${id}/reviews`} asChild className='flex-1 justify-center'>
        <TouchableOpacity className='flex-row items-center gap-1'>
          <Ionicons name="arrow-forward" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
          <Text className='text-secondary-darker dark:text-secondary-lighter'>Voir plus d'avis</Text>
        </TouchableOpacity>
      </Link>
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