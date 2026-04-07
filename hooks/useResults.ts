import { useFlightOffers } from "@/api/useFlightOffers";
import { useOfferFilters } from "@/hooks/useOfferFilters";
import { useOfferStore } from "@/stores/offerStore";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";

export const useResults = () => {
  const { data: offers, isLoading, isRefetching, refetch, isError, error } = useFlightOffers();
  const { filteredOffers, resultCount } = useOfferFilters(offers ?? []);

  const activeCount = useOfferStore((state) => state.getActiveFiltersCount());

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenPress = () => {
    bottomSheetRef.current?.expand();
  };

  return {
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
  };
};
