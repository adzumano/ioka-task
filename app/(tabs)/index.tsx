import OfferList from '@/components/OfferList'
import OffersFilterBottomSheet from '@/components/OffersFilterBottomSheet'
import ResultsHeader from '@/components/ResultsHeader'
import { useFlightOffers } from '@/hooks/useFlightOffers'
import { useSearchFilters } from '@/hooks/useSearchFilters'
import { useSearchStore } from '@/stores/searchStore'
import BottomSheet from '@gorhom/bottom-sheet'
import React, { useRef } from 'react'
import { ActivityIndicator, Text, View } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Results() {
  const insets = useSafeAreaInsets();
  const { data: offers, isLoading } = useFlightOffers();
  const { filteredOffers, resultCount } = useSearchFilters(offers ?? []);

  const getActiveCount = useSearchStore((state) => state.getActiveFiltersCount());

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenPress = () => {
    bottomSheetRef.current?.expand();
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="rgb(var(--primary))" />
        <Text className="mt-4 text-muted-foreground">Ищем лучшие предложения...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top }} className="bg-muted">
      <ResultsHeader filteredOffersLength={resultCount} activeCount={getActiveCount} onOpenPress={handleOpenPress}/>
      <OfferList offers={filteredOffers}/>
      <OffersFilterBottomSheet offers={offers ?? []} bottomSheetRef={bottomSheetRef} activeCount={getActiveCount}/>
    </View>
  );
}