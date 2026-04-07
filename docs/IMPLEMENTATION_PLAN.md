# План реализации Ioka Tasks (Avia + Railway + Payment)

## 📋 Обзор проекта

**Технологический стек:**

- React Native 0.81.5 + Expo 54
- Expo Router 6 (навигация)
- React Native Reanimated 4 (анимации)
- NativeWind/Tailwind CSS (стили)
- Expo Haptics (виброотклик)
- Expo Linking (deep linking)
- TypeScript 5.9

**Предполагаемые добавления:**

- `@tanstack/react-query` — управление асинхронными данными
- `zustand` — легковесное state management
- `@sentry/react-native` — мониторинг ошибок
- `react-native-svg` — для SVG (опционально для вагонов)

---

## 🚂 ЗАДАНИЕ 2: Interactive Wagon Map (Railway Focus)

### 2.1 Подготовка

#### Шаг 2.1.1 — Структура папок

```
app/
  (booking)/
    train-[id]/
      wagon-[wagId].tsx    # Интерактивная карта вагона

components/
  railway/
    WagonMap.tsx            # Основной компонент карты вагона
    SeatGrid.tsx            # Сетка мест (SVG или Absolute)
    SeatItem.tsx            # Один seat с анимацией
    PriceDisplay.tsx        # Динамическое отображение цены
    SelectionCounter.tsx    # Счетчик выбранных мест
    ZoomControls.tsx        # Кнопки zoom+/-

hooks/
  useWagonState.ts          # Zustand store для состояния вагона
  useWagonGestures.ts       # Обработка pan/zoom

types/
  wagon.ts                  # TS типы
```

### 2.2 Типизация

#### Шаг 2.2.1 — Типы для Railway API

**File: `app/types/wagon.ts`**

```typescript
export type SeatStatus = "available" | "taken" | "selected";
export type SeatType = "lower" | "upper" | "side";

export interface Seat {
  id: string; // "A1", "B2" и т.д.
  type: SeatType;
  status: SeatStatus;
  price: number;
  position: { x: number; y: number };
}

export interface Carriage {
  id: string;
  number: number;
  type: "economy" | "business" | "sleeper";
  seats: Seat[];
  layout: {
    rows: number;
    columns: number;
  };
  price_multiplier: {
    lower: 1.0;
    upper: 0.85;
    side: 0.95;
  };
}

export interface TrainInfo {
  id: string;
  carriages: Carriage[];
}

export interface SelectionState {
  selectedSeats: Set<string>;
  totalPrice: number;
}
```

### 2.3 State Management

#### Шаг 2.3.1 — Zustand Store для вагона

**File: `app/hooks/useWagonState.ts`**

```typescript
import { create } from "zustand";
import { Seat, Carriage } from "@/app/types/wagon";

interface WagonState {
  carriage: Carriage | null;
  selectedSeats: Map<string, Seat>;
  totalPrice: number;

  selectSeat: (seat: Seat) => boolean; // returns success
  deselectSeat: (seatId: string) => void;
  getTotalPrice: () => number;
  canSelectMore: () => boolean; // макс 4 места
}

const MAX_SEATS = 4;

export const useWagonStore = create<WagonState>((set, get) => ({
  carriage: null,
  selectedSeats: new Map(),
  totalPrice: 0,

  selectSeat: (seat) => {
    const { selectedSeats, carriage } = get();

    // Проверка лимита
    if (selectedSeats.size >= MAX_SEATS) return false;

    // Добавляем место
    const newSelected = new Map(selectedSeats);
    newSelected.set(seat.id, seat);

    // Пересчитываем цену
    let newPrice = 0;
    newSelected.forEach((s) => {
      const multiplier = carriage?.price_multiplier[s.type] || 1;
      newPrice += s.price * multiplier;
    });

    set({
      selectedSeats: newSelected,
      totalPrice: newPrice,
    });

    return true;
  },

  deselectSeat: (seatId) => {
    set((state) => {
      const newSelected = new Map(state.selectedSeats);
      newSelected.delete(seatId);

      let newPrice = 0;
      newSelected.forEach((s) => {
        const multiplier = state.carriage?.price_multiplier[s.type] || 1;
        newPrice += s.price * multiplier;
      });

      return {
        selectedSeats: newSelected,
        totalPrice: newPrice,
      };
    });
  },

  getTotalPrice: () => get().totalPrice,

  canSelectMore: () => get().selectedSeats.size < MAX_SEATS,
}));
```

### 2.4 Визуализация вагона

#### Шаг 2.4.1 — SeatItem с анимацией и Haptics

**File: `app/components/railway/SeatItem.tsx`**

```typescript
import { Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Seat } from '@/app/types/wagon';
import { useWagonStore } from '@/app/hooks/useWagonState';

interface SeatItemProps {
  seat: Seat;
  size: number;
}

export function SeatItem({ seat, size }: SeatItemProps) {
  const selectedSeats = useWagonStore((state) => state.selectedSeats);
  const selectSeat = useWagonStore((state) => state.selectSeat);
  const deselectSeat = useWagonStore((state) => state.deselectSeat);
  const canSelectMore = useWagonStore((state) => state.canSelectMore);

  const isSelected = selectedSeats.has(seat.id);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    if (seat.status === 'taken') return;

    if (isSelected) {
      deselectSeat(seat.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSpring(1, { damping: 8 });
    } else {
      if (!canSelectMore()) {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );
        return;
      }

      const success = selectSeat(seat);
      if (success) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        scale.value = withSpring(0.95, { damping: 8 });
      }
    }
  };

  const getBgColor = () => {
    if (seat.status === 'taken') return '#e5e7eb'; // gray
    if (isSelected) return '#3b82f6'; // blue
    return '#f3f4f6'; // light gray
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        disabled={seat.status === 'taken'}
        className="rounded"
        style={{
          width: size,
          height: size,
          backgroundColor: getBgColor(),
          justifyContent: 'center',
          alignItems: 'center',
          opacity: seat.status === 'taken' ? 0.5 : 1,
        }}
      >
        <Text
          className={`text-xs font-semibold ${
            isSelected || seat.status === 'taken'
              ? 'text-white'
              : 'text-gray-600'
          }`}
        >
          {seat.id}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
```

#### Шаг 2.4.2 — Сетка мест (Absolute Layout для оптимизации)

**File: `app/components/railway/SeatGrid.tsx`**

```typescript
import { View, Dimensions } from 'react-native';
import { useMemo } from 'react';
import { Carriage } from '@/app/types/wagon';
import { SeatItem } from './SeatItem';

interface SeatGridProps {
  carriage: Carriage;
  seatSize: number;
  gapSize: number;
}

export function SeatGrid({
  carriage,
  seatSize,
  gapSize,
}: SeatGridProps) {
  // Мемоизируем абсолютные позиции для оптимизации
  const positionedSeats = useMemo(() => {
    const positions = new Map();

    carriage.seats.forEach((seat, index) => {
      const row = Math.floor(index / carriage.layout.columns);
      const col = index % carriage.layout.columns;

      positions.set(seat.id, {
        top: row * (seatSize + gapSize),
        left: col * (seatSize + gapSize),
      });
    });

    return positions;
  }, [carriage, seatSize, gapSize]);

  const containerHeight = useMemo(() => {
    return (
      (carriage.layout.rows - 1) * (seatSize + gapSize) + seatSize
    );
  }, [carriage.layout.rows, seatSize, gapSize]);

  // Хак для оптимизации: используем position absolute
  // чтобы избежатьересчета жесткой сетки при селекте одного места
  return (
    <View
      style={{
        height: containerHeight,
        position: 'relative',
        marginBottom: 20,
      }}
    >
      {carriage.seats.map((seat) => {
        const pos = positionedSeats.get(seat.id);
        return (
          <View
            key={seat.id}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
            }}
          >
            <SeatItem seat={seat} size={seatSize} />
          </View>
        );
      })}
    </View>
  );
}
```

#### Шаг 2.4.3 — Основной компонент WagonMap с Zoom/Pan

**File: `app/components/railway/WagonMap.tsx`**

```typescript
import { View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useState, useMemo } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Carriage } from '@/app/types/wagon';
import { SeatGrid } from './SeatGrid';
import { PriceDisplay } from './PriceDisplay';
import { SelectionCounter } from './SelectionCounter';

interface WagonMapProps {
  carriage: Carriage;
}

export function WagonMap({ carriage }: WagonMapProps) {
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
      <View className="flex-row justify-between items-center mb-4">
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
        <Text className="text-sm text-gray-600 w-12 text-center">
          {Math.round(zoom * 100)}%
        </Text>
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
            <SeatGrid
              carriage={carriage}
              seatSize={seatSize}
              gapSize={8}
            />
          </Animated.View>
        </View>
      </ScrollView>

      {/* Кнопка подтверждения */}
      <Pressable className="bg-blue-600 py-3 rounded mt-4">
        <Text className="text-center text-white font-semibold text-base">
          Продолжить
        </Text>
      </Pressable>
    </View>
  );
}
```

---

## 💳 ЗАДАНИЕ 3: Payment Flow & Deep Link Resilience (Infrastructure)

### 3.1 Подготовка

#### Шаг 3.1.1 — Установка зависимостей

```bash
npm install @sentry/react-native axios
```

#### Шаг 3.1.2 — Структура папок

```
app/
  (checkout)/
    _layout.tsx           # Layout для checkout
    index.tsx             # Cart (корзина/бронирование)
    payment.tsx           # Экран оплаты
    success.tsx           # Deep link: success
    failure.tsx           # Deep link: failure

lib/
  api/
    iokaClient.ts         # Axios instance с interceptors
    ioka.ts               # Ioka API functions

  services/
    paymentService.ts     # Business logic оплаты
    sessionStorage.ts     # Хранение сессии оплаты

lib/
  deeplinks/
    config.ts             # Конфигурация deep links
    linking.ts            # Обработка linking

stores/
  checkoutStore.ts        # Zustand для checkout

config/
  sentry.ts               # Инициализация Sentry
```

### 3.2 API Client с Interceptors

#### Шаг 3.2.1 — Axios клиент с обработкой ошибок

**File: `lib/api/iokaClient.ts`**

```typescript
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import * as Sentry from "@sentry/react-native";

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
}

class IokaClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.EXPO_PUBLIC_IOKA_API_URL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync("ioka_session_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // 401/403 - токен истек
        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            // Получаем новый токен
            const newToken = await this.refreshToken();
            await SecureStore.setItemAsync("ioka_session_token", newToken);

            // Повторяем оригинальный запрос
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Рефреш не сработал - спускаемся к созданию заказа
            Sentry.captureException(refreshError, {
              tags: { flow: "payment_token_refresh" },
            });
            throw new PaymentSessionExpiredError();
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private async refreshToken(): Promise<string> {
    // Если уже есть промис рефреша - ждем его
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync("ioka_refresh_token");

        const response = await this.client.post<RefreshTokenResponse>("/auth/refresh", {
          refresh_token: refreshToken,
        });

        return response.data.access_token;
      } catch (error) {
        throw new PaymentSessionExpiredError();
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export class PaymentSessionExpiredError extends Error {
  constructor() {
    super("Payment session has expired");
    this.name = "PaymentSessionExpiredError";
  }
}

export const iokaClient = new IokaClient();
```

#### Шаг 3.2.2 — Ioka API функции

**File: `lib/api/ioka.ts`**

```typescript
import { iokaClient, PaymentSessionExpiredError } from "./iokaClient";
import * as Sentry from "@sentry/react-native";

export interface OrderCreatePayload {
  amount: number;
  currency: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  description: string;
  customer: {
    email: string;
    phone: string;
    full_name: string;
  };
  success_url: string;
  failure_url: string;
}

export interface Order {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "paid" | "failed";
  payment_url?: string;
  created_at: string;
}

export async function createOrder(payload: OrderCreatePayload, orderId?: string): Promise<Order> {
  try {
    const response = await iokaClient.getClient().post<Order>("/orders", payload);

    return response.data;
  } catch (error) {
    if (error instanceof PaymentSessionExpiredError) {
      Sentry.captureException(error, {
        tags: {
          flow: "checkout",
          stage: "create_order",
          order_id: orderId,
        },
      });
      throw error;
    }

    // Проверяем специфические ошибки
    if (error instanceof Error && error.message.includes("amount")) {
      Sentry.captureException(error, {
        tags: {
          flow: "checkout",
          error_type: "amount_mismatch",
          order_id: orderId,
        },
      });
    }

    throw error;
  }
}

export async function getOrder(orderId: string): Promise<Order> {
  try {
    const response = await iokaClient.getClient().get<Order>(`/orders/${orderId}`);

    return response.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        flow: "checkout",
        stage: "get_order",
        order_id: orderId,
      },
    });
    throw error;
  }
}

export async function confirmPayment(orderId: string, paymentData: any): Promise<Order> {
  try {
    const response = await iokaClient
      .getClient()
      .post<Order>(`/orders/${orderId}/confirm`, paymentData);

    return response.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        flow: "checkout",
        stage: "confirm_payment",
        order_id: orderId,
      },
    });
    throw error;
  }
}
```

### 3.3 Sentry Integration

#### Шаг 3.3.1 — Инициализация Sentry

**File: `config/sentry.ts`**

```typescript
import * as Sentry from "@sentry/react-native";
import { NavigationContainer } from "@react-navigation/native";

export function initSentry() {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: process.env.EXPO_PUBLIC_ENV || "production",
    // Performance Monitoring
    tracesSampleRate: 0.5,
    // Replay
    integrations: [
      new Sentry.ReplayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

// Обертка для навигации (для отправки навигационных событий)
export const sentryWrappedNavigationContainer = Sentry.wrap(NavigationContainer, {
  name: "ReactNavigationInstrumentation",
});
```

### 3.4 Deep Linking Configuration

#### Шаг 3.4.1 — Конфигурация deep links

**File: `lib/deeplinks/config.ts`**

```typescript
import * as Linking from "expo-linking";

const prefix = Linking.createURL("/");

export const linking = {
  prefixes: [
    prefix,
    "iokatask://", // Custom scheme из app.json
    "https://ioka.app/", // Production domain
  ],

  config: {
    screens: {
      // Checkout flow
      "(checkout)/payment": "checkout/payment/:orderId",
      "(checkout)/success": "checkout/success/:orderId",
      "(checkout)/failure": "checkout/failure/:orderId",

      // Fallback
      NotFound: "*",
    },
  },
};

// URL для success/failure из API
export function getCheckoutUrls(orderId: string) {
  const baseUrl = "iokatask://checkout";

  return {
    success_url: `${baseUrl}/success/${orderId}`,
    failure_url: `${baseUrl}/failure/${orderId}`,
  };
}
```

#### Шаг 3.4.2 — Обработка deep links в root layout

**File: `app/_layout.tsx`** (пример)

```typescript
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { Stack, useNavigation } from 'expo-router';
import { linking } from '@/lib/deeplinks/config';

export default function RootLayout() {
  const navigation = useNavigation();

  useFonts({
    // ... fonts
  });

  // Обработка deep linking
  useEffect(() => {
    const unsubscribe = Linking.addEventListener(
      'url',
      ({ url }) => {
        const route = url.replace(/.*?:\/\//g, '');
        const routeName = route.split('/')[0];
        const params = route.split('/').slice(1);

        if (routeName === 'checkout') {
          navigation.navigate('(checkout)', {
            screen: params[0],
            params: { orderId: params[1] },
          });
        }
      }
    );

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack linking={linking} fallback={<LoadingScreen />}>
      {/* Stack configuration */}
    </Stack>
  );
}
```

### 3.5 Checkout Flow

#### Шаг 3.5.1 — Zustand Store для checkout

**File: `stores/checkoutStore.ts`**

```typescript
import { create } from "zustand";
import { Order } from "@/lib/api/ioka";

interface CheckoutStore {
  order: Order | null;
  isCreatingOrder: boolean;
  error: string | null;

  setOrder: (order: Order) => void;
  setIsCreatingOrder: (isCreating: boolean) => void;
  setError: (error: string | null) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  order: null,
  isCreatingOrder: false,
  error: null,

  setOrder: (order) => set({ order }),
  setIsCreatingOrder: (isCreating) => set({ isCreatingOrder: isCreating }),
  setError: (error) => set({ error }),
  resetCheckout: () =>
    set({
      order: null,
      isCreatingOrder: false,
      error: null,
    }),
}));
```

#### Шаг 3.5.2 — Экран оплаты (payment.tsx)

**File: `app/(checkout)/payment.tsx`**

```typescript
import { View, Pressable, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { createOrder, Order } from '@/lib/api/ioka';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { getCheckoutUrls } from '@/lib/deeplinks/config';
import * as Sentry from '@sentry/react-native';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const bookingId = params.bookingId as string;

  const order = useCheckoutStore((state) => state.order);
  const isCreatingOrder = useCheckoutStore(
    (state) => state.isCreatingOrder
  );
  const error = useCheckoutStore((state) => state.error);
  const setOrder = useCheckoutStore((state) => state.setOrder);
  const setIsCreatingOrder = useCheckoutStore(
    (state) => state.setIsCreatingOrder
  );
  const setError = useCheckoutStore((state) => state.setError);

  useEffect(() => {
    handleCreateOrder();
  }, [bookingId]);

  async function handleCreateOrder() {
    setIsCreatingOrder(true);
    setError(null);

    try {
      const urls = getCheckoutUrls(bookingId);

      const newOrder = await createOrder(
        {
          amount: 50000, // цена в копейках или центах
          currency: 'RUB',
          items: [
            { name: 'Flight booking', quantity: 1, price: 50000 },
          ],
          description: `Booking ${bookingId}`,
          customer: {
            email: 'user@example.com',
            phone: '+79991234567',
            full_name: 'John Doe',
          },
          success_url: urls.success_url,
          failure_url: urls.failure_url,
        },
        bookingId
      );

      setOrder(newOrder);

      // Открываем URL оплаты в браузере
      if (newOrder.payment_url) {
        const result = await WebBrowser.openBrowserAsync(
          newOrder.payment_url
        );

        if (result.type === 'dismiss') {
          // Пользователь закрыл браузер
          // Система все равно получит callback на success_url/failure_url
          setError('Payment window was closed');
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);

      Sentry.captureException(err, {
        tags: {
          flow: 'checkout',
          stage: 'create_order',
          booking_id: bookingId,
        },
      });
    } finally {
      setIsCreatingOrder(false);
    }
  }

  if (isCreatingOrder) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-4">Создаем заказ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-600 font-semibold mb-4">
          Ошибка: {error}
        </Text>
        <Pressable
          onPress={handleCreateOrder}
          className="bg-blue-600 px-6 py-3 rounded"
        >
          <Text className="text-white font-semibold">Повторить</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg font-semibold mb-4">
        Оплата готова
      </Text>
      {order && (
        <>
          <Text className="text-gray-600 mb-2">
            Сумма: {order.amount} {order.currency}
          </Text>
          <Text className="text-gray-600 mb-4">
            Статус: {order.status}
          </Text>
        </>
      )}
      <Text className="text-sm text-gray-500">
        Браузер откроется для завершения оплаты
      </Text>
    </View>
  );
}
```

#### Шаг 3.5.3 — Success экран с обработкой deep link

**File: `app/(checkout)/success.tsx`**

```typescript
import { View, Pressable } from 'react-native';
import { useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { getOrder } from '@/lib/api/ioka';
import { useCheckoutStore } from '@/stores/checkoutStore';
import * as Sentry from '@sentry/react-native';

export default function SuccessScreen() {
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;
  const order = useCheckoutStore((state) => state.order);

  useEffect(() => {
    verifyPayment();
  }, [orderId]);

  async function verifyPayment() {
    try {
      const confirmedOrder = await getOrder(orderId);

      if (confirmedOrder.status === 'paid') {
        // Логируем успешный платеж в Sentry
        Sentry.captureMessage('Payment successful', 'info', {
          tags: {
            flow: 'checkout',
            order_id: orderId,
            amount: confirmedOrder.amount,
          },
        });

        // Переходим на экран заказов с задержкой
        setTimeout(() => {
          router.replace('/(tabs)/orders');
        }, 2000);
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          flow: 'checkout',
          stage: 'verify_payment',
          order_id: orderId,
        },
      });
    }
  }

  return (
    <View className="flex-1 bg-green-50 justify-center items-center p-4">
      <View className="bg-white rounded-12 p-6 items-center">
        <Text className="text-green-600 text-5xl mb-4">✓</Text>
        <Text className="text-lg font-semibold mb-2">
          Платеж успешно обработан!
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Заказ #{orderId} подтвержден
        </Text>
        <Pressable
          onPress={() => router.replace('/(tabs)/orders')}
          className="bg-green-600 px-8 py-3 rounded"
        >
          <Text className="text-white font-semibold">Готово</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### 3.6 EAS Build Configuration

#### Шаг 3.6.1 — eas.json для разных окружений

**File: `eas.json`**

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_ENV": "preview",
        "EXPO_PUBLIC_IOKA_API_URL": "https://api-preview.ioka.io",
        "EXPO_PUBLIC_SENTRY_DSN": "https://preview@sentry.io/000000"
      }
    },
    "production": {
      "android": {
        "buildType": "aab",
        "gradleCommand": ":app:bundleRelease"
      },
      "ios": {
        "buildType": "archive"
      },
      "env": {
        "EXPO_PUBLIC_ENV": "production",
        "EXPO_PUBLIC_IOKA_API_URL": "https://api.ioka.io",
        "EXPO_PUBLIC_SENTRY_DSN": "https://prod@sentry.io/000000"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": 1234567890
      }
    }
  }
}
```

#### Шаг 3.6.2 — Environment variables (.env.local)

**File: `.env.local`**

```
# Ioka API
EXPO_PUBLIC_IOKA_API_URL=https://api-preview.ioka.io
EXPO_PUBLIC_ENV=development

# Sentry
EXPO_PUBLIC_SENTRY_DSN=https://key@sentry.io/12345

# Deep linking
EXPO_PUBLIC_APP_SCHEME=iokatask
EXPO_PUBLIC_DOMAIN=ioka.app
```

---

## 📋 Фазы реализации (Roadmap)

### **Фаза 0: Setup (День 1)**

- [ ] Установить зависимости (TanStack Query, Zustand, Sentry, axios)
- [ ] Создать базовую структуру папок
- [ ] Настроить TypeScript типы
- [ ] Инициализировать Sentry

### **Фаза 1: Avia Search (День 2-3)**

- [ ] Создать Zustand store для фильтров
- [ ] Интегрировать TanStack Query для запроса офферов
- [ ] Реализовать логику фильтрации (3 типа фильтров)
- [ ] Создать UI компоненты (SearchForm, OfferCard, FilterModal)
- [ ] Оптимизировать с useMemo (тест на лаги при клике чекбокса)
- [ ] Обработать EmptyState
- [ ] **Критерий Middle+:** Нормализация данных, обработка дублей

### **Фаза 2: Railway Wagon (День 4-5)**

- [ ] Создать Zustand store для состояния вагона (макс 4 места)
- [ ] Реализовать SeatItem с Reanimated анимацией
- [ ] Интегрировать Haptics (виброотклик при клике)
- [ ] Создать SeatGrid с Absolute positioning (оптимизация)
- [ ] Реализовать Zoom/Pan для WagonMap
- [ ] Автоматический расчет цены по типу места
- [ ] **Критерий Middle+:** Работа с SVG/Grid, предотвращение ререндеров всех мест

### **Фаза 3: Payment & Deep Linking (День 6-7)**

- [ ] Создать Axios client с interceptors для обработки 401/403
- [ ] Реализовать rethrow и возврат к createOrder на истечение токена
- [ ] Настроить Deep Linking (success_url/failure_url)
- [ ] Интегрировать Linking.useURL() для обработки внешних переходов
- [ ] Создать Checkout flow (Cart → Payment → Success/Failure)
- [ ] Настроить Sentry.captureException для специфических ошибок Ioka
- [ ] Создать eas.json конфиги для dev/prod
- [ ] **Критерий Middle+:** Resilience, EAS конфиги, правильная обработка 3DS возврата

---

## 🎯 Критерии успешности

### Middle+ уровень для каждого задания:

1. **Avia:**
   - ✅ Нормализация данных при встречаемости одного сегмента в разных офферах
   - ✅ Грамотная обработка "Ничего не найдено" (UI + логика)
   - ✅ Фильтры синхронизируются между экраном и модалью без дублирования состояния

2. **Railway:**
   - ✅ Места отрисовываются через Absolute Layout (не пересчитывается вся сетка при одном клике)
   - ✅ SVG или идеальная Grid укладка 54+ мест
   - ✅ Ноль ненужных ререндеров дочерних компонентов (memoization)
   - ✅ Плавная анимация и виброотклик синхронизованы

3. **Payment:**
   - ✅ Interceptor правильно обрабатывает 401/403 и инициирует рефреш
   - ✅ При истечении токена рефреш срабатывает или спускается к повторной инициализации заказа
   - ✅ Deep linking работает из банковского приложения: успешно открывает правильный экран в стеке
   - ✅ Sentry отправляет теги (order_id, flow, stage) для всех критичных ошибок
   - ✅ EAS конфиги настроены для dev/prod с разными ENV переменными

---

## 📦 Итоговые созданные файлы (Summary)

```
app/
  ├─ (search)/
  │  ├─ _layout.tsx
  │  ├─ index.tsx (SearchForm)
  │  ├─ results.tsx (Filtered offers с modal)
  │  └─ [offerId].tsx
  ├─ (booking)/
  │  └─ train-[id]/
  │     └─ wagon-[wagId].tsx
  ├─ (checkout)/
  │  ├─ _layout.tsx
  │  ├─ index.tsx (Cart)
  │  ├─ payment.tsx
  │  ├─ success.tsx
  │  └─ failure.tsx
  ├─ components/
  │  ├─ search/
  │  │  ├─ SearchForm.tsx
  │  │  ├─ OfferCard.tsx
  │  │  ├─ FilterModal.tsx
  │  │  ├─ FilterChips.tsx
  │  │  └─ EmptyState.tsx
  │  └─ railway/
  │     ├─ WagonMap.tsx
  │     ├─ SeatGrid.tsx
  │     ├─ SeatItem.tsx
  │     ├─ PriceDisplay.tsx
  │     ├─ SelectionCounter.tsx
  │     └─ ZoomControls.tsx
  ├─ hooks/
  │  ├─ useFlightOffers.ts
  │  ├─ useSearchFilters.ts
  │  ├─ useWagonState.ts
  │  └─ useWagonGestures.ts
  ├─ stores/
  │  ├─ searchStore.ts
  │  └─ checkoutStore.ts
  ├─ types/
  │  ├─ search.ts
  │  └─ wagon.ts
  └─ utils/
     ├─ filterOffers.ts
     └─ normalizeOffers.ts

lib/
  ├─ api/
  │  ├─ iokaClient.ts (Axios + interceptors)
  │  └─ ioka.ts (API functions)
  ├─ services/
  │  ├─ paymentService.ts
  │  └─ sessionStorage.ts
  ├─ deeplinks/
  │  ├─ config.ts
  │  └─ linking.ts
  └─ (empty)

config/
  └─ sentry.ts

root/
  ├─ eas.json
  ├─ .env.local
  └─ (обновленные существующие файлы)
```

---

## 🚀 Команды для запуска

```bash
# Установка всех зависимостей
npm install @tanstack/react-query zustand @sentry/react-native axios

# Development
npm start

# Build preview для проверки deep linking
eas build --platform ios --profile preview

# Build production
eas build --platform ios --profile production
```

---

**Лучшей удачи! 🎉 Если нужны уточнения по какому-то модулю — обращайся!**
