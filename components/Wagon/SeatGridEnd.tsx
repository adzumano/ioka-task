import { WAGON_GEOMETRY as WG } from "@/lib/constants/wagon";
import React from "react";
import { G, Rect, Text as SvgText } from "react-native-svg";

export default function SeatGridEnd() {
  return (
    <G transform={`translate(${WG.WIDTH - WG.RIGHT_SERVICE_W - 10}, ${WG.TOP_MARGIN})`}>
      <Rect width={50} height={WG.SEAT_H * 2} rx={8} fill="#F9FAFB" stroke="#E5E7EB" />
      <SvgText x={25} y={45} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#9CA3AF">
        WC
      </SvgText>
    </G>
  );
}
