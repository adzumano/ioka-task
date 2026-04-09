import { OFFSET_RIGHT, SECTION_WIDTH, WAGON_GEOMETRY as WG } from "@/lib/constants/wagon";
import { Seat, SeatPosition } from "@/types/wagon";
import { useMemo } from "react";

type UseSeatGridProps = {
  seats: Seat[];
};

export const useSeatGrid = ({ seats }: UseSeatGridProps) => {
  const seatPositions = useMemo<SeatPosition[]>(() => {
    return seats.map((seat) => {
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
  }, [seats]);

  return { seatPositions };
};
