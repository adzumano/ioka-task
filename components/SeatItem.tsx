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
      // Передаем объект seat в стор
      if (selectSeat(seat)) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } else {
      // Если нельзя выбрать больше 4 мест
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  // --- ЦВЕТОВАЯ ПАЛИТРА ПО ТВОЕМУ ТЗ ---

  // 1. Контур (Stroke)
  // Верхние (upper) — Зеленый, Нижние (lower) — Синий
  const getStrokeColor = () => {
    if (isTaken) return "#E5E7EB"; // Светло-серый для занятых
    if (isSelected) return "#2563EB"; // Ярко-синий при выборе (акцент)
    return seat.type === "upper" ? "#10B981" : "#3B82F6";
  };

  // 2. Заливка (Fill)
  const getFillColor = () => {
    if (isTaken) return "#F3F4F6"; // Серый фон для занятых
    if (isSelected) return "#DBEAFE"; // Светло-голубой фон при выделении
    return "#FFFFFF"; // Белый фон для свободных
  };

  // 3. Цвет текста
  const getTextColor = () => {
    if (isTaken) return "#9CA3AF"; // Серый текст для занятых
    if (isSelected) return "#1E40AF"; // Темно-синий для выбранного
    return "#1F2937"; // Стандартный темный
  };

  return (
    <G transform={`translate(${x}, ${y})`} onPress={handlePress}>
      {/* Прямоугольник полки */}
      <Rect
        width={width}
        height={height}
        rx={6} // Скругление как на скриншоте
        fill={getFillColor()}
        stroke={getStrokeColor()}
        strokeWidth={isSelected ? 2 : 1.2}
      />

      {/* Номер места */}
      <SvgText
        x={width / 2}
        y={height / 2 + 5} // Центрирование текста по вертикали (базовая линия)
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill={getTextColor()}
      >
        {seat.id}
      </SvgText>

      {/* Маленький индикатор цены (опционально, если нужно как на схемах) */}
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
