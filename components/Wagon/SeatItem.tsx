import { useSeatItem } from "@/lib/hooks/useSeatItem";
import { SeatPosition } from "@/types/wagon";
import React, { memo } from "react";
import Animated from "react-native-reanimated";
import { G, Rect, Text as SvgText } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedText = Animated.createAnimatedComponent(SvgText);

export const SeatItem = memo(({ seat, x, y, width, height }: SeatPosition) => {
  const { animatedRectProps, animatedTextProps, handlePress } = useSeatItem({
    seat,
  });

  return (
    <G transform={`translate(${x}, ${y})`} onPress={handlePress}>
      <AnimatedRect animatedProps={animatedRectProps} width={width} height={height} rx={6} />

      <AnimatedText
        animatedProps={animatedTextProps}
        x={width / 2}
        y={height / 2 + 5}
        textAnchor="middle"
        fontSize={13}
        fontWeight="600"
      >
        {seat.id}
      </AnimatedText>
    </G>
  );
});

SeatItem.displayName = "SeatItem";
