import axios from 'axios';
import { Preferences } from '@capacitor/preferences';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

const PUBLIC_ROUTES = ['/login', '/register', '/refresh'];

const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use(
  async (config) => {
    const isPublic = PUBLIC_ROUTES.some((route) => config.url?.includes(route));
    if (!isPublic) {
      const { value: token } = await Preferences.get({
        key: 'Palazzo.accessToken',
      });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { value: refreshToken } = await SecureStoragePlugin.get({
          key: 'Palazzo.refreshToken',
        });

        if (!refreshToken) throw new Error('No refresh token');

        const { default: authService } = await import('./auth');
        await authService.refreshToken(refreshToken);

        const { value: newToken } = await Preferences.get({
          key: 'Palazzo.accessToken',
        });

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        await Preferences.remove({ key: 'Palazzo.accessToken' });
        await SecureStoragePlugin.remove({ key: 'Palazzo.refreshToken' });
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
