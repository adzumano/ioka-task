import { fetchPaymentSheetParams } from "@/api/payment";
import { useCreateOrder } from "@/api/useCreateOrder";
import { toast } from "@/config/sonner";
import * as Sentry from "@sentry/react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useCheckout = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Your Store, Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        returnURL: "iokatask://stripe-redirect",
        applePay: { merchantCountryCode: "KZ" },
        defaultBillingDetails: {
          name: "Zhaslan Karagoishin",
        },
      });

      if (!error) {
        setIsReady(true);
      }
    } catch (e) {
      Sentry.captureException(e);
      toast.error("Ошибка инициализации платежа");
    }
  };

  const handlePay = async () => {
    let currentOrderId = "";

    try {
      const order = await createOrder();
      currentOrderId = order.id;

      const { error } = await presentPaymentSheet();

      if (error) {
        Sentry.captureException(new Error(error.message));
        toast.error(`Ошибка: ${error.code}`);
      } else {
        toast.success("Оплачено!");
        router.replace(`/(tabs)/orders/${currentOrderId}`);
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Произошла системная ошибка");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return {
    isReady,
    isCreatingOrder,
    handlePay,
  };
};
