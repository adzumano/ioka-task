import { useCheckoutDetail } from "@/api/useCheckoutDetail";
import ErrorState from "@/components/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Divider from "@/components/ui/divider";
import Loader from "@/components/ui/loader";
import { Text } from "@/components/ui/text";
import { useCheckout } from "@/lib/hooks/useCheckout";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Checkout() {
  const insets = useSafeAreaInsets();
  const { isReady, isCreatingOrder, handlePay } = useCheckout();

  const {
    data: basketDetail,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  } = useCheckoutDetail();

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
          onPress={handlePay}
          disabled={!isReady || isCreatingOrder}
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
