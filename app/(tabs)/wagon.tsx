import ErrorState from "@/components/ErrorState";
import Loader from "@/components/ui/loader";
import { SeatGrid } from "@/components/Wagon/SeatGrid";
import WagonFooter from "@/components/Wagon/WagonFooter";
import WagonHeader from "@/components/Wagon/WagonHeader";
import { useWagon } from "@/lib/hooks/useWagon";
import React from "react";
import { ScrollView, View } from "react-native";
import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

export default function Wagon() {
  const {
    scrollRef,
    scrollPos,
    carriage,
    isLoading,
    isError,
    isRefetching,
    error,
    refetch,
    composedGesture,
    handleScroll,
    animatedStyle,
    scale,
  } = useWagon();

  if (isLoading || isRefetching) {
    return <Loader text="Загружаем схему вагона..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Ошибка при загрузке данных вагона"}
        isRefetching={isRefetching}
        onRefetch={refetch}
      />
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-muted pb-4">
        {carriage && (
          <WagonHeader carriage={carriage} scrollPos={scrollPos} scrollRef={scrollRef} />
        )}
        <View className="flex-1 overflow-hidden justify-center">
          <GestureDetector gesture={composedGesture}>
            <Animated.View className="flex-1">
              <ScrollView
                ref={scrollRef}
                horizontal
                className="flex-1"
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                scrollEnabled={scale.value <= 1.1}
                contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
              >
                <View className="px-10">
                  <Animated.View style={animatedStyle}>
                    {carriage && <SeatGrid seats={carriage.seats} />}
                  </Animated.View>
                </View>
              </ScrollView>
            </Animated.View>
          </GestureDetector>
        </View>
        <WagonFooter />
      </View>
    </GestureHandlerRootView>
  );
}
