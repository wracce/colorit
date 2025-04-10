// src/lib/store/auth-store.ts
import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  email: string;
  fullName?: string;
  phone?: string;
  website?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  avatarUrl?: string;
  bio?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

function sanitizeUserData(data: any) {
    const { _id, email, __v, ...cleaned } = data;
    return cleaned;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/users/v1/auth/login', { email, password });
      const token = res.data.access_token;
      set({ accessToken: token });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await get().fetchProfile();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Ошибка входа' });
    } finally {
      set({ loading: false });
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/users/v1/auth/register', { email, password });
      const token = res.data.access_token;
      set({ accessToken: token });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await get().fetchProfile();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Ошибка регистрации' });
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    try {
      const res = await api.get('/users/v1/users/me');
      set({ user: res.data });
    } catch (err: any) {
      set({ error: 'Не удалось загрузить профиль' });
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await api.patch('/users/v1/users/me', sanitizeUserData(data));
      set({ user: res.data });
    } catch (err: any) {
      set({ error: 'Ошибка обновления профиля' });
    }
  },
  logout: () => {
    set({ accessToken: null, user: null });
    delete api.defaults.headers.common['Authorization'];
  },
}));
