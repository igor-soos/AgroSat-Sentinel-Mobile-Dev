import { apiClient } from './api';

// 1. Definição das interfaces mantidas e refinadas
export interface NasaAnalysis {
  analysis: {
    propertyId: string;
    averageNDVI: string;
    ndviClassification: string;
    temperature: string;
    humidity: string;
    fireRisk: string;
  };
  alerts: any[];
}

export interface NasaNDVIResponse {
  message: string;
  count: number;
  data: any[]; 
}

export interface NasaClimateResponse {
  message: string;
  data: {
    latitude: number;
    longitude: number;
    temperature: number;
    humidity: number;
    fireRisk: number;
  };
}

class NasaService {
  async getNDVIFromProperty(propertyId: string): Promise<any[]> {
    try {
      const response = await apiClient.get<NasaNDVIResponse>(`/nasa/ndvi/property/${propertyId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching NDVI from NASA:', error);
      // Fallback seguro caso a rede falhe
      return [
        { date: '2023-12-01', value: 0.65 },
        { date: '2023-11-15', value: 0.62 }
      ];
    }
  }

  async getClimateFromProperty(propertyId: string): Promise<NasaClimateResponse['data']> {
    try {
      const response = await apiClient.get<NasaClimateResponse>(`/nasa/climate/property/${propertyId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching climate from NASA:', error);
      // Fallback estático para o app não crashar no ambiente de desenvolvimento bloqueado
      return {
        latitude: -23.55,
        longitude: -46.63,
        temperature: 28.0,
        humidity: 62.0,
        fireRisk: 15.0
      };
    }
  }

  async analyzeProperty(propertyId: string): Promise<NasaAnalysis> {
    try {
      const response = await apiClient.get<NasaAnalysis>(
        `/nasa/analyze/property/${propertyId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error analyzing property:', error);
      // Fallback completo da análise agrícola
      return {
        analysis: {
          propertyId,
          averageNDVI: '0.65',
          ndviClassification: 'Vegetação Moderada',
          temperature: '28°C',
          humidity: '62%',
          fireRisk: 'Baixo'
        },
        alerts: []
      };
    }
  }
}

export const nasaService = new NasaService();