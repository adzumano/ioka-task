import { $api } from "@/config/axios";
import { Carriage } from "@/types/wagon";
import { useQuery } from "@tanstack/react-query";

const fetchCarriage = async (): Promise<Carriage> => {
  const response = await $api.get("/api/travel");

  return response.data;
};

const CARRIAGE_KEY = ["carriage"];

export const useCarriage = () => {
  return useQuery({
    queryKey: CARRIAGE_KEY,
    queryFn: () => fetchCarriage(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
