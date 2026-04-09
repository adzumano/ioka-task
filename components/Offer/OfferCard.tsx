import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn, currencyFormatter, getTime } from "@/lib/utils";
import { Offer } from "@/types/offer";
import { Plane } from "lucide-react-native";
import React, { memo } from "react";
import { View } from "react-native";

interface OfferCardProps {
  offer: Offer;
}

const OfferCard = ({ offer }: OfferCardProps) => {
  const firstSegment = offer.segments[0];
  const lastSegment = offer.segments[offer.segments.length - 1];

  const formattedPrice = currencyFormatter.format(offer.price.amount);

  const stopLabel =
    offer.total_stops === 0
      ? "Прямой"
      : offer.total_stops === 1
        ? "1 пересадка"
        : `${offer.total_stops} пересадки`;

  const middleLabel =
    offer.total_stops === 0
      ? `Рейс ${firstSegment.flight_number}`
      : offer.segments
          .slice(0, -1)
          .map((s) => s.arrival_airport)
          .join(", ");

  return (
    <Card className="gap-0 py-0 overflow-hidden">
      <CardHeader className="flex-row items-center py-4 bg-muted/30 border-b border-border/20">
        <View className="w-8 h-8 bg-background rounded-md items-center justify-center mr-3 border border-border/50">
          <Plane size={16} className="text-muted-foreground" />
        </View>
        <Text className="font-medium text-sm text-foreground/80">
          {firstSegment?.airline.name || "Авиакомпания"}
        </Text>
      </CardHeader>
      <CardContent className="py-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold tracking-tight">
              {getTime(firstSegment.departure_time)}
            </Text>
            <Text className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              {firstSegment.departure_airport}
            </Text>
          </View>
          <View className="flex-1 px-4 items-center">
            <Text className="text-[10px] text-muted-foreground/60 mb-1 font-medium">
              {middleLabel}
            </Text>
            <View className="h-[1px] w-full bg-border relative">
              <View className="absolute -top-[2px] left-0 w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              <View className="absolute -top-[2px] right-0 w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            </View>
            <Text className="text-[10px] text-foreground/70 mt-1 font-medium">{stopLabel}</Text>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-bold">{getTime(lastSegment.arrival_time)}</Text>
            <Text className="text-xs text-muted-foreground uppercase font-medium">
              {lastSegment.arrival_airport}
            </Text>
          </View>
        </View>
      </CardContent>
      <View className="flex-row items-center px-[2px]">
        <View className="h-5 w-5 rounded-full bg-background -ml-3 border border-border" />
        <View className="flex-1 h-[1px] border-t border-dashed border-border mx-2" />
        <View className="h-5 w-5 rounded-full bg-background -mr-3 border border-border" />
      </View>
      <CardFooter className="py-4 flex-row justify-between items-center bg-muted/5">
        <Text
          className={cn(
            "text-xs",
            offer.is_baggage_included ? "text-foreground" : "text-destructive",
          )}
        >
          {offer.is_baggage_included ? `Багаж ${offer.baggage_weight}кг` : "Без багажа"}
        </Text>
        <Text className="text-2xl font-extrabold text-primary">{formattedPrice}</Text>
      </CardFooter>
    </Card>
  );
};

export default memo(OfferCard);
