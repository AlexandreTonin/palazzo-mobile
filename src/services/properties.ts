import apiClient from './apiClient';
import { Property, PropertiesResponse } from '../types/property';

interface PropertyFilters {
  page?: number;
  limit?: number;
  type?: 'house' | 'apartment' | 'penthouse' | 'loft';
  search?: string;
  country?: string;
  city?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  minSquareMeters?: number;
  minPrice?: number;
  maxPrice?: number;
}

const propertiesService = {
  getAll: async (filters?: PropertyFilters): Promise<PropertiesResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      if (filters.country) params.append('country', filters.country);
      if (filters.city) params.append('city', filters.city);
      if (filters.minBedrooms) params.append('minBedrooms', filters.minBedrooms.toString());
      if (filters.minBathrooms) params.append('minBathrooms', filters.minBathrooms.toString());
      if (filters.minSquareMeters) params.append('minSquareMeters', filters.minSquareMeters.toString());
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/listings?${queryString}` : '/listings';
    
    const response = await apiClient.get(url);
    return response.data;
  },

  getById: async (id: string | number): Promise<Property> => {
    const response = await apiClient.get(`/listings/${id}`);
    return response.data;
  },
};

export default propertiesService;
