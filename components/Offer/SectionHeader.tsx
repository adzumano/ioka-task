import React from "react";
import { Text } from "react-native";

interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return <Text className="text-base font-bold text-foreground mb-3 mt-2">{title}</Text>;
}
