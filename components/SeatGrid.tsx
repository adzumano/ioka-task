import { Carriage } from "@/types/wagon";
import { useMemo } from "react";
import { View } from "react-native";
import { SeatItem } from "./SeatItem";

interface SeatGridProps {
  carriage: Carriage;
  seatSize: number;
  gapSize: number;
}

export function SeatGrid({ carriage, seatSize, gapSize }: SeatGridProps) {
  // Мемоизируем абсолютные позиции для оптимизации
  const positionedSeats = useMemo(() => {
    const positions = new Map();

    carriage.seats.forEach((seat, index) => {
      const row = Math.floor(index / carriage.layout.columns);
      const col = index % carriage.layout.columns;

      positions.set(seat.id, {
        top: row * (seatSize + gapSize),
        left: col * (seatSize + gapSize),
      });
    });

    return positions;
  }, [carriage, seatSize, gapSize]);

  const containerHeight = useMemo(() => {
    return (carriage.layout.rows - 1) * (seatSize + gapSize) + seatSize;
  }, [carriage.layout.rows, seatSize, gapSize]);

  // Хак для оптимизации: используем position absolute
  // чтобы избежатьересчета жесткой сетки при селекте одного места
  return (
    <View
      style={{
        height: containerHeight,
        position: "relative",
        marginBottom: 20,
      }}
    >
      {carriage.seats.map((seat) => {
        const pos = positionedSeats.get(seat.id);
        return (
          <View
            key={seat.id}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
            }}
          >
            <SeatItem seat={seat} size={seatSize} />
          </View>
        );
      })}
    </View>
  );
}
