import { cn } from "@/lib/utils";
import { PropsWithClassname } from "@/types/shared";
import React from "react";
import { Text, View } from "react-native";

interface FilterItemProps extends PropsWithClassname {
  label: string;
}

export default function FilterItem({ label, className }: FilterItemProps) {
  return (
    <View className="flex-row items-center gap-2">
      <View className={cn("w-5 h-5 rounded-sm justify-center items-center", className)}></View>
      <Text className="text-sm text-gray-600">{label}</Text>
    </View>
  );
}
