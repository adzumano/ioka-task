import { Order } from "@/types/order";
import { create } from "zustand";

interface CheckoutStore {
  order: Order | null;
  isCreatingOrder: boolean;
  error: string | null;

  setOrder: (order: Order) => void;
  setIsCreatingOrder: (isCreating: boolean) => void;
  setError: (error: string | null) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  order: null,
  isCreatingOrder: false,
  error: null,

  setOrder: (order) => set({ order }),
  setIsCreatingOrder: (isCreating) => set({ isCreatingOrder: isCreating }),
  setError: (error) => set({ error }),
  resetCheckout: () =>
    set({
      order: null,
      isCreatingOrder: false,
      error: null,
    }),
}));
