import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react-native"; // Или используй свои иконки
import React from "react";
import { View } from "react-native";

interface WagonScrollControlsProps {
  onScrollBy: (direction: "left" | "right") => void;
  isAtStart: boolean;
  isAtEnd: boolean;
}

export function WagonScrollControls({ onScrollBy, isAtStart, isAtEnd }: WagonScrollControlsProps) {
  return (
    <View className="flex-row justify-between items-center gap-2 shrink-0">
      <Button variant="outline" size="icon" onPress={() => onScrollBy("left")} disabled={isAtStart}>
        <ChevronLeft size={20} color="#1F2937" />
      </Button>
      <Button variant="outline" size="icon" onPress={() => onScrollBy("right")} disabled={isAtEnd}>
        <ChevronRight size={20} color="#1F2937" />
      </Button>
    </View>
  );
}
