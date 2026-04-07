# 📁 Анализ текущей структуры проекта Ioka

## 🎯 Общее состояние

**Статус:** Expo React Native проект в начальной стадии  
**Версии:**
- Expo: ~54.0.33
- React Native: 0.81.5
- React: 19.1.0
- TypeScript: ~5.9.2

---

## 📦 Уже установленные ключевые зависимости

### State Management & Data
- ✅ `zustand` — ^5.0.12 (уже установлен!)
- ✅ `@tanstack/react-query` — ^5.96.2 (уже установлен!)

### UI & Styling
- ✅ `nativewind` — ^4.2.3 (Tailwind CSS для React Native)
- ✅ `tailwindcss` — ^3.4.19
- ✅ `class-variance-authority` — ^0.7.1 (для CVA компонентов)
- ✅ `clsx` — ^2.1.1
- ✅ `tailwind-merge` — ^3.5.0
- ✅ `tailwindcss-animate` — ^1.0.7

### Navigation & Routing
- ✅ `expo-router` — ~6.0.23
- ✅ `@react-navigation/*` — пакеты установлены

### Animations & Gestures
- ✅ `react-native-reanimated` — ~4.1.1
- ✅ `react-native-gesture-handler` — ~2.28.0
- ✅ `react-native-worklets` — 0.5.1

### Native APIs
- ✅ `expo-haptics` — ~15.0.8 (для виброотклика)
- ✅ `expo-linking` — ~8.0.11 (для deep linking)
- ✅ `expo-web-browser` — ~15.0.10 (для открытия браузера)
- ✅ `expo-image` — ~3.0.11
- ✅ `expo-font` — ~14.0.11

### Utilities
- ✅ `@rn-primitives/portal` — ^1.4.0
- ✅ `@rn-primitives/slot` — ^1.4.0

---

## 📂 Текущая структура файлов

```
project-root/
├── app/
│   ├── _layout.tsx              # Root Layout с ThemeProvider
│   ├── index.tsx                # Главный экран (простой placeholder)
│   └── (search)/
│       └── _layout.tsx          # Layout Group для поиска
│
├── components/
│   └── ui/
│       ├── button.tsx           # Button компонент (CVA) ✅
│       └── text.tsx             # Text компонент (CVA) ✅
│
├── hooks/
│   ├── use-color-scheme.ts      # Хук для получения темы
│   └── use-color-scheme.web.ts
│
├── lib/
│   └── utils.ts                 # cn() утилита для merging classnames
│
├── constants/
│   └── (папка существует)
│
├── assets/
│   └── (папка существует)
│
├── docs/
│   ├── TASK.md                  # Исходный файл с заданиями
│   └── IMPLEMENTATION_PLAN.md   # План реализации
│
├── tailwind.config.js           # Настроенный Tailwind конфиг ✅
├── app.json                     # Expo конфиг ✅
├── tsconfig.json                # TypeScript конфиг ✅
├── babel.config.js              # Babel конфиг с nativewind плагином ✅
├── global.css                   # Глобальные стили
├── metro.config.js              # Metro конфиг для React Native
└── components.json              # Конфиг для компонентов
```

---

## 🏗️ Что нужно создать

### Фаза 1: Avia Search (ЗАДАНИЕ 1)

**Структура:**
```
app/
├── (search)/
│   ├── _layout.tsx          ✅ частично (есть но пусто)
│   ├── index.tsx            ❌ нужно создать (SearchForm)
│   ├── results.tsx          ❌ нужно создать (Results с фильтрами)
│   └── [offerId].tsx        ❌ нужно создать (Detail экран)

app/components/search/
├── SearchForm.tsx           ❌ нужно создать
├── OfferCard.tsx            ❌ нужно создать
├── FilterModal.tsx          ❌ нужно создать
├── FilterChips.tsx          ❌ нужно создать
└── EmptyState.tsx           ❌ нужно создать

app/types/
└── search.ts                ❌ нужно создать (TS типы)

app/stores/
└── searchStore.ts           ❌ нужно создать (Zustand store)

app/hooks/
├── useFlightOffers.ts       ❌ нужно создать (TanStack Query)
└── useSearchFilters.ts      ❌ нужно создать (useMemo оптимизация)

app/utils/
└── filterOffers.ts          ❌ нужно создать (логика фильтрации)
```

### Фаза 2: Railway Wagon (ЗАДАНИЕ 2)

```
app/
└── (booking)/
    └── train-[id]/
        └── wagon-[wagId].tsx        ❌ нужно создать

app/components/railway/
├── WagonMap.tsx             ❌ нужно создать
├── SeatGrid.tsx             ❌ нужно создать
├── SeatItem.tsx             ❌ нужно создать
├── PriceDisplay.tsx         ❌ нужно создать
├── SelectionCounter.tsx     ❌ нужно создать
└── ZoomControls.tsx         ❌ нужно создать

app/types/
└── wagon.ts                 ❌ нужно создать

app/hooks/
└── useWagonState.ts         ❌ нужно создать (Zustand)
```

### Фаза 3: Payment & Deep Links (ЗАДАНИЕ 3)

```
app/
└── (checkout)/
    ├── _layout.tsx          ❌ нужно создать
    ├── index.tsx            ❌ нужно создать (Cart)
    ├── payment.tsx          ❌ нужно создать
    ├── success.tsx          ❌ нужно создать (deep link)
    └── failure.tsx          ❌ нужно создать (deep link)

lib/
├── api/
│   ├── iokaClient.ts        ❌ нужно создать (Axios + interceptors)
│   └── ioka.ts              ❌ нужно создать (API functions)
├── services/
│   ├── paymentService.ts    ❌ нужно создать
│   └── sessionStorage.ts    ❌ нужно создать
└── deeplinks/
    ├── config.ts            ❌ нужно создать
    └── linking.ts           ❌ нужно создать

config/
└── sentry.ts                ❌ нужно создать (опционально)

stores/
└── checkoutStore.ts         ❌ нужно создать
```

---

## 🎨 Существующие UI компоненты (готовы)

### Button Component
- **Файл:** [components/ui/button.tsx](components/ui/button.tsx)
- **Статус:** ✅ Готов
- **Варианты:** default, destructive, outline, secondary, ghost, link
- **Размеры:** sm, default, lg, icon
- **Features:** CVA-based, полная поддержка web/native

### Text Component
- **Файл:** [components/ui/text.tsx](components/ui/text.tsx)
- **Статус:** ✅ Готов
- **Варианты:** h1, h2, h3, h4, p, blockquote, code, lead, large, small, muted
- **Features:** CVA-based, accessibility поддержка

---

## 🔧 Инструменты и утилиты

### CSS Helper (cn)
```typescript
import { cn } from '@/lib/utils'

const classes = cn(
  'bg-blue-600',
  isActive && 'bg-blue-700',
  'px-4 py-2'
)
```

### TypeScript
- Строгий режим: `"strict": true` ✅
- Path alias: `@/*` указывает на root ✅
- Auto types для Expo ✅

### Tailwind CSS
- NativeWind preset установлен ✅
- Darkmode: class-based ✅
- Кастомные цвета (primary, secondary, destructive, muted, accent и т.д.) ✅
- Кастомные radius и animations ✅

---

## 📊 Зависимости - Полный список

### Установлены ✅
```json
{
  "@tanstack/react-query": "^5.96.2",
  "zustand": "^5.0.12",
  "react-native-reanimated": "~4.1.1",
  "expo-haptics": "~15.0.8",
  "expo-linking": "~8.0.11",
  "expo-router": "~6.0.23",
  "nativewind": "^4.2.3",
  "tailwindcss": "^3.4.19"
}
```

### Требуются (НЕ установлены) ❌
```json
{
  "@sentry/react-native": "^x.x.x",     // Для мониторинга (опционально)
  "axios": "^x.x.x",                    // Для HTTP клиента (есть fetch)
  "expo-secure-store": "~x.x.x"        // Для хранения токенов (опционально)
}
```

---

## 🎯 Готовность компонентов к использованию

| Компонент | Статус | Файл | Заметки |
|-----------|--------|------|---------|
| Button | ✅ Готов | ui/button.tsx | Все варианты CVA |
| Text | ✅ Готов | ui/text.tsx | Разные типы текста |
| cn() utility | ✅ Готов | lib/utils.ts | Для merging classnames |
| Color Scheme Hook | ✅ Готов | hooks/ | Dark/Light mode |
| Tailwind Config | ✅ Готов | tailwind.config.js | Полная конфигурация |

---

## 📋 Рекомендуемый порядок разработки

### День 1: Setup & Types ✅
- ✅ Основные зависимости установлены
- ⏳ Создать папки для типов, stores, utils
- ⏳ Создать base types (search.ts, wagon.ts)

### День 2-3: Avia Feature 🎯
- ⏳ Zustand store + TanStack Query
- ⏳ UI компоненты (SearchForm, OfferCard, FilterModal)
- ⏳ Логика фильтрации с useMemo
- ⏳ Интеграция в app/

### День 4-5: Railway Feature
- ⏳ Wagon types & Zustand store
- ⏳ SeatItem с Reanimated + Haptics  
- ⏳ SeatGrid с Absolute positioning
- ⏳ WagonMap с Zoom/Pan

### День 6-7: Payment & Deep Links
- ⏳ Axios client с interceptors
- ⏳ Deep linking конфигурация
- ⏳ Checkout flow
- ⏳ Sentry integration (опционально)

---

## 🚀 Готовность к старту

**ЗЕЛЕНАЯ ТОЧКА:** Проект полностью готов к разработке!
- ✅ Все базовые зависимости установлены
- ✅ Tailwind + NativeWind настроен
- ✅ TypeScript конфигурирован
- ✅ UI библиотека базовых компонентов создана
- ✅ Структура папок создана

**Можно начинать разработку ЗАДАНИЯ 1 прямо сейчас!**
