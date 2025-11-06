import apiClient from './apiClient';
import axios from 'axios';
import { Preferences } from '@capacitor/preferences';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  UserProfile,
} from '../types/user';

const authService = {
  login: async ({
    email,
    password,
  }: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/login', { email, password });
    const { accessToken, refreshToken } = response.data;

    await Preferences.set({ key: 'Palazzo.accessToken', value: accessToken });
    await SecureStoragePlugin.set({
      key: 'Palazzo.refreshToken',
      value: refreshToken,
    });

    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post('/register', data);
    return response.data;
  },

  me: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await Preferences.remove({ key: 'Palazzo.accessToken' });
    await SecureStoragePlugin.remove({ key: 'Palazzo.refreshToken' });
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<{ accessToken: string }> => {
    const response = await axios.post('/api/refresh', { refreshToken });
    const { accessToken } = response.data;

    await Preferences.set({ key: 'Palazzo.accessToken', value: accessToken });

    return response.data;
  },
};

export default authService;
