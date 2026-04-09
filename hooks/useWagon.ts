import { useCarriage } from "@/api/useCarriage";
import { useRef, useState } from "react";
import { ScrollView } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export const useWagon = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [scrollPos, setScrollPos] = useState({ isAtStart: true, isAtEnd: false });

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const { data: carriage, isLoading, isError, isRefetching, error, refetch } = useCarriage();

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

  const composedGesture = Gesture.Race(pinchGesture, panGesture);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtStart = contentOffset.x <= 10;
    const isAtEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 10;
    setScrollPos({ isAtStart, isAtEnd });
  };

  return {
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
  };
};
