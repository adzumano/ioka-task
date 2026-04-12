import { $api } from "@/config/axios";
import { BASE_PRICE, CURRENCY } from "@/lib/constants/shared";
import { Order } from "@/types/order";
import { useMutation } from "@tanstack/react-query";
import * as ExpoCrypto from "expo-crypto";

type CreateOrderResponse = {
  order: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    external_id: string;
    checkout_url: string;
  };
  order_access_token: string;
};

async function createOrder(): Promise<Order> {
  const { data } = await $api.post<CreateOrderResponse>("/api/orders", {
    amount: BASE_PRICE,
    currency: CURRENCY,
    external_id: ExpoCrypto.randomUUID(),
  });

  return {
    id: data.order.id,
    amount: data.order.amount,
    currency: data.order.currency,
    status: "pending",
    payment_url: data.order.checkout_url,
    created_at: new Date().toISOString(),
  };
}

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder,
  });
};
