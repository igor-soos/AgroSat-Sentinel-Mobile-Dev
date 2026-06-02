import { apiClient } from './api';
import { Property } from '@/types';

class PropertyService {
  async createProperty(data: {
    name: string;
    area: number;
    latitude: number;
    longitude: number;
    crops?: string;
  }): Promise<Property> {
    try {
      const response = await apiClient.post<Property>('/properties', data);
      return response.data;
    } catch (error) {
      console.error('Create property error:', error);
      throw error;
    }
  }

  async getProperties(): Promise<Property[]> {
    try {
      const response = await apiClient.get<Property[]>('/properties');
      return response.data;
    } catch (error) {
      console.error('Get properties error:', error);
      throw error;
    }
  }

  async getPropertyById(id: string): Promise<Property> {
    try {
      const response = await apiClient.get<Property>(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get property error:', error);
      throw error;
    }
  }

  async updateProperty(
    id: string,
    data: Partial<{
      name: string;
      area: number;
      latitude: number;
      longitude: number;
      crops?: string;
    }>
  ): Promise<Property> {
    try {
      const response = await apiClient.put<Property>(`/properties/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update property error:', error);
      throw error;
    }
  }

  async deleteProperty(id: string): Promise<void> {
    try {
      await apiClient.delete(`/properties/${id}`);
    } catch (error) {
      console.error('Delete property error:', error);
      throw error;
    }
  }
}

export const propertyService = new PropertyService();