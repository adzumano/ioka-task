import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { Offer } from '@/types/search'
import { Plane } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'

interface OfferCardProps {
  offer: Offer;
  className?: string;
}

export default function OfferCard({ offer, className }: OfferCardProps) {
  const segment = offer.segments[0];

  const getTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formattedPrice = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: offer.price.currency,
    maximumFractionDigits: 0,
  }).format(offer.price.amount);

  return (
    <Card className={cn('gap-0 py-0 overflow-hidden', className)}>
      <CardHeader className="flex-row items-center py-4 bg-muted/30 border-b border-border/20">
        <View className="w-8 h-8 bg-background rounded-md items-center justify-center mr-3 border border-border/50">
          <Plane size={16} className="text-muted-foreground" />
        </View>
        <Text className="font-medium text-sm text-foreground/80">{segment?.airline.name || 'Авиакомпания'}</Text>
      </CardHeader>
      <CardContent className="py-6">
        <View className="flex-row justify-between items-center">
          {/* Вылет */}
          <View>
            <Text className="text-2xl font-bold tracking-tight">{getTime(segment.departure_time)}</Text>
            <Text className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              {segment.departure_airport}
            </Text>
          </View>
          <View className="flex-1 px-4 items-center">
            <Text className="text-[10px] text-muted-foreground/60 mb-1 font-medium">
              Рейс {segment.flight_number}
            </Text>
            <View className="h-[1px] w-full bg-border relative">
              <View className="absolute -top-[2px] left-0 w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              <View className="absolute -top-[2px] right-0 w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            </View>
            <Text className="text-[10px] text-foreground/70 mt-1 font-medium">
              {segment.stops_count === 0 ? 'Прямой' : `${segment.stops_count} перес.`}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-bold">{getTime(segment.arrival_time)}</Text>
            <Text className="text-xs text-muted-foreground uppercase font-medium">
              {segment.arrival_airport}
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
        <View className="flex-row items-center gap-1">
          <Text className={cn(
            "text-xs",
            offer.is_baggage_included ? "text-foreground" : "text-destructive"
          )}>
            {offer.is_baggage_included ? `Багаж ${offer.baggage_weight}кг` : 'Без багажа'}
          </Text>
        </View>
        <Text className="text-2xl font-extrabold text-primary">
          {formattedPrice}
        </Text>
      </CardFooter>
    </Card>
  );
}