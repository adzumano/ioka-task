export interface AirlineCompany {
  code: string;
  name: string;
  logo?: string;
}

export interface Segment {
  id: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  airline: AirlineCompany;
  stops_count: number;
  flight_number: string;
  aircraft_type: string;
}

export interface Offer {
  id: string;
  segments: Segment[];
  price: {
    amount: number;
    currency: string;
  };
  is_baggage_included: boolean;
  baggage_weight?: number;
  refund_policy: "free" | "paid" | "none";
  departure_airport: string;
  arrival_airport: string;
  total_stops: number;
}

export interface FilterState {
  stops: number[] | null; // null = все, иначе массив выбранных
  // stops: (0 | 1 | 2)[] | null; // null = все, иначе массив выбранных
  airlines: string[] | null;
  baggage_only: boolean;
}
