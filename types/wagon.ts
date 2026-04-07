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
  price_multiplier: {
    lower: 1.0;
    upper: 0.85;
    side: 0.95;
  };
}

export interface TrainInfo {
  id: string;
  carriages: Carriage[];
}

export interface SelectionState {
  selectedSeats: Set<string>;
  totalPrice: number;
}
