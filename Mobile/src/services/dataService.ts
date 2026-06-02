import { apiClient } from './api';

export interface NDVIData {
  id: string;
  propertyId: string;
  latitude: number;
  longitude: number;
  value: number;
  classification: 'water' | 'barren' | 'sparse' | 'moderate' | 'dense';
  timestamp: string;
  source: string;
  createdAt: string;
}

export interface ThermalAnomaly {
  id: string;
  propertyId: string;
  latitude: number;
  longitude: number;
  temperature: number;
  anomaly: boolean;
  confidence: number;
  timestamp: string;
  createdAt: string;
}

class DataService {
  // NDVI Methods
  async getNDVIData(propertyId: string, limit: number = 100): Promise<NDVIData[]> {
    try {
      const response = await apiClient.get<NDVIData[]>(
        `/data/ndvi/property/${propertyId}?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Get NDVI data error:', error);
      throw error;
    }
  }

  async createNDVIData(data: {
    propertyId: string;
    latitude: number;
    longitude: number;
    value: number;
    classification: string;
    source?: string;
  }): Promise<NDVIData> {
    try {
      const response = await apiClient.post<NDVIData>('/data/ndvi', data);
      return response.data;
    } catch (error) {
      console.error('Create NDVI data error:', error);
      throw error;
    }
  }

  // Thermal Anomaly Methods
  async getThermalAnomalies(
    propertyId: string,
    limit: number = 100
  ): Promise<ThermalAnomaly[]> {
    try {
      const response = await apiClient.get<ThermalAnomaly[]>(
        `/data/thermal/property/${propertyId}?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Get thermal anomalies error:', error);
      throw error;
    }
  }

  async createThermalAnomaly(data: {
    propertyId: string;
    latitude: number;
    longitude: number;
    temperature: number;
    anomaly: boolean;
    confidence: number;
  }): Promise<ThermalAnomaly> {
    try {
      const response = await apiClient.post<ThermalAnomaly>('/data/thermal', data);
      return response.data;
    } catch (error) {
      console.error('Create thermal anomaly error:', error);
      throw error;
    }
  }
}

export const dataService = new DataService();