import { useIsSeatSelected, useWagonStore } from "@/stores/wagonStore";
import { Seat } from "@/types/wagon";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  interpolateColor,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type UseSeatItem = {
  seat: Seat;
};

export const useSeatItem = ({ seat }: UseSeatItem) => {
  const isSelected = useIsSeatSelected(seat.id);
  const { selectSeat, deselectSeat, canSelectMore } = useWagonStore();

  const isTaken = seat.status === "taken";
  const seatColor = seat.type === "upper" ? "#10B981" : "#3B82F6";

  const progress = useSharedValue(isSelected ? 1 : 0);

  const [fillColor, setFillColor] = useState(
    isTaken ? "#F3F4F6" : isSelected ? seatColor : "#FFFFFF",
  );
  const [textColor, setTextColor] = useState(
    isTaken ? "#9CA3AF" : isSelected ? "#FFFFFF" : seatColor,
  );
  const [strokeWidth, setStrokeWidth] = useState(isSelected ? 2 : 1.2);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 250 });
    // eslint-disable-next-line
  }, [isSelected]);

  const derivedFill = useDerivedValue(() =>
    isTaken ? "#F3F4F6" : interpolateColor(progress.value, [0, 1], ["#FFFFFF", seatColor]),
  );

  const derivedText = useDerivedValue(() =>
    isTaken ? "#9CA3AF" : interpolateColor(progress.value, [0, 1], [seatColor, "#FFFFFF"]),
  );

  const derivedStroke = useDerivedValue(() => progress.value * 0.8 + 1.2);

  useAnimatedReaction(
    () => derivedFill.value,
    (value) => scheduleOnRN(() => setFillColor(value)),
  );

  useAnimatedReaction(
    () => derivedText.value,
    (value) => scheduleOnRN(() => setTextColor(value)),
  );

  useAnimatedReaction(
    () => derivedStroke.value,
    (value) => scheduleOnRN(() => setStrokeWidth(value)),
  );

  const handlePress = () => {
    if (isTaken) return;

    if (isSelected) {
      deselectSeat(seat.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (canSelectMore()) {
      if (selectSeat(seat)) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return {
    fillColor,
    textColor,
    seatColor,
    isTaken,
    strokeWidth,
    handlePress,
  };
};
