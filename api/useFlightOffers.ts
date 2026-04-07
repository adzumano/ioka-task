import { generateOffers } from "@/constants/offers";
import { getScenario } from "@/lib/mock";
import { Offer } from "@/types/offer";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mock = new AxiosMockAdapter(axios, { delayResponse: 1300 });

mock.onGet("/api/search/flight").reply(() => {
  const scenario = getScenario();

  switch (scenario) {
    case "success":
      return [200, generateOffers({ count: 10000 })];
    case "empty":
      return [200, []];
    case "error":
      return [500, { message: "Internal Server Error", success: false }];
  }
});

const fetchOffers = async (): Promise<Offer[]> => {
  const response = await axios.get("/api/search/flight");

  return response.data;
};

export const useFlightOffers = () => {
  return useQuery({
    queryKey: ["flight-offers"],
    queryFn: () => fetchOffers(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
