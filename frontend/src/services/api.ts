import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authStore } from './authStore';
import type { RefreshResponse } from '../types/auth.types';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const AUTH_ENDPOINTS_WITHOUT_RETRY = ['/auth/login', '/auth/register', '/auth/refresh'];

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = authStore.getToken();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;

    const isAuthEndpoint = AUTH_ENDPOINTS_WITHOUT_RETRY.some((endpoint) =>
      config?.url?.includes(endpoint),
    );

    if (error.response?.status !== 401 || !config || config._retried || isAuthEndpoint) {
      throw error;
    }

    config._retried = true;

    try {
      const { data } = await axios.post<RefreshResponse>(
        `${baseURL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      authStore.setToken(data.accessToken);
      config.headers.set('Authorization', `Bearer ${data.accessToken}`);

      return api(config);
    } catch (refreshError) {
      authStore.setToken(null);
      authStore.notifyUnauthorized();
      throw refreshError;
    }
  },
);
