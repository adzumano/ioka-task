import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useWagonStore } from "@/stores/wagonStore";
import { View } from "react-native";

export function SelectionCounter() {
  const count = useWagonStore((state) => state.selectedSeats.size);

  return (
    <View className="flex flex-row items-center justify-center">
      <Text className="text-sm font-medium text-muted-foreground">Выбрано: </Text>
      <Text className={cn("text-sm font-bold", count === 4 ? "text-orange-500" : "text-primary")}>
        {count} / 4
      </Text>
    </View>
  );
}
