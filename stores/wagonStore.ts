import { Carriage, Seat } from "@/types/wagon";
import { create } from "zustand";

interface WagonState {
  carriage: Carriage | null;
  selectedSeats: Map<string, Seat>;
  totalPrice: number;

  selectSeat: (seat: Seat) => boolean; // returns success
  deselectSeat: (seatId: string) => void;
  getTotalPrice: () => number;
  canSelectMore: () => boolean; // макс 4 места
}

const MAX_SEATS = 4;

export const useWagonStore = create<WagonState>((set, get) => ({
  carriage: null,
  selectedSeats: new Map(),
  totalPrice: 0,

  selectSeat: (seat: Seat) => {
    const currentSelected = get().selectedSeats;

    // 1. Бизнес-логика: не более 4 мест
    if (currentSelected.size >= 4) return false;

    // 2. Нельзя выбрать уже занятое (на всякий случай)
    if (seat.status === "taken") return false;

    set((state) => {
      const newMap = new Map(state.selectedSeats);
      newMap.set(seat.id, seat);
      return {
        selectedSeats: newMap,
        totalPrice: state.totalPrice + seat.price,
      };
    });
    return true;
  },

  deselectSeat: (seatId) => {
    set((state) => {
      const newSelected = new Map(state.selectedSeats);
      newSelected.delete(seatId);

      let newPrice = 0;
      newSelected.forEach((s) => {
        const multiplier = state.carriage?.price_multiplier[s.type] || 1;
        newPrice += s.price * multiplier;
      });

      return {
        selectedSeats: newSelected,
        totalPrice: newPrice,
      };
    });
  },

  getTotalPrice: () => get().totalPrice,

  canSelectMore: () => get().selectedSeats.size < MAX_SEATS,
}));

export const useIsSeatSelected = (id: string) =>
  useWagonStore((state) => state.selectedSeats.has(id));
