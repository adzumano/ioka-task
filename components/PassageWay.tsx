import { endX, passageBottom, passageHeight, passageTop, startX } from "@/constants/wagon";
import React from "react";
import { G, Line, Rect } from "react-native-svg";

export function PassageWay() {
  return (
    <G>
      <Rect x={startX} y={passageTop} width={endX - startX} height={passageHeight} fill="#F9FAFB" />
      <Line
        x1={startX}
        y1={passageTop}
        x2={endX}
        y2={passageTop}
        stroke="#E5E7EB"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <Line
        x1={startX}
        y1={passageBottom}
        x2={endX}
        y2={passageBottom}
        stroke="#E5E7EB"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
    </G>
  );
}
