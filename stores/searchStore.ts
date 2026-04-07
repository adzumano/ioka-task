import { FilterState } from '@/types/search'
import { create } from 'zustand'

interface SearchStore {
  filters: FilterState;
  
  // Actions
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  
  // Selectors
  getActiveFiltersCount: () => number;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  filters: {
    stops: null,
    airlines: null,
    baggage_only: false,
  },
  
  setFilters: (updates) => set((state) => ({
    filters: { ...state.filters, ...updates },
  })),
  
  resetFilters: () => set({
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