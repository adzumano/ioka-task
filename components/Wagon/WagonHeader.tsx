import Divider from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import FilterItem from "@/components/Wagon/FilterItem";
import { PriceDisplay } from "@/components/Wagon/PriceDisplay";
import { WagonScrollControls } from "@/components/Wagon/WagonScrollControls";
import { currencyFormatter } from "@/lib/utils";
import { Carriage } from "@/types/wagon";
import React, { RefObject } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface WagonHeaderProps {
  carriage: Carriage;
  scrollRef: RefObject<ScrollView | null>;
  scrollPos: {
    isAtStart: boolean;
    isAtEnd: boolean;
  };
}

export default function WagonHeader({ carriage, scrollRef, scrollPos }: WagonHeaderProps) {
  const insets = useSafeAreaInsets();

  const price = carriage.seats[0].price;

  const formatPrice = currencyFormatter.format(price);

  const handleScrollBy = (direction: "left" | "right") => {
    if (direction === "left") {
      scrollRef.current?.scrollTo({ x: 0, animated: true });
    } else {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <View className="bg-white px-4 py-6">
      <View style={{ paddingTop: insets.top }} className="flex-row justify-between items-center">
        <View className="flex flex-col">
          <Text className="text-2xl font-bold text-foreground">
            Вагон {carriage?.number || "--"}
          </Text>
          <Text className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            от {carriage?.seats?.[0] ? formatPrice : "---"}
          </Text>
        </View>
        <PriceDisplay />
      </View>
      <Divider className="-mx-4" />
      <View className="flex flex-row items-center justify-between gap-2">
        <WagonScrollControls
          onScrollBy={handleScrollBy}
          isAtStart={scrollPos.isAtStart}
          isAtEnd={scrollPos.isAtEnd}
        />
        <View className="flex-row justify-end gap-4">
          <FilterItem label="Нижние" className="bg-blue-400" />
          <FilterItem label="Верхние" className="bg-emerald-500" />
          <FilterItem label="Занято" className="bg-muted" />
        </View>
      </View>
    </View>
  );
}
