import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import React from "react";
import { View } from "react-native";

interface ErrorStateProps {
  message: string;
  isRefetching: boolean;
  onRefetch: () => void;
}

export default function ErrorState({ message, isRefetching, onRefetch }: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background gap-3">
      <Text className="text-xl font-semibold text-foreground">Что-то пошло не так</Text>
      <Text className="text-muted-foreground text-center px-8">{message}</Text>
      <Button className="mt-2" disabled={isRefetching} onPress={onRefetch}>
        <Text>{isRefetching ? "Загрузка..." : "Повторить"}</Text>
      </Button>
    </View>
  );
}
