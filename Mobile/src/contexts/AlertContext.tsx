import React, { createContext, useContext, useState } from 'react';
import { AlertContextType, Alert } from '@/types';
import { satelliteService } from '@/services/satelliteService';

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const mockAlerts = satelliteService.generateMockAlerts();
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Fetch alerts error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectAlert = (alert: Alert | null) => {
    setSelectedAlert(alert);
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await satelliteService.acknowledgeAlert(alertId);
      setAlerts(alerts.map(a => 
        a.id === alertId ? { ...a, status: 'acknowledged' } : a
      ));
    } catch (error) {
      console.error('Acknowledge alert error:', error);
    }
  };

  const clearAlerts = () => {
    setAlerts([]);
    setSelectedAlert(null);
  };

  const value: AlertContextType = {
    alerts,
    isLoading,
    selectedAlert,
    fetchAlerts,
    selectAlert,
    acknowledgeAlert,
    clearAlerts,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export const useAlerts = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};