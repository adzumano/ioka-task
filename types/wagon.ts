export type SeatStatus = "available" | "taken" | "selected";
export type SeatType = "lower" | "upper" | "side";

export interface Seat {
  id: string;
  type: SeatType;
  status: SeatStatus;
  price: number;
  position: { x: number; y: number };
}

export interface Carriage {
  id: string;
  number: number;
  type: "economy" | "business" | "sleeper";
  seats: Seat[];
  layout: {
    rows: number;
    columns: number;
  };
}

export type SeatPosition = {
  seat: Seat;
  x: number;
  y: number;
  width: number;
  height: number;
};
