import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { FilterState, Offer } from "@/types/offer";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const getStopsCategory = (stops: number): 0 | 1 | 2 => {
  if (stops === 0) return 0;
  if (stops === 1) return 1;
  return 2;
};

export const filterOffers = (offers: Offer[], filters: FilterState): Offer[] => {
  return offers.filter((offer) => {
    if (filters.stops) {
      const category = getStopsCategory(offer.total_stops);
      if (!filters.stops.includes(category)) return false;
    }

    if (filters.airlines && filters.airlines.length > 0) {
      const hasAirline = offer.segments.some((seg) => filters.airlines!.includes(seg.airline.code));
      if (!hasAirline) return false;
    }

    if (filters.baggage_only && !offer.is_baggage_included) {
      return false;
    }

    return true;
  });
};

export const extractAirlines = (offers: Offer[]) => {
  const airlines = new Map();

  offers.forEach((offer) => {
    offer.segments.forEach((segment) => {
      if (!airlines.has(segment.airline.code)) {
        airlines.set(segment.airline.code, segment.airline);
      }
    });
  });

  return Array.from(airlines.values());
};

export const deduplicateOffers = (offers: Offer[]): Offer[] => {
  if (!offers || offers.length === 0) return [];

  const sorted = [...offers].sort((a, b) => {
    if (a.price.amount !== b.price.amount) {
      return a.price.amount - b.price.amount;
    }

    return a.is_baggage_included === b.is_baggage_included ? 0 : a.is_baggage_included ? -1 : 1;
  });

  const seen = new Set<string>();

  return sorted.filter((offer) => {
    const segmentsKey = offer.segments.map((s) => s.id).join("|");

    const baggageKey = offer.is_baggage_included ? "Y" : "N";
    const uniqueKey = `${segmentsKey}_${baggageKey}`;

    if (seen.has(uniqueKey)) {
      return false;
    }

    seen.add(uniqueKey);
    return true;
  });
};

export const getTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});
