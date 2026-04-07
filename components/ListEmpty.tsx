import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { InboxIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

interface ListEmptyProps {
  isRefetching?: boolean;
  onRefetch?: () => void;
}

export default function ListEmpty({ isRefetching, onRefetch }: ListEmptyProps) {
  return (
    <View className="items-center justify-center py-20">
      <InboxIcon size={40} className="mb-2" />
      <Text className="text-muted-foreground">Ничего не найдено</Text>
      <Button className="mt-2" disabled={isRefetching} onPress={onRefetch}>
        <Text>{isRefetching ? "Загрузка..." : "Обновить"}</Text>
      </Button>
    </View>
  );
}
