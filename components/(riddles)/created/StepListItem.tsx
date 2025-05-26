import { StepItem } from "@/stores/useStepStore2";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function StepListItem({ step }: { step: StepItem }) {

  return (
    <TouchableOpacity
        onPress={() => router.navigate(`/steps/${step.id}`)}
        className="border border-dark dark:border-light rounded-full px-4 py-2"
        accessibilityRole="button"
    >
      {/* <View className="border border-dark dark:border-light rounded-full px-4 py-2"> */}
        <Text className="text-dark dark:text-light">Etape {step.order_number}</Text>
      {/* </View> */}
    </TouchableOpacity>
  );
};