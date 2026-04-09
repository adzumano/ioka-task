import { cn } from "@/lib/utils";
import { PropsWithClassname } from "@/types/shared";
import React from "react";
import { View } from "react-native";

export default function Divider({ className }: PropsWithClassname) {
  return <View className={cn("h-px bg-border my-4", className)} />;
}
