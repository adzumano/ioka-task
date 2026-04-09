import { OFFSET_RIGHT, SECTION_WIDTH, WAGON_GEOMETRY as WG } from "@/lib/constants/wagon";
import { useSeatGrid } from "@/lib/hooks/ussSeatGrid";
import { Seat } from "@/types/wagon";
import React from "react";
import Svg, { Line, Rect } from "react-native-svg";
import { PassageWay } from "./PassageWay";
import SeatGridEnd from "./SeatGridEnd";
import SeatGridStart from "./SeatGridStart";
import { SeatItem } from "./SeatItem";

interface SeatGridProps {
  seats: Seat[];
}

export function SeatGrid({ seats }: SeatGridProps) {
  const { seatPositions } = useSeatGrid({ seats });

  return (
    <Svg width={WG.WIDTH} height={WG.HEIGHT} viewBox={`0 0 ${WG.WIDTH} ${WG.HEIGHT}`}>
      <Rect
        x={0}
        y={0}
        width={WG.WIDTH}
        height={WG.HEIGHT}
        rx={20}
        fill="white"
        stroke="#E5E7EB"
        strokeWidth={1}
      />
      {Array.from({ length: 10 }).map((_, i) => {
        const lineX = WG.LEFT_SERVICE_W + OFFSET_RIGHT + i * SECTION_WIDTH - WG.GROUP_GAP / 2;
        return (
          <Line key={`divider-${i}`} x1={lineX} y1={0} x2={lineX} y2={WG.HEIGHT} stroke="#E5E7EB" />
        );
      })}
      <SeatGridStart />
      <SeatGridEnd />
      <PassageWay />
      {seatPositions.map((pos) => (
        <SeatItem key={pos.seat.id} {...pos} />
      ))}
    </Svg>
  );
}
