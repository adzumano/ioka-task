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

  selectSeat: (seat) => {
    const { selectedSeats, carriage } = get();

    // Проверка лимита
    if (selectedSeats.size >= MAX_SEATS) return false;

    // Добавляем место
    const newSelected = new Map(selectedSeats);
    newSelected.set(seat.id, seat);

    // Пересчитываем цену
    let newPrice = 0;
    newSelected.forEach((s) => {
      const multiplier = carriage?.price_multiplier[s.type] || 1;
      newPrice += s.price * multiplier;
    });

    set({
      selectedSeats: newSelected,
      totalPrice: newPrice,
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
