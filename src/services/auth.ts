import apiClient from './apiClient';
import { Preferences } from '@capacitor/preferences';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import axios from 'axios';

const authService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const response = await apiClient.post('/login', { email, password });
    const { accessToken, refreshToken } = response.data;

    await Preferences.set({ key: 'Palazzo.accessToken', value: accessToken });
    await SecureStoragePlugin.set({
      key: 'Palazzo.refreshToken',
      value: refreshToken,
    });

    return response.data;
  },

  me: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },

  logout: async () => {
    await Preferences.remove({ key: 'Palazzo.accessToken' });
    await SecureStoragePlugin.remove({ key: 'Palazzo.refreshToken' });
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axios.post('/api/refresh', { refreshToken });
    const { accessToken } = response.data;

    await Preferences.set({ key: 'Palazzo.accessToken', value: accessToken });

    return response.data;
  },
};

export default authService;
