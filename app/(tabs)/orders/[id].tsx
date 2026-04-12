import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Divider from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderDetail() {
  const insets = useSafeAreaInsets();
  const { id, failed } = useLocalSearchParams<{ id: string; failed?: string }>();
  const router = useRouter();
  const isSuccess = !failed;

  return (
    <View style={{ flex: 1, paddingTop: insets.top }} className="bg-muted">
      <View className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-3xl font-bold tracking-tight text-foreground">
            {isSuccess ? "Заказ оформлен" : "Оплата не прошла"}
          </Text>
          <Text className="text-muted-foreground mt-1">
            {isSuccess ? "Ваш билет успешно забронирован" : "Попробуйте оплатить ещё раз"}
          </Text>
        </View>

        <Card className="p-5 border-border shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Детали заказа</Text>
            <Badge variant={isSuccess ? "default" : "destructive"}>
              <Text className="text-xs">{isSuccess ? "Оплачен" : "Отклонён"}</Text>
            </Badge>
          </View>
          <Divider className="my-2" />
          <View className="mt-2 space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Номер заказа</Text>
              <Text className="font-medium text-foreground">#{id}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Статус</Text>
              <Text className={`font-medium ${isSuccess ? "text-green-600" : "text-red-500"}`}>
                {isSuccess ? "Успешно" : "Ошибка"}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View className="p-4 border-t border-border bg-card">
        <Button size="lg" className="w-full shadow-md" onPress={() => router.replace("/(tabs)")}>
          <Text className="text-primary-foreground font-bold">
            {isSuccess ? "На главную" : "Попробовать снова"}
          </Text>
        </Button>
      </View>
    </View>
  );
}
