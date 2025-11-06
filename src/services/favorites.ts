import apiClient from './apiClient';
import { Favorite } from '../types/property';

const favoritesService = {
  getAll: async (): Promise<Favorite[]> => {
    const response = await apiClient.get('/favorites');
    return response.data;
  },

  add: async (listingId: number): Promise<void> => {
    await apiClient.post('/favorites', { listingId });
  },

  remove: async (listingId: number): Promise<void> => {
    await apiClient.delete('/favorites', { data: { listingId } });
  },
};

export default favoritesService;
