import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { FilterState, Offer } from '@/types/search'
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getStopsCategory(stops: number): 0 | 1 | 2 {
  if (stops === 0) return 0;
  if (stops === 1) return 1;
  return 2;
}

export function filterOffers(offers: Offer[], filters: FilterState): Offer[] {
  return offers.filter((offer) => {
    // Фильтр по пересадкам
    if (filters.stops) {
      const category = getStopsCategory(offer.total_stops);
      if (!filters.stops.includes(category)) return false;
    }
    
    // Фильтр по авиакомпаниям
    if (filters.airlines && filters.airlines.length > 0) {
      const hasAirline = offer.segments.some((seg) =>
        filters.airlines!.includes(seg.airline.code)
      );
      if (!hasAirline) return false;
    }
    
    // Фильтр по багажу
    if (filters.baggage_only && !offer.is_baggage_included) {
      return false;
    }
    
    return true;
  });
}

// Нормализация: извлечение уникальных авиакомпаний
export function extractAirlines(offers: Offer[]) {
  const airlines = new Map();
  
  offers.forEach((offer) => {
    offer.segments.forEach((segment) => {
      if (!airlines.has(segment.airline.code)) {
        airlines.set(segment.airline.code, segment.airline);
      }
    });
  });
  
  return Array.from(airlines.values());
}

// Обработка дублей (если один сегмент встречается в разных офферах)
export function deduplicateOffers(offers: Offer[]): Offer[] {
  const seen = new Set<string>();
  return offers.filter((offer) => {
    const key = offer.segments.map((s) => s.id).join(',');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}