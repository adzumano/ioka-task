import { SelectionCounter } from "@/components/Wagon/SelectionCounter";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useWagonStore } from "@/stores/wagonStore";
import React from "react";
import { View } from "react-native";

export default function WagonFooter() {
  const totalPrice = useWagonStore((state) => state.totalPrice);

  return (
    <View className="px-4 mt-10">
      <SelectionCounter />
      <Button size="lg" className="w-full rounded-2xl mt-3" disabled={totalPrice === 0}>
        <Text className="text-base font-bold text-primary-foreground">Продолжить</Text>
      </Button>
    </View>
  );
}
