import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import colors from '@/constants/colors';
import { StepState } from '@/stores/useStepStore';
import { Ionicons } from '@expo/vector-icons';
import QrCodeListItem from '../created/QrCodeListItem';
import { Link, useLocalSearchParams } from 'expo-router';
import { defaultReviewsByRiddleState, useReviewStore } from '@/stores/useReviewStore2';
import ReviewListItem from '@/components/(riddles)/common/ReviewListItem';

export default function ReviewList({ riddleId }: { riddleId: string }) {
  const { isDark } = useThemeStore();
  const { fetchReviewsByRiddle } = useReviewStore();
  const { reviews, isLoading, error } = useReviewStore(state => state.reviewsByRiddle[riddleId] || defaultReviewsByRiddleState);

  useEffect(() => {
    if (riddleId) {
      // fetchReviewsByRiddle(riddleId, { limit: 5 });
      fetchReviewsByRiddle(riddleId);
    }
  }, [riddleId, fetchReviewsByRiddle]);
  console.log("reviews dans reviewlist", reviews)


  if (isLoading && reviews.length === 0) {
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

  if (!isLoading && reviews.length === 0) {
    return (
      <View className='px-6'>
        <Text className='text-dark dark:text-light'>Aucun avis trouvé pour cette énigme.</Text>
      </View>
    );
  }

  return (
    <View className='px-6 gap-6'>
      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewListItem review={item} />}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
      <Link href={`/reviews/riddle/${riddleId}`} asChild className='flex-1 justify-center'>
        <TouchableOpacity className='flex-row items-center gap-1'>
          <Ionicons name="arrow-forward" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
          <Text className='text-secondary-darker dark:text-secondary-lighter'>Voir plus d'avis</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}