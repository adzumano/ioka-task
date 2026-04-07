import { FilterState } from "@/types/offer";
import { create } from "zustand";

interface OfferState {
  filters: FilterState;

  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  getActiveFiltersCount: () => number;
}

export const useOfferStore = create<OfferState>((set, get) => ({
  filters: {
    stops: null,
    airlines: null,
    baggage_only: false,
  },

  setFilters: (updates) =>
    set((state) => ({
      filters: { ...state.filters, ...updates },
    })),

  resetFilters: () =>
    set({
      filters: { stops: null, airlines: null, baggage_only: false },
    }),

  getActiveFiltersCount: () => {
    const { filters } = get();
    let count = 0;

    if (filters.stops) count += filters.stops.length;
    if (filters.airlines) count += filters.airlines.length;
    if (filters.baggage_only) count += 1;

    return count;
  },
}));
