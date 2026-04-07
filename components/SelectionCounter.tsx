import { Text } from "@/components/ui/text";
import { useWagonStore } from "@/stores/wagonStore";
import { View } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

export function SelectionCounter() {
  const count = useWagonStore((state) => state.selectedSeats.size);

  // Небольшая пульсация при изменении счетчика
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withSpring(count > 0 ? 1.05 : 1) }],
    }),
    [count],
  );

  return (
    <View className="flex-row items-center bg-muted/30 px-3 py-1.5 rounded-full border border-border">
      <Animated.View style={animatedStyle} className="flex-row items-center">
        <Text className="text-sm font-medium text-muted-foreground">Выбрано: </Text>
        <Text className={`text-sm font-bold ${count === 4 ? "text-orange-500" : "text-primary"}`}>
          {count} / 4
        </Text>
      </Animated.View>
    </View>
  );
}
