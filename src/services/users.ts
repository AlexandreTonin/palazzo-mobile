import apiClient from './apiClient';
import { User, UpdateUserData } from '../types/user';

const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getById: async (id: string | number): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: string | number, data: UpdateUserData): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};

export default usersService;
