import { generateCheckout } from "@/lib/constants/checkout";
import { generateOffers } from "@/lib/constants/offers";
import { CURRENCY } from "@/lib/constants/shared";
import { generateCarriage } from "@/lib/constants/wagon";
import { getScenario } from "@/lib/mock";
import * as Sentry from "@sentry/react-native";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import * as ExpoCrypto from "expo-crypto";
import { router } from "expo-router";

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const $api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

$api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;

    if (!error.response) {
      Sentry.captureMessage("Network Error", "log");
      return Promise.reject(error);
    }

    const { status } = error.response;

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => $api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = "new_mock_token";

        isRefreshing = false;
        processQueue(null, newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return $api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(new Error("Session expired"), null);

        setTimeout(() => {
          router.replace("/(tabs)/checkout");
        }, 100);

        return Promise.reject(refreshError);
      }
    }

    if (status >= 400 && status < 500) {
      Sentry.withScope((scope) => {
        scope.setExtra("payload", originalRequest.data);
        scope.setExtra("response", error.response?.data);
        Sentry.captureException(new Error(`API Client Error ${status}`));
      });
    }

    return Promise.reject(error);
  },
);

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
        id: ExpoCrypto.randomUUID(),
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
