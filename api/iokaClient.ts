import * as Sentry from "@sentry/react-native";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

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
