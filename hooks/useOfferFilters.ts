import { deduplicateOffers, extractAirlines, filterOffers } from "@/lib/utils";
import { useOfferStore } from "@/stores/offerStore";
import type { Offer } from "@/types/offer";
import { useCallback, useMemo } from "react";

export const useOfferFilters = (offers: Offer[]) => {
  const { filters, setFilters, resetFilters } = useOfferStore();

  // 1. Извлекаем список доступных авиакомпаний из исходных офферов
  const availableAirlines = useMemo(() => extractAirlines(offers), [offers]);

  const baseOffers = useMemo(() => deduplicateOffers(offers), [offers]);

  // 2. Применяем фильтрацию к офферам
  const filteredOffers = useMemo(() => filterOffers(baseOffers, filters), [baseOffers, filters]);

  // 3. Счётчик подходящих билетов
  const resultCount = useMemo(() => filteredOffers.length, [filteredOffers.length]);

  // 4. Обработчик пересадок
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

  // 5. Обработчик авиакомпаний
  const toggleAirline = useCallback(
    (code: string) => {
      const current = filters.airlines ?? [];
      const next = current.includes(code) ? current.filter((c) => c !== code) : [...current, code];

      setFilters({ airlines: next.length > 0 ? next : null });
    },
    [filters.airlines, setFilters],
  );

  // Хелпер для определения активен ли режим "Прямой рейс" в популярных фильтрах
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
