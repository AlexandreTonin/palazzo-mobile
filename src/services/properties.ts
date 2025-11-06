import apiClient from './apiClient';
import {
  Property,
  PropertiesResponse,
  PropertyFilters,
  CreatePropertyData,
  UpdatePropertyData,
} from '../types/property';

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
      if (filters.minBedrooms)
        params.append('minBedrooms', filters.minBedrooms.toString());
      if (filters.minBathrooms)
        params.append('minBathrooms', filters.minBathrooms.toString());
      if (filters.minSquareMeters)
        params.append('minSquareMeters', filters.minSquareMeters.toString());
      if (filters.minPrice)
        params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice)
        params.append('maxPrice', filters.maxPrice.toString());
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

  create: async (data: CreatePropertyData): Promise<Property> => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('price', data.price);
    formData.append('description', data.description);
    formData.append('city', data.city);
    formData.append('neighborhood', data.neighborhood);
    formData.append('region', data.region);
    formData.append('country', data.country);
    formData.append('bedrooms', data.bedrooms.toString());
    formData.append('bathrooms', data.bathrooms.toString());
    formData.append('squareMeters', data.squareMeters.toString());
    formData.append('contactPhone', data.contactPhone);
    formData.append('contactEmail', data.contactEmail);

    if (data.images) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await apiClient.post('/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (
    id: string | number,
    data: UpdatePropertyData
  ): Promise<Property> => {
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.type) formData.append('type', data.type);
    if (data.price) formData.append('price', data.price);
    if (data.description) formData.append('description', data.description);
    if (data.city) formData.append('city', data.city);
    if (data.neighborhood) formData.append('neighborhood', data.neighborhood);
    if (data.region) formData.append('region', data.region);
    if (data.country) formData.append('country', data.country);
    if (data.bedrooms) formData.append('bedrooms', data.bedrooms.toString());
    if (data.bathrooms) formData.append('bathrooms', data.bathrooms.toString());
    if (data.squareMeters)
      formData.append('squareMeters', data.squareMeters.toString());
    if (data.contactPhone) formData.append('contactPhone', data.contactPhone);
    if (data.contactEmail) formData.append('contactEmail', data.contactEmail);

    if (data.images) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    if (data.removeImages) {
      data.removeImages.forEach((imageKey) => {
        formData.append('removeImages', imageKey);
      });
    }

    const response = await apiClient.patch(`/listings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/listings/${id}`);
  },
};

export default propertiesService;
