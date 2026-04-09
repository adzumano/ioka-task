import { WAGON_GEOMETRY as WG } from "@/constants/wagon";
import React from "react";
import { G, Rect, Text as SvgText } from "react-native-svg";

export default function SeatGridStart() {
  return (
    <G transform={`translate(10, ${WG.TOP_MARGIN})`}>
      <Rect width={50} height={WG.SEAT_H * 2} rx={8} fill="#F9FAFB" stroke="#E5E7EB" />
      <SvgText x={25} y={45} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#9CA3AF">
        WC
      </SvgText>
      <Rect x={60} width={50} height={WG.SEAT_H * 2} rx={8} fill="#F9FAFB" stroke="#E5E7EB" />
      <Rect x={79} y={28} width={12} height={12} rx={6} fill="#D1D5DB" />
      <Rect x={74} y={44} width={22} height={10} rx={4} fill="#D1D5DB" />
    </G>
  );
}
