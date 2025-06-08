import { useThemeStore } from "@/stores/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import colors from '@/constants/colors';
import moment from "moment";
import { useState } from "react";
import { REVIEW_TRUNCATE_LIMIT } from "@/constants/constants";
import { ReviewItem } from "@/interfaces/review";
import { BACKEND_URL } from '@/constants/constants';


export default function ReviewListItem({ review }: { review: ReviewItem }) {
  const { isDark } = useThemeStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = review.content.length > REVIEW_TRUNCATE_LIMIT;
  const userName = review?.user?.name || 'Inconnu';
  const userImage = review?.user?.image || '/default/user.png';

  const toggleTextExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const content = shouldTruncate && !isExpanded
    ? `${review.content.substring(0, REVIEW_TRUNCATE_LIMIT)}...`
    : review.content;

  return (
    <View className="gap-2">

      <View className="flex-row gap-2 items-center">
        <Image 
          source={{ uri:`${BACKEND_URL}${userImage}` }}
          className="h-8 w-8 rounded-full"
          defaultSource={require('@/assets/images/default-user.png')}
        />
        <View className="">
          <Text className="font-semibold text-dark dark:text-light">{userName}</Text>
          <Text className="text-sm text-gray-400 dark:text-gray-400">
            {moment(review.updated_at).isSame(moment(), 'day')
              ? moment(review.updated_at).fromNow()
              : moment(review.updated_at).format('DD-MM-YYYY')}
          </Text>
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
          <Text className="font-h text-gray-400 dark:text-gray-400 text-sm">
            Note :
            <Text className="font-semibold text-secondary-darker dark:text-secondary-lighter"> {review.rating}</Text>
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="trending-up-sharp" size={18} color={isDark ? colors.secondary.lighter : colors.secondary.darker } />
          <Text className="font-h text-gray-400 dark:text-gray-400 text-sm">
            Difficulté :
            <Text className="font-semibold text-secondary-darker dark:text-secondary-lighter"> {review.difficulty}</Text>
          </Text>
        </View>
      </View>

      <View className="self-center m-4 w-[200px] h-[1px] bg-gray-300 dark:bg-gray-600" />

    </View>
  );
};