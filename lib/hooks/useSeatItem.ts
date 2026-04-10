import { useIsSeatSelected, useWagonStore } from "@/stores/wagonStore";
import { Seat } from "@/types/wagon";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import {
  interpolateColor,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type UseSeatItem = {
  seat: Seat;
};

export const useSeatItem = ({ seat }: UseSeatItem) => {
  const isSelected = useIsSeatSelected(seat.id);
  const { selectSeat, deselectSeat, canSelectMore } = useWagonStore();

  const isTaken = seat.status === "taken";
  const seatColor = seat.type === "upper" ? "#10B981" : "#3B82F6";

  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, {
      duration: 250,
    });
  }, [isSelected]);

  const animatedRectProps = useAnimatedProps(() => ({
    fill: isTaken ? "#F3F4F6" : interpolateColor(progress.value, [0, 1], ["#FFFFFF", seatColor]),
    stroke: isTaken ? "#E5E7EB" : seatColor,
    strokeWidth: progress.value * 0.8 + 1.2,
  }));

  const animatedTextProps = useAnimatedProps(() => ({
    fill: isTaken ? "#9CA3AF" : interpolateColor(progress.value, [0, 1], [seatColor, "#FFFFFF"]),
  }));

  const handlePress = () => {
    if (isTaken) return;

    if (isSelected) {
      deselectSeat(seat.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    if (canSelectMore()) {
      if (selectSeat(seat)) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  return {
    animatedRectProps,
    animatedTextProps,
    isTaken,
    handlePress,
  };
};
