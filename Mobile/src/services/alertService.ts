import { apiClient } from './api';
import { Alert } from '@/types';

class AlertService {
  async getAlerts(limit: number = 50, offset: number = 0): Promise<Alert[]> {
    try {
      const response = await apiClient.get<Alert[]>(
        `/alerts?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      console.error('Get alerts error:', error);
      throw error;
    }
  }

  async getPropertyAlerts(propertyId: string, status?: string): Promise<Alert[]> {
    try {
      let url = `/alerts/property/${propertyId}`;
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get<Alert[]>(url);
      return response.data;
    } catch (error) {
      console.error('Get property alerts error:', error);
      throw error;
    }
  }

  async getAlertById(id: string): Promise<Alert> {
    try {
      const response = await apiClient.get<Alert>(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get alert error:', error);
      throw error;
    }
  }

  async createAlert(data: {
    propertyId: string;
    type: 'drought' | 'fire' | 'frost' | 'flood';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    confidence: number;
    ndvi?: number;
    temperature?: number;
  }): Promise<Alert> {
    try {
      const response = await apiClient.post<Alert>('/alerts', data);
      return response.data;
    } catch (error) {
      console.error('Create alert error:', error);
      throw error;
    }
  }

  async acknowledgeAlert(id: string): Promise<Alert> {
    try {
      const response = await apiClient.patch<Alert>(`/alerts/${id}/acknowledge`, {});
      return response.data;
    } catch (error) {
      console.error('Acknowledge alert error:', error);
      throw error;
    }
  }

  async resolveAlert(id: string): Promise<Alert> {
    try {
      const response = await apiClient.patch<Alert>(`/alerts/${id}/resolve`, {});
      return response.data;
    } catch (error) {
      console.error('Resolve alert error:', error);
      throw error;
    }
  }

  async updateAlert(
    id: string,
    data: Partial<{
      type: string;
      severity: string;
      title: string;
      description: string;
      status: string;
    }>
  ): Promise<Alert> {
    try {
      const response = await apiClient.put<Alert>(`/alerts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update alert error:', error);
      throw error;
    }
  }

  async deleteAlert(id: string): Promise<void> {
    try {
      await apiClient.delete(`/alerts/${id}`);
    } catch (error) {
      console.error('Delete alert error:', error);
      throw error;
    }
  }
}

export const alertService = new AlertService();