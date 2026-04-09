import { OFFSET_RIGHT, SECTION_WIDTH, WAGON_GEOMETRY as WG } from "@/constants/wagon";
import { Carriage, SeatPosition } from "@/types/wagon";
import React, { useMemo } from "react";
import Svg, { Line, Rect } from "react-native-svg";
import { PassageWay } from "./PassageWay";
import SeatGridEnd from "./SeatGridEnd";
import SeatGridStart from "./SeatGridStart";
import { SeatItem } from "./SeatItem";

interface SeatGridProps {
  carriage: Carriage;
}

export function SeatGrid({ carriage }: SeatGridProps) {
  const seatPositions = useMemo<SeatPosition[]>(() => {
    return carriage.seats.map((seat) => {
      const num = parseInt(seat.id);
      let x = 0,
        y = 0,
        w = WG.SEAT_W,
        h = WG.SEAT_H;

      if (num <= 36) {
        const sectionIndex = Math.floor((num - 1) / 4);
        const isRightPair = Math.floor(((num - 1) % 4) / 2) === 1;
        const isUpper = num % 2 === 0;

        x =
          WG.LEFT_SERVICE_W +
          OFFSET_RIGHT +
          sectionIndex * SECTION_WIDTH +
          (isRightPair ? WG.SEAT_W + WG.COMPARTMENT_GAP : 0);

        y = WG.TOP_MARGIN + (isUpper ? 0 : WG.SEAT_H + 2);
        seat.type = isUpper ? "upper" : "lower";
      } else {
        const sectionIndex = 8 - Math.floor((num - 37) / 2);
        const isUpperSide = num % 2 === 0;

        const sideGroupX = WG.LEFT_SERVICE_W + OFFSET_RIGHT + sectionIndex * SECTION_WIDTH;

        w = WG.SEAT_W;
        h = WG.SEAT_H;

        x = isUpperSide ? sideGroupX + w + 4 : sideGroupX;
        y = WG.HEIGHT - WG.BOTTOM_MARGIN - WG.SEAT_H;

        seat.type = isUpperSide ? "upper" : "lower";
      }

      return { seat, x, y, width: w, height: h };
    });
  }, [carriage]);

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
