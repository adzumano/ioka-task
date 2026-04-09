import { deduplicateOffers, extractAirlines, filterOffers } from "@/lib/utils";
import { useOfferStore } from "@/stores/offerStore";
import type { Offer } from "@/types/offer";
import { useCallback, useMemo } from "react";

export const useOfferFilters = (offers: Offer[]) => {
  const { filters, setFilters, resetFilters } = useOfferStore();

  const availableAirlines = useMemo(() => extractAirlines(offers), [offers]);

  const baseOffers = useMemo(() => deduplicateOffers(offers), [offers]);

  const filteredOffers = useMemo(() => filterOffers(baseOffers, filters), [baseOffers, filters]);

  const resultCount = useMemo(() => filteredOffers.length, [filteredOffers.length]);

  const toggleStop = useCallback(
    (value: number) => {
      const current = filters.stops ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      setFilters({ stops: next.length > 0 ? next : null });
    },
    [filters.stops, setFilters],
  );

  const toggleAirline = useCallback(
    (code: string) => {
      const current = filters.airlines ?? [];
      const next = current.includes(code) ? current.filter((c) => c !== code) : [...current, code];

      setFilters({ airlines: next.length > 0 ? next : null });
    },
    [filters.airlines, setFilters],
  );

  const isDirectOnly = useMemo(
    () => filters.stops?.length === 1 && filters.stops.includes(0),
    [filters.stops],
  );

  return {
    filters,
    setFilters,
    resetFilters,
    availableAirlines,
    toggleStop,
    toggleAirline,
    resultCount,
    filteredOffers,
    isDirectOnly,
  };
};
