import { Offer } from "@/types/offer";
import React from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ListEmpty from "./ListEmpty";
import OfferCard from "./OfferCard";

interface OfferListProps {
  offers: Offer[];
  isRefetching?: boolean;
  onRefetch?: () => void;
}

const ITEM_HEIGHT = 247;
const SEPARATOR_HEIGHT = 16;

export default function OfferList({ offers, isRefetching, onRefetch }: OfferListProps) {
  const insets = useSafeAreaInsets();

  return (
    <FlatList
      data={offers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <OfferCard offer={item} />}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: (ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
        index,
      })}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 20,
      }}
      ItemSeparatorComponent={() => <View className="h-4" />}
      ListEmptyComponent={<ListEmpty isRefetching={isRefetching} onRefetch={onRefetch} />}
      initialNumToRender={8}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews
    />
  );
}
