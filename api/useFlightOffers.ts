import { Offer } from "@/types/offer";
import { useQuery } from "@tanstack/react-query";
import { $api } from "./axios";

const fetchOffers = async (): Promise<Offer[]> => {
  const response = await $api.get("/api/search/flight");

  return response.data;
};

const FLIGHT_OFFERS_KEY = ["flight-offers"];

export const useFlightOffers = () => {
  return useQuery({
    queryKey: FLIGHT_OFFERS_KEY,
    queryFn: () => fetchOffers(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
