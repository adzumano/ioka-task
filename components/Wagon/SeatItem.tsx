import { useIsSeatSelected, useWagonStore } from "@/stores/wagonStore";
import { SeatPosition } from "@/types/wagon";
import * as Haptics from "expo-haptics";
import React, { memo } from "react";
import { G, Rect, Text as SvgText } from "react-native-svg";

export const SeatItem = memo(({ seat, x, y, width, height }: SeatPosition) => {
  const isSelected = useIsSeatSelected(seat.id);
  const { selectSeat, deselectSeat, canSelectMore } = useWagonStore();

  const isTaken = seat.status === "taken";

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

  const getStrokeColor = () => {
    if (isTaken) return "#E5E7EB";
    if (isSelected) return "#2563EB";
    return seat.type === "upper" ? "#10B981" : "#3B82F6";
  };

  const getFillColor = () => {
    if (isTaken) return "#F3F4F6";
    if (isSelected) return "#DBEAFE";
    return "#FFFFFF";
  };

  const getTextColor = () => {
    if (isTaken) return "#9CA3AF";
    if (isSelected) return "#1E40AF";
    return "#1F2937";
  };

  return (
    <G transform={`translate(${x}, ${y})`} onPress={handlePress}>
      <Rect
        width={width}
        height={height}
        rx={6}
        fill={getFillColor()}
        stroke={getStrokeColor()}
        strokeWidth={isSelected ? 2 : 1.2}
      />
      <SvgText
        x={width / 2}
        y={height / 2 + 5}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill={getTextColor()}
      >
        {seat.id}
      </SvgText>
      {!isTaken && !isSelected && (
        <Rect
          x={width - 4}
          y={2}
          width={2}
          height={2}
          rx={1}
          fill={seat.type === "upper" ? "#10B981" : "#3B82F6"}
          opacity={0.5}
        />
      )}
    </G>
  );
});

SeatItem.displayName = "SeatItem";
