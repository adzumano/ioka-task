import { useSeatItem } from "@/lib/hooks/useSeatItem";
import { SeatPosition } from "@/types/wagon";
import React, { memo } from "react";
import { G, Rect, Text as SvgText } from "react-native-svg";

export const SeatItem = memo(({ seat, x, y, width, height }: SeatPosition) => {
  const { fillColor, textColor, strokeWidth, seatColor, isTaken, handlePress } = useSeatItem({
    seat,
  });

  return (
    <G transform={`translate(${x}, ${y})`} onPress={handlePress}>
      <Rect
        width={width}
        height={height}
        rx={6}
        fill={fillColor}
        stroke={isTaken ? "#E5E7EB" : seatColor}
        strokeWidth={strokeWidth}
      />
      <SvgText
        x={width / 2}
        y={height / 2 + 5}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill={textColor}
      >
        {seat.id}
      </SvgText>
    </G>
  );
});

SeatItem.displayName = "SeatItem";
