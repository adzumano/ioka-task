import { Carriage, Seat } from "@/types/wagon";

const BASE_PRICE = 12000;

const generateSeats = (rows: number, cols: number): Seat[] => {
  const seats: Seat[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const seatNumber = row * cols + col + 1;

      // Логика определения типа места (упрощенная для примера)
      // В реальном вагоне четные обычно верхние, нечетные - нижние
      let type: "lower" | "upper" | "side" = "lower";
      if (col === 2) {
        type = "side"; // Допустим, третья колонка — это боковые места
      } else if (seatNumber % 2 === 0) {
        type = "upper";
      }

      // Расчет цены с учетом множителя
      const multipliers = { lower: 1.0, upper: 0.85, side: 0.95 };
      const finalPrice = Math.round(BASE_PRICE * multipliers[type]);

      seats.push({
        id: seatNumber.toString(),
        type: type,
        // Каждое 5-е место занято для реалистичности
        status: seatNumber % 5 === 0 ? "taken" : "available",
        price: finalPrice,
        position: { x: col, y: row },
      });
    }
  }
  return seats;
};

export const MOCK_CARRIAGE: Carriage = {
  id: "c-101",
  number: 5,
  type: "economy",
  layout: {
    rows: 9, // 9 "отсеков"
    columns: 3, // 2 полки в купе + 1 боковая (упрощенно)
  },
  seats: generateSeats(9, 3),
  price_multiplier: {
    lower: 1.0,
    upper: 0.85,
    side: 0.95,
  },
};
