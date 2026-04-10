import { useCheckoutDetail } from "@/api/useCheckoutDetail";
import ErrorState from "@/components/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Divider from "@/components/ui/divider";
import Loader from "@/components/ui/loader";
import { Text } from "@/components/ui/text";
import { useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

async function fetchPaymentSheetParams(): Promise<{
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
}> {
  return fetch(`/api/payment-sheet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export default function Checkout() {
  const insets = useSafeAreaInsets();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const {
    data: basketDetail,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  } = useCheckoutDetail();

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    // Use Mock payment data: https://docs.stripe.com/payments/accept-a-payment?platform=react-native&ui=payment-sheet#react-native-test
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Expo, Inc.",

      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
        email: "jenny.rosen@example.com",
        phone: "888-888-8888",
      },
      returnURL: Linking.createURL("stripe-redirect"),

      // Enable Apple Pay:
      // https://docs.stripe.com/payments/accept-a-payment?platform=react-native&ui=payment-sheet#add-apple-pay
      applePay: {
        merchantCountryCode: "KZ",
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      // Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  if (isLoading || isRefetching) {
    return <Loader text="Загружаем бронирование..." />;
  }

  if (isError || !basketDetail) {
    return (
      <ErrorState
        message={error?.message || "Ошибка при загрузке данных брони"}
        isRefetching={isRefetching}
        onRefetch={refetch}
      />
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top }} className="bg-muted">
      <View className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-3xl font-bold tracking-tight text-foreground">Бронирование</Text>
          <Text className="text-muted-foreground mt-1">Проверьте детали перед оплатой</Text>
        </View>
        <Card className="p-5 border-border shadow-sm">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-lg font-semibold">{basketDetail.title}</Text>
              <Text className="text-muted-foreground mt-1">{basketDetail.date}</Text>
            </View>
            <Badge variant="secondary">
              <Text className="text-xs">{basketDetail.id}</Text>
            </Badge>
          </View>
          <Divider className="my-2" />
          <View className="mt-2 space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Билеты</Text>
              <Text className="font-medium text-foreground">{basketDetail.seats}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Тариф</Text>
              <Text className="font-medium text-foreground">Стандартный</Text>
            </View>
          </View>
        </Card>
        <View className="mt-8 px-1">
          <Text className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Итого к оплате
          </Text>
          <View className="flex-row items-baseline mt-2">
            <Text className="text-4xl font-bold text-foreground">
              {basketDetail.price.toLocaleString()}
            </Text>
            <Text className="text-xl font-semibold text-foreground ml-1">
              {basketDetail.currency}
            </Text>
          </View>
        </View>
      </View>
      <View className="p-4 border-t border-border bg-card">
        <Button
          size="lg"
          className="w-full shadow-md"
          onPress={openPaymentSheet}
          disabled={!loading}
        >
          <Text className="text-primary-foreground font-bold">Оплатить</Text>
        </Button>
        <Text className="text-center text-xs text-muted-foreground mt-3 px-4">
          Нажимая кнопку, вы соглашаетесь с правилами возврата и условиями перевозки
        </Text>
      </View>
    </View>
  );
}
