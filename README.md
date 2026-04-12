# Ioka Task – Мобильное приложение для бронирования авиа- и железнодорожных билетов

Кроссплатформенное мобильное приложение на React Native с интеграцией платежей, интерактивными картами вагонов и умной системой фильтрации предложений.

## 📋 Описание проекта

Приложение реализует три основных функциональных модуля:

### 1. Smart Search & Multi-Filter (Авиа)
- Интеграция с TanStack Query для управления состоянием API
- Клиентская фильтрация по:
  - Количеству пересадок (0, 1, 2+)
  - Авиакомпаниям
  - Наличию багажа
- Zustand для синхронизации состояния фильтров
- Оптимизация производительности с `useMemo`

### 2. Interactive Wagon Map (Железные дороги)
- Интерактивная карта вагона с поддержкой зуума и панорамирования
- Кликабельные места с разными типами (верхние, нижние, боковые)
- Ограничение на выбор до 4-х мест
- Автоматический расчет стоимости
- Haptics (виброотклик) для обратной связи
- Плавные анимации при выборе места

### 3. Payment Flow & Deep Linking
- Взаимодействие с IOKA SDK и платежной системой
- Обработка 3DS авторизации
- Перехват deeplinks для возврата из банковского приложения
- Интеграция Sentry для мониторинга ошибок
- Интеграция Stripe для альтернативных платежей

## 🛠️ Технологический стек

### Core
- **React Native** v0.81.5
- **Expo** v54.0.33
- **TypeScript** для типизации
- **Expo Router** v6.0.23 для файл-ориентированной навигации

### Управление состоянием и данные
- **TanStack React Query** v5.96.2 для управления серверным состоянием
- **Zustand** для клиентского состояния (фильтры, корзина)
- **Axios** v1.14.0 для HTTP запросов

### UI & Стилизация
- **NativeWind** v4.2.3 (Tailwind CSS для React Native)
- **React Native SVG** для графики
- **Lucide React Native** для иконок
- **@gorhom/bottom-sheet** v5 для модальных окон
- **React Native Reanimated** v3 для анимаций

### Платежи и безопасность
- **Stripe React Native** v0.63.0
- **IOKA SDK** для интеграции с платежной системой
- **Expo Secure Store** для безопасного хранения токенов
- **Expo Crypto** для криптографических операций

### Мониторинг и аналитика
- **Sentry** v8.7.0 для отслеживания ошибок
- **Expo Symbols** для правильного отображения stack traces

### Навигация и система
- **React Navigation** v7.1.8 (Bottom Tabs)
- **Expo Linking** для обработки deeplinks
- **Expo Constants** для конфигурации окружения

## 📦 Установка и запуск

### Требования
- Node.js 18+
- npm или yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator или Xcode (для iOS)
- Android Studio или Android Emulator (для Android)

### Процесс установки

1. **Клонируйте репозиторий**
   ```bash
   git clone <repository-url>
   cd ioka-task
   ```

2. **Установите зависимости**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения**
   ```bash
   cp .env.example .env.local
   # Отредактируйте .env.local с вашими ключами API
   ```

4. **Запустите приложение для разработки**
   ```bash
   npm start
   ```

### Команды запуска

```bash
# Запуск с выбором платформы
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web

# Проверка типов и линтинга
npm run lint

# Пересборка проекта
npx expo prebuild
```

## 📁 Структура проекта

```
ioka-task/
├── app/                          # Основное приложение (Expo Router)
│   ├── _layout.tsx               # Root layout
│   ├── +not-found.tsx            # 404 страница
│   ├── stripe-redirect.tsx        # Redirect от Stripe
│   └── (tabs)/
│       ├── index.tsx             # Главная страница
│       ├── checkout.tsx          # Оформление заказа
│       ├── wagon.tsx             # Выбор мест в вагоне
│       ├── _layout.tsx           # Tabs layout
│       └── orders/
│           └── [id].tsx          # Детали заказа
├── api/                          # API слой
│   ├── useFlightOffers.ts        # Запрос авиаперелетов
│   ├── useCarriage.ts            # Запрос составов поездов
│   ├── useCheckoutDetail.ts      # Детали оформления
│   ├── useCreateOrder.ts         # Создание заказа
│   └── payment.ts                # Платежные операции
├── components/                   # React компоненты
│   ├── Offer/                    # Компоненты авиапредложений
│   │   ├── OfferCard.tsx
│   │   ├── OfferList.tsx
│   │   ├── OffersFilterBottomSheet.tsx
│   │   └── OffersHeader.tsx
│   ├── Wagon/                    # Компоненты вагона
│   │   ├── SeatGrid.tsx          # Сетка мест
│   │   ├── SeatItem.tsx          # Одно место
│   │   ├── PriceDisplay.tsx      # Отображение цены
│   │   └── WagonScrollControls.tsx
│   ├── ui/                       # UI компоненты
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── loader.tsx
│   └── StripeProvider.tsx        # Stripe контекст
├── stores/                       # Zustand хранилища
│   ├── offerStore.ts            # Состояние фильтров предложений
│   └── wagonStore.ts            # Состояние выбранных мест
├── lib/                         # Утилиты и константы
│   ├── utils.ts                 # Вспомогательные функции
│   ├── constants/               # Глобальные константы
│   └── mock.ts                  # Mock данные
├── types/                       # TypeScript типы
│   ├── offer.ts                 # Типы предложений
│   ├── wagon.ts                 # Типы вагонов
│   ├── basket.ts                # Типы корзины
│   ├── order.ts                 # Типы заказов
│   └── shared.ts                # Общие типы
├── config/                      # Конфигурация
│   ├── axios.ts                 # Axios инстанс с интеррцепторами
│   ├── sentry.ts                # Sentry инициализация
│   ├── stripe.ts                # Stripe конфигурация
│   └── sonner.ts                # Toast notifications
├── assets/                      # Изображения и шрифты
│   └── images/
├── tailwind.config.js           # Tailwind конфигурация
├── tsconfig.json                # TypeScript конфигурация
├── babel.config.js              # Babel конфигурация
├── metro.config.js              # Metro bundler конфигурация
└── app.json                     # Expo конфигурация
```

## 🔑 Ключевые фичи

### Фильтрация и поиск
- **Сложная клиентская фильтрация** без переинициирования API запросов
- **Динамический список авиакомпаний** из текущей выборки
- **Синхронизация фильтров** между экраном и модальным окном через Zustand
- **Оптимизация производительности** с `useMemo` для тяжелых вычислений

### Интерактивная карта вагона
- **Zoom и Pan** для удобной навигации по схеме вагона
- **Кликабельные места** с разными типами (верхние/нижние/боковые)
- **Ограничение выбора** максимум 4 места за раз
- **Реал-тайм расчет стоимости** при клике на место
- **Haptics** для тактильной обратной связи
- **Плавные анимации** с React Native Reanimated

### Платежная система
- **Интеграция IOKA SDK** для обработки платежей
- **Поддержка 3DS** для безопасности транзакций
- **Обработка Deep Links** для возврата из банковского приложения
- **Автоматический перехват токенов** с рефреш на 401/403
- **Мониторинг ошибок** через Sentry с добавлением order_id как тег

## 🔐 Безопасность

### Управление токенами
- Токены хранятся в **Expo Secure Store**
- Автоматический рефреш через интеррцепторы Axios
- Graceful fallback при истечении сессии платежа

### Мониторинг безопасности
- **Sentry интеграция** для отслеживания аномалий
- Логирование ошибок платежей с контекстом
- Защита чувствительных данных в логах

## 🚀 Развертывание

### EAS Build
```bash
# Установите EAS CLI
npm install -g eas-cli

# Инициализация
eas build:configure

# iOS сборка
eas build --platform ios

# Android сборка
eas build --platform android
```

### Конфигурация для разных окружений
- **Development** (`dev` схема) – локальная разработка
- **Production** (`prod` схема) – production билды
- Конфигурация в `eas.json` и `app.json`

## 📱 Поддерживаемые платформы

- ✅ iOS 13+
- ✅ Android 7+ (API Level 24+)
- ✅ Web (экспериментально)

## 🧪 Тестирование

```bash
# Запуск линтера
npm run lint

# Проверка типов (TypeScript)
npx tsc --noEmit

# Запуск тестов (если настроены)
npm test
```

## 📚 API интеграция

### Основные endpoints
- **GET /travel/flights** – поиск авиарейсов
- **GET /travel/carriages** – получение информации о вагонах
- **POST /travel/createOrder** – создание заказа
- **GET /travel/order/:id** – получение деталей заказа

### Mock для разработки
В `lib/mock.ts` предусмотрены mock данные для локальной разработки без подключения к реальному API.

## 🐛 Отладка

### Sentry
Все ошибки автоматически отправляются в Sentry (конфигурация в `config/sentry.ts`).
```javascript
// Ручное логирование
import * as Sentry from '@sentry/react-native';
Sentry.captureException(error, {
  tags: { order_id: '12345' }
});
```

### React Query DevTools
```bash
npm install @tanstack/react-query-devtools
```

## 📖 Документация

- [Expo документация](https://docs.expo.dev)
- [React Native документация](https://reactnative.dev)
- [Expo Router гайд](https://docs.expo.dev/routing/introduction)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Stripe React Native](https://github.com/stripe/stripe-react-native)
- [Sentry React Native](https://docs.sentry.io/platforms/react-native/)

## 👥 Разработка

### Git workflow
```bash
# Создание новой branch
git checkout -b feature/new-feature

# Коммит изменений
git add .
git commit -m "feat: add new feature"

# Push
git push origin feature/new-feature
```

### Код стиль
- ESLint конфигурация в `eslint.config.js`
- Используется Prettier для форматирования
- TypeScript для строгой типизации

## 📝 Лицензия

Приватный проект. Все права защищены.

## 📞 Контакты и поддержка

Для вопросов и проблем обратитесь к команде разработки.

---

**Последнее обновление:** апрель 2026
