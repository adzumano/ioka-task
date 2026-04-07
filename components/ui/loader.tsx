import { Text } from "@/components/ui/text";
import React from "react";
import { ActivityIndicator, View } from "react-native";

interface LoaderProps {
  text?: string;
}

export default function Loader({ text = "Загрузка..." }: LoaderProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="rgb(var(--primary))" />
      <Text className="mt-4 text-muted-foreground">{text}</Text>
    </View>
  );
}
