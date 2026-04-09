import { Carriage, Seat } from "@/types/wagon";

export const BASE_PRICE = 11250;

const generateSeats = (count: number): Seat[] => {
  const seats: Seat[] = [];
  for (let i = 1; i <= count; i++) {
    seats.push({
      id: i.toString(),
      type: "lower",
      status: i % 7 === 0 ? "taken" : "available",
      price: BASE_PRICE,
      position: { x: 0, y: 0 },
    });
  }
  return seats;
};

export const generateCarriage = (): Carriage => ({
  id: "c-101",
  number: 5,
  type: "economy",
  layout: {
    rows: 9,
    columns: 6,
  },
  seats: generateSeats(54),
});

export const WAGON_GEOMETRY = {
  // Общая длина вагона (Svg width)
  WIDTH: 1030,
  // Общая высота вагона (Svg height)
  HEIGHT: 280,

  // Размеры одной полки (купейной)
  SEAT_W: 36,
  SEAT_H: 50,

  // Отступы
  COMPARTMENT_GAP: 4, // Расстояние между полками в купе
  GROUP_GAP: 15, // Расстояние между купе (столик)
  SIDE_GROUP_GAP: 20, // Расстояние между блоками боковушек

  // Служебные зоны
  LEFT_SERVICE_W: 120, // WC + Проводник слева
  RIGHT_SERVICE_W: 60, // WC справа

  TOP_MARGIN: 20, // Отступ сверху до первых полок
  BOTTOM_MARGIN: 20, // Отступ снизу до боковых полок
};

export const startX = 130;
export const passageTop = WAGON_GEOMETRY.TOP_MARGIN + WAGON_GEOMETRY.SEAT_H * 2 + 24;
export const passageBottom =
  WAGON_GEOMETRY.HEIGHT - WAGON_GEOMETRY.BOTTOM_MARGIN - WAGON_GEOMETRY.SEAT_H - 16;
export const passageHeight = passageBottom - passageTop;
export const endX = WAGON_GEOMETRY.WIDTH - WAGON_GEOMETRY.RIGHT_SERVICE_W - 20;

export const OFFSET_RIGHT = 18;
export const SECTION_WIDTH =
  WAGON_GEOMETRY.SEAT_W * 2 + WAGON_GEOMETRY.COMPARTMENT_GAP + WAGON_GEOMETRY.GROUP_GAP;
