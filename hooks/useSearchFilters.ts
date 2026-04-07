// hooks/use-offers-filters.ts
import { extractAirlines, filterOffers } from '@/lib/utils'
import { useSearchStore } from '@/stores/searchStore'
import type { Offer } from '@/types/search'
import { useCallback, useMemo } from 'react'

export function useSearchFilters(offers: Offer[]) {
  const { filters, setFilters, resetFilters } = useSearchStore();

  // 1. Извлекаем список доступных авиакомпаний из исходных офферов
  const availableAirlines = useMemo(() => extractAirlines(offers), [offers]);

  // 2. Применяем фильтрацию к офферам
  const filteredOffers = useMemo(() => filterOffers(offers, filters), [offers, filters]);

  // 3. Счётчик подходящих билетов
  const resultCount = filteredOffers.length;

  // 4. Обработчик пересадок
  const toggleStop = useCallback((value: number) => {
    const current = filters.stops ?? [];
    const next = current.includes(value as any)
      ? current.filter((v) => v !== value)
      : [...current, value];
    
    setFilters({ stops: next.length > 0 ? (next as (0 | 1 | 2)[]) : null });
  }, [filters.stops, setFilters]);

  // 5. Обработчик авиакомпаний
  const toggleAirline = useCallback((code: string) => {
    const current = filters.airlines ?? [];
    const next = current.includes(code)
      ? current.filter((c) => c !== code)
      : [...current, code];

    setFilters({ airlines: next.length > 0 ? next : null });
  }, [filters.airlines, setFilters]);

  // Хелпер для определения активен ли режим "Прямой рейс" в популярных фильтрах
  const isDirectOnly = useMemo(() => 
    filters.stops?.length === 1 && filters.stops.includes(0), 
  [filters.stops]);

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
}