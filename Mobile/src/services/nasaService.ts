import { apiClient } from './api';

// 1. Definição das interfaces com base no que o seu backend responde
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
  data: any[]; // Substitua 'any' pelo tipo do seu NDVI se tiver (ex: NDVIData[])
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
      // Passando <NasaNDVIResponse> o TS passa a reconhecer o .data.data perfeitamente!
      const response = await apiClient.get<NasaNDVIResponse>(`/nasa/ndvi/property/${propertyId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching NDVI from NASA:', error);
      throw error;
    }
  }

  async getClimateFromProperty(propertyId: string): Promise<any> {
    try {
      // Passando <NasaClimateResponse> o TS mapeia o objeto de clima retornado
      const response = await apiClient.get<NasaClimateResponse>(`/nasa/climate/property/${propertyId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching climate from NASA:', error);
      throw error;
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
      throw error;
    }
  }
}

export const nasaService = new NasaService();