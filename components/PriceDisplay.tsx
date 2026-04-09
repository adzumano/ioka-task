import { Text } from "@/components/ui/text";
import { useWagonStore } from "@/stores/wagonStore";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export function PriceDisplay() {
  const totalPrice = useWagonStore((state) => state.totalPrice);

  const formattedPrice = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(totalPrice);

  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="items-end">
      <Text className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        Итого к оплате
      </Text>
      <Text className="text-xl font-extrabold text-primary text-right">{formattedPrice}</Text>
    </Animated.View>
  );
}
