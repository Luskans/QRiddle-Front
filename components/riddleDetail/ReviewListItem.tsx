import { StepList } from "@/stores/useStepStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";
import colors from '@/constants/colors';
import { Review } from "@/stores/useReviewStore";
import moment from "moment";
import { useCallback, useState } from "react";
import { REVIEW_TRUNCATE_LIMIT } from "@/constants/constants";

const URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '');

export default function ReviewListItem({ review }: { review: Review }) {
  const { isDark } = useThemeStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = review.content.length > REVIEW_TRUNCATE_LIMIT;

  const toggleTextExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const content = shouldTruncate && !isExpanded
    ? `${review.content.substring(0, REVIEW_TRUNCATE_LIMIT)}...`
    : review.content;

  return (
    <View className="gap-2">

      <View className="flex-row gap-2">
        <View className="">
          <Image source={{ uri:`${URL}${review.user.image}`}} resizeMode="cover" className="h-[36px] w-[36px] rounded-full"/>
        </View>
        <View className="">
          <Text className="font-semibold text-dark dark:text-light">{review.user.name}</Text>
          <Text className="text-sm text-gray-400 dark:text-gray-400">{ moment(review.created_at).isSame(moment(), 'day') ? moment(review.created_at).fromNow() : moment(review.created_at).format('DD-MM-YYYY')}</Text>
        </View>
      </View>

      <View>
        <Text className="text-dark dark:text-light">
          {content}
        </Text>
        {shouldTruncate && (
          <TouchableOpacity onPress={toggleTextExpansion}>
            <Text className="underline text-secondary-darker dark:text-secondary-lighter text-sm mt-2">
              {isExpanded ? "Voir moins" : "Voir plus"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row justify-end gap-6">
        <View className="flex-row items-center gap-1">
          <Ionicons name="star-outline" size={14} color={isDark ? colors.secondary.lighter : colors.secondary.darker } />
          <Text className="text-gray-400 dark:text-gray-400 text-sm">
            Note :
            <Text className="font-semibold text-secondary-darker dark:text-secondary-lighter"> {review.rating}</Text>
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="trending-up-sharp" size={18} color={isDark ? colors.secondary.lighter : colors.secondary.darker } />
          <Text className="text-gray-400 dark:text-gray-400 text-sm">
            Difficulté :
            <Text className="font-semibold text-secondary-darker dark:text-secondary-lighter"> {review.difficulty}</Text>
          </Text>
        </View>
      </View>

      <View className="self-center m-4 w-[200px] h-[1px] bg-gray-300 dark:bg-gray-600" />

    </View>
  );
};