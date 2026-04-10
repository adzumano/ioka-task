import { generateCheckout } from "@/lib/constants/checkout";
import { generateOffers } from "@/lib/constants/offers";
import { CURRENCY } from "@/lib/constants/shared";
import { generateCarriage } from "@/lib/constants/wagon";
import { getScenario } from "@/lib/mock";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

export const $api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// $api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   return config;
// });

// $api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

//     // Вытягиваем order_id из тела запроса или параметров, если он там был
//     const orderId = (originalRequest.data as any)?.order_id || originalRequest.params?.order_id;

//     if (error.response) {
//       const { status, data }: { status: number; data: any } = error.response;

//       // 1. Reliability: Логирование специфических ошибок Ioka
//       // Например: несовпадение суммы или отклонение банком
//       if (status === 400 || status === 422) {
//         Sentry.withScope((scope) => {
//           if (orderId) scope.setTag("order_id", orderId);
//           scope.setExtra("api_error_data", data);
//           scope.setLevel("warning");
//           Sentry.captureException(new Error(`Ioka Payment Error: ${data.message || status}`));
//         });
//       }

//       // 2. Interceptor: Обработка истекшей сессии оплаты (401/403)
//       if ((status === 401 || status === 403) && !originalRequest._retry) {
//         originalRequest._retry = true;

//         try {
//           // Здесь вызываем функцию пересоздания заказа или обновления токена
//           // const newOrder = await refreshPaymentSession(orderId);
//           // Если успешно обновили — повторяем исходный запрос
//           // return api(originalRequest);
//         } catch (refreshError) {
//           // Если даже рефреш упал — отправляем пользователя на шаг создания заказа
//           // router.replace('/basket/create-order');
//           return Promise.reject(refreshError);
//         }
//       }
//     } else {
//       // Ошибки сети (no internet и т.д.)
//       Sentry.captureMessage("Network Error or Timeout", "log");
//     }

//     return Promise.reject(error);
//   },
// );

const mock = new AxiosMockAdapter($api, { delayResponse: 1300 });

mock.onGet("/api/search/flight").reply(() => {
  const scenario = getScenario();

  switch (scenario) {
    case "success":
      return [200, generateOffers({ count: 500 })];
    case "empty":
      return [200, []];
    case "error":
      return [500, { message: "Internal Server Error", success: false }];
  }
});

mock.onGet("/api/travel").reply(() => {
  const scenario = getScenario();

  switch (scenario) {
    case "success":
      return [200, generateCarriage()];
    case "empty":
    case "error":
      return [500, { message: "Internal Server Error", success: false }];
  }
});

mock.onGet("/api/checkout").reply(() => {
  const scenario = getScenario();

  switch (scenario) {
    case "success":
      return [200, generateCheckout()];
    case "empty":
    case "error":
      return [500, { message: "Internal Server Error", success: false }];
  }
});

mock.onPost(`/api/orders`).reply((config) => {
  const { amount, external_id } = JSON.parse(config.data);
  const scenario = getScenario();

  if (scenario === "error") {
    return [400, { message: "Invalid amount or currency", code: "VALIDATION_ERROR" }];
  }

  return [
    200,
    {
      order: {
        id: crypto.randomUUID(),
        status: "UNPAID",
        amount,
        currency: CURRENCY,
        external_id: external_id,
        checkout_url: `https://checkout.ioka.kz/orders/example_id?token=example_token`,
      },
      order_access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
  ];
});
