import { api } from './api';
import { authStore } from './authStore';
import type {
  AuthResponse,
  LoginPayload,
  MeResponse,
  RefreshResponse,
  RegisterPayload,
} from '../types/auth.types';

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    authStore.setToken(data.accessToken);
    return data;
  },

  async login(payload: LoginPayload) {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    authStore.setToken(data.accessToken);
    return data;
  },

  async refresh() {
    const { data } = await api.post<RefreshResponse>('/auth/refresh');
    authStore.setToken(data.accessToken);
    return data;
  },

  async me() {
    const { data } = await api.get<MeResponse>('/auth/me');
    return data.user;
  },

  async logout() {
    await api.post('/auth/logout');
    authStore.setToken(null);
  },
};
