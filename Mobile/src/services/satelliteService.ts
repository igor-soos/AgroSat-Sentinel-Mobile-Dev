import { apiClient } from './api';
import { Alert, NDVIData, ThermalAnomaly, Dashboard } from '@/types';

class SatelliteService {
  async getAlerts(latitude?: number, longitude?: number): Promise<Alert[]> {
    try {
      const params = latitude && longitude ? { latitude, longitude } : {};
      const response = await apiClient.get<Alert[]>('/satellite/alerts', { params });
      return response.data;
    } catch (error) {
      console.error('Get alerts error:', error);
      throw error;
    }
  }

  async getAlert(alertId: string): Promise<Alert> {
    try {
      const response = await apiClient.get<Alert>(`/satellite/alerts/${alertId}`);
      return response.data;
    } catch (error) {
      console.error('Get alert error:', error);
      throw error;
    }
  }

  async getNDVIData(latitude: number, longitude: number): Promise<NDVIData> {
    try {
      const response = await apiClient.get<NDVIData>('/satellite/ndvi', {
        params: { latitude, longitude },
      });
      return response.data;
    } catch (error) {
      console.error('Get NDVI data error:', error);
      throw error;
    }
  }

  async getThermalAnomalies(latitude?: number, longitude?: number): Promise<ThermalAnomaly[]> {
    try {
      const params = latitude && longitude ? { latitude, longitude } : {};
      const response = await apiClient.get<ThermalAnomaly[]>('/satellite/thermal', { params });
      return response.data;
    } catch (error) {
      console.error('Get thermal anomalies error:', error);
      throw error;
    }
  }

  async getDashboard(): Promise<Dashboard> {
    try {
      const response = await apiClient.get<Dashboard>('/satellite/dashboard');
      return response.data;
    } catch (error) {
      console.error('Get dashboard error:', error);
      throw error;
    }
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      await apiClient.post(`/satellite/alerts/${alertId}/acknowledge`, {});
    } catch (error) {
      console.error('Acknowledge alert error:', error);
      throw error;
    }
  }

  // Simulated data for demonstration
  generateMockAlerts(count: number = 5): Alert[] {
    const types: Alert['type'][] = ['drought', 'fire', 'frost', 'flood'];
    const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
    const alerts: Alert[] = [];

    for (let i = 0; i < count; i++) {
      alerts.push({
        id: `alert-${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        title: `Alert ${i + 1}`,
        description: 'Mock alert for demonstration',
        location: {
          latitude: -10.2641 + Math.random() * 2 - 1,
          longitude: -55.5012 + Math.random() * 2 - 1,
        },
        ndvi: Math.random() * 0.5 + 0.2,
        temperature: Math.random() * 30 + 20,
        confidence: Math.random() * 0.3 + 0.7,
        timestamp: new Date().toISOString(),
        status: 'active',
      });
    }

    return alerts;
  }
}

export const satelliteService = new SatelliteService();