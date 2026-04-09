import ErrorState from "@/components/ErrorState";
import OfferList from "@/components/Offer/OfferList";
import OffersFilterBottomSheet from "@/components/Offer/OffersFilterBottomSheet";
import OffersHeader from "@/components/Offer/OffersHeader";
import Loader from "@/components/ui/loader";
import { useResults } from "@/lib/hooks/useResults";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Results() {
  const insets = useSafeAreaInsets();
  const {
    offers,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
    filteredOffers,
    resultCount,
    activeCount,
    bottomSheetRef,
    handleOpenPress,
  } = useResults();

  if (isLoading || isRefetching) {
    return <Loader text="Ищем лучшие предложения..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={
          error?.message || "Не удалось загрузить рейсы. Проверьте соединение и попробуйте снова."
        }
        isRefetching={isRefetching}
        onRefetch={refetch}
      />
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top }} className="bg-muted">
      <OffersHeader
        filteredOffersLength={resultCount}
        activeCount={activeCount}
        onOpenPress={handleOpenPress}
      />
      <OfferList offers={filteredOffers} isRefetching={isRefetching} onRefetch={refetch} />
      <OffersFilterBottomSheet
        offers={offers ?? []}
        bottomSheetRef={bottomSheetRef}
        activeCount={activeCount}
      />
    </View>
  );
}
