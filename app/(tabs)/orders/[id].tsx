import { Text } from "@/components/ui/text";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const url = Linking.useURL(); // Тот самый критерий Middle+

  useEffect(() => {
    if (url) {
      const { queryParams } = Linking.parse(url);
      if (queryParams?.status === "success") {
        console.log("success");
      }
    }
  }, [url]);

  return (
    <View>
      <Text>Заказ №{id}</Text>
    </View>
  );
}
