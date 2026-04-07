import { Text } from "@/components/ui/text";
import { useWagonStore } from "@/stores/wagonStore";
import { Seat } from "@/types/wagon";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface SeatItemProps {
  seat: Seat;
  size: number;
}

export function SeatItem({ seat, size }: SeatItemProps) {
  const selectedSeats = useWagonStore((state) => state.selectedSeats);
  const selectSeat = useWagonStore((state) => state.selectSeat);
  const deselectSeat = useWagonStore((state) => state.deselectSeat);
  const canSelectMore = useWagonStore((state) => state.canSelectMore);

  const isSelected = selectedSeats.has(seat.id);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    if (seat.status === "taken") return;

    if (isSelected) {
      deselectSeat(seat.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSpring(1, { damping: 8 });
    } else {
      if (!canSelectMore()) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      const success = selectSeat(seat);
      if (success) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        scale.value = withSpring(0.95, { damping: 8 });
      }
    }
  };

  const getBgColor = () => {
    if (seat.status === "taken") return "#e5e7eb"; // gray
    if (isSelected) return "#3b82f6"; // blue
    return "#f3f4f6"; // light gray
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        disabled={seat.status === "taken"}
        className="rounded"
        style={{
          width: size,
          height: size,
          backgroundColor: getBgColor(),
          justifyContent: "center",
          alignItems: "center",
          opacity: seat.status === "taken" ? 0.5 : 1,
        }}
      >
        <Text
          className={`text-xs font-semibold ${
            isSelected || seat.status === "taken" ? "text-white" : "text-gray-600"
          }`}
        >
          {seat.id}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
