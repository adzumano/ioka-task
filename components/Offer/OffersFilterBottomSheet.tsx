import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Portal } from "@rn-primitives/portal";
import React, { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import { STOPS_OPTIONS } from "@/constants/stops";
import { useOfferFilters } from "@/hooks/useOfferFilters";
import { cn } from "@/lib/utils";
import type { Offer } from "@/types/offer";

interface OffersFilterBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  activeCount: number;
  offers: Offer[];
}

const SectionHeader = ({ title }: { title: string }) => (
  <Text className="text-base font-bold text-foreground mb-3 mt-2">{title}</Text>
);

export default function OffersFilterBottomSheet({
  bottomSheetRef,
  activeCount,
  offers,
}: OffersFilterBottomSheetProps) {
  const {
    filters,
    setFilters,
    resetFilters,
    availableAirlines,
    toggleStop,
    toggleAirline,
    resultCount,
    isDirectOnly,
  } = useOfferFilters(offers);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  const handleClose = () => bottomSheetRef.current?.close();

  return (
    <Portal name="Results filter bottom sheet">
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["55%", "92%"]}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <View className="flex-row justify-between items-center px-6 pt-2 pb-4 border-b border-border">
          <Text className="text-xl font-bold text-foreground">Фильтры</Text>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onPress={resetFilters} className="px-2">
              <Text className="text-sm text-muted-foreground font-medium">Сбросить</Text>
            </Button>
          )}
        </View>
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 160 }}
        >
          <SectionHeader title="Популярные фильтры" />
          <View className="flex-row flex-wrap gap-2">
            <Button
              variant={filters.baggage_only ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onPress={() => setFilters({ baggage_only: !filters.baggage_only })}
            >
              <Text className={getBtnTextClass(!!filters.baggage_only)}>Только с багажом</Text>
            </Button>

            <Button
              variant={isDirectOnly ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onPress={() => setFilters({ stops: isDirectOnly ? null : [0] })}
            >
              <Text className={getBtnTextClass(isDirectOnly)}>Прямой рейс</Text>
            </Button>
          </View>
          <Divider />
          <View className="flex-row justify-between items-center mb-3">
            <SectionHeader title="Авиакомпании" />
            {filters.airlines && filters.airlines.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setFilters({ airlines: null })}
                hitSlop={8}
              >
                <Text className="text-xs text-primary font-medium">Показать все</Text>
              </Button>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
            <View className="flex-row gap-2 px-1 pb-1">
              {availableAirlines.map((airline) => {
                const isActive = !!filters.airlines?.includes(airline.code);

                return (
                  <Button
                    key={airline.code}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onPress={() => toggleAirline(airline.code)}
                  >
                    <Text className={getBtnTextClass(isActive)}>{airline.name}</Text>
                  </Button>
                );
              })}
            </View>
          </ScrollView>
          <Divider />
          <SectionHeader title="Пересадки" />
          <View className="bg-muted/50 rounded-2xl p-4 border border-border">
            <View className="flex-row flex-wrap gap-2">
              {STOPS_OPTIONS.map((opt) => {
                const isActive = !!filters.stops?.includes(opt.value);

                return (
                  <Button
                    key={opt.value}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onPress={() => toggleStop(opt.value)}
                  >
                    <Text className={getBtnTextClass(isActive)}>{opt.label}</Text>
                  </Button>
                );
              })}
            </View>
          </View>
        </BottomSheetScrollView>
        <View className="absolute bottom-20 left-0 right-0 px-6 pb-6 pt-3 bg-background border-t border-border">
          <Button
            size="lg"
            className={cn("w-full rounded-2xl", resultCount === 0 && "opacity-50")}
            disabled={resultCount === 0}
            onPress={handleClose}
          >
            <Text className="text-base font-bold text-primary-foreground">
              {resultCount > 0 ? `Показать ${resultCount} билетов` : "Билеты не найдены"}
            </Text>
          </Button>
        </View>
      </BottomSheet>
    </Portal>
  );
}

const getBtnTextClass = (isActive: boolean) =>
  cn(isActive ? "text-primary-foreground" : "text-foreground");
