import { PriceDisplay } from "@/components/PriceDisplay";
import { SeatGrid } from "@/components/SeatGrid";
import { SelectionCounter } from "@/components/SelectionCounter";
import { Text } from "@/components/ui/text";
import { MOCK_CARRIAGE } from "@/constants/wagon";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const carriage = MOCK_CARRIAGE;

export default function Wagon() {
  const insets = useSafeAreaInsets();
  const [zoom, setZoom] = useState(1);
  const scale = useSharedValue(1);
  const maxZoom = 2;
  const minZoom = 1;
  const baseSize = 40;

  const handleZoomIn = () => {
    if (zoom < maxZoom) {
      const newZoom = Math.min(zoom + 0.2, maxZoom);
      setZoom(newZoom);
      scale.value = withSpring(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (zoom > minZoom) {
      const newZoom = Math.max(zoom - 0.2, minZoom);
      setZoom(newZoom);
      scale.value = withSpring(newZoom);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const seatSize = useMemo(() => baseSize * zoom, [zoom]);

  return (
    <View className="flex-1 bg-white p-4">
      {/* Счетчик и цена */}
      <View
        style={{ paddingTop: insets.top }}
        className="flex-row justify-between items-center mb-4"
      >
        <SelectionCounter />
        <PriceDisplay />
      </View>

      {/* Зум контролы */}
      <View className="flex-row gap-2 mb-4 justify-center">
        <Pressable
          onPress={handleZoomOut}
          className="bg-gray-200 w-10 h-10 rounded justify-center items-center"
        >
          <Text className="text-xl font-bold">−</Text>
        </Pressable>
        <Text className="text-sm text-gray-600 w-12 text-center">{Math.round(zoom * 100)}%</Text>
        <Pressable
          onPress={handleZoomIn}
          className="bg-gray-200 w-10 h-10 rounded justify-center items-center"
        >
          <Text className="text-xl font-bold">+</Text>
        </Pressable>
      </View>

      {/* Карта с возможностью скролла */}
      <ScrollView
        horizontal
        scrollEnabled={zoom > 1}
        className="flex-1 border border-gray-200 rounded"
      >
        <View className="p-4">
          <Animated.View style={animatedStyle}>
            <SeatGrid carriage={carriage} seatSize={seatSize} gapSize={8} />
          </Animated.View>
        </View>
      </ScrollView>

      {/* Кнопка подтверждения */}
      <Pressable className="bg-blue-600 py-3 rounded mt-4">
        <Text className="text-center text-white font-semibold text-base">Продолжить</Text>
      </Pressable>
    </View>
  );
}
