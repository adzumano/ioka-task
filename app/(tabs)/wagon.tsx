import { useCarriage } from "@/api/useCarriage";
import ErrorState from "@/components/ErrorState";
import FilterItem from "@/components/FilterItem";
import { PriceDisplay } from "@/components/PriceDisplay";
import { SeatGrid } from "@/components/SeatGrid";
import { SelectionCounter } from "@/components/SelectionCounter";
import { Button } from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import Loader from "@/components/ui/loader";
import { Text } from "@/components/ui/text";
import { WagonScrollControls } from "@/components/WagonScrollControls";
import { useWagonStore } from "@/stores/wagonStore";
import React, { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Wagon() {
  const insets = useSafeAreaInsets();
  const totalPrice = useWagonStore((state) => state.totalPrice);

  // --- СОСТОЯНИЕ СКРОЛЛА ---
  const scrollRef = useRef<ScrollView>(null);
  const [scrollPos, setScrollPos] = useState({ isAtStart: true, isAtEnd: false });

  // --- ЖЕСТЫ (ZOOM & PAN) ---
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const { data: carriage, isLoading, isError, isRefetching, error, refetch } = useCarriage();

  // Жест масштабирования (Pinch)
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
      savedScale.value = scale.value;
    });

  // Жест перемещения (Pan) - работает только при увеличении
  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onUpdate((e) => {
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Объединяем жесты
  const composedGesture = Gesture.Race(pinchGesture, panGesture);

  // --- ЛОГИКА СКРОЛЛА ---
  const handleScrollBy = (direction: "left" | "right") => {
    if (direction === "left") {
      scrollRef.current?.scrollTo({ x: 0, animated: true });
    } else {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtStart = contentOffset.x <= 10;
    const isAtEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 10;
    setScrollPos({ isAtStart, isAtEnd });
  };

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "KZT",
      maximumFractionDigits: 0,
    }).format(amount);

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
        {/* Хедер и фильтры */}
        <View className="bg-white px-4 py-6">
          <View
            style={{ paddingTop: insets.top }}
            className="flex-row justify-between items-center"
          >
            <View className="flex flex-col">
              <Text className="text-2xl font-bold text-foreground">
                Вагон {carriage?.number || "--"}
              </Text>
              <Text className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                от {carriage?.seats?.[0] ? formatPrice(carriage.seats[0].price) : "---"}
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

        {/* Область вагона с зумом и перемещением */}
        <View className="flex-1 overflow-hidden">
          <GestureDetector gesture={composedGesture}>
            <Animated.View className="flex-1">
              <ScrollView
                ref={scrollRef}
                horizontal
                className="flex-1"
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                // Отключаем скролл самого ScrollView, если мы увеличили карту,
                // чтобы работал Pan внутри увеличенной области
                scrollEnabled={scale.value <= 1.1}
                contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
              >
                <View className="px-10">
                  <Animated.View style={animatedStyle}>
                    {carriage && <SeatGrid carriage={carriage} />}
                  </Animated.View>
                </View>
              </ScrollView>
            </Animated.View>
          </GestureDetector>
        </View>

        {/* Нижняя панель */}
        <View className="px-4 mt-10">
          <SelectionCounter />
          <Button size="lg" className="w-full rounded-2xl mt-3" disabled={totalPrice === 0}>
            <Text className="text-base font-bold text-primary-foreground">Продолжить</Text>
          </Button>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
