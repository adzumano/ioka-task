import { $api } from "@/config/axios";
import { Basket } from "@/types/basket";
import { useQuery } from "@tanstack/react-query";

const fetchCheckoutDetail = async (): Promise<Basket> => {
  const response = await $api.get("/api/checkout");

  return response.data;
};

const BASKET_DETAIL_KEY = ["checkout-detail"];

export const useCheckoutDetail = () => {
  return useQuery({
    queryKey: BASKET_DETAIL_KEY,
    queryFn: () => fetchCheckoutDetail(),
  });
};
