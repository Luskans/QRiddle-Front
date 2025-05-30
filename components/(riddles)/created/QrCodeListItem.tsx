import { useThemeStore } from "@/stores/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import colors from '@/constants/colors';
import { StepItem } from "@/interfaces/riddle";


export default function QrCodeListItem({ step }: { step: StepItem }) {
  const { isDark } = useThemeStore();  

  return (
    <TouchableOpacity
        // onPress={() => router.navigate(`/steps/${step.id}/qrcode`)}
        className="relative w-[56px] h-[56px] items-center justify-center"
        accessibilityLabel={`QR Code pour étape ${step.order_number}`}
        accessibilityRole="button"
    >
      <Ionicons name="qr-code-outline" size={56} color={isDark ? colors.light : colors.dark} />
      <View className="absolute inset-0 flex items-center justify-center">
        <Text className="text-lg bg-light dark:bg-dark text-dark dark:text-light px-2 rounded-full font-semibold">{step.order_number}</Text>
      </View>
    </TouchableOpacity>
  );
};