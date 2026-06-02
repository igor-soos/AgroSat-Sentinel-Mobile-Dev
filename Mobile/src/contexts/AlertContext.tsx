import React, { createContext, useContext, useState } from 'react';
import { Alert as AlertType, AlertContextType } from '@/types';

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([
    {
      id: '1',
      propertyId: '1',
      type: 'drought',
      severity: 'high',
      title: 'Seca Detectada',
      description: 'Baixa umidade do solo detectada na área A',
      // Ajustado: agrupado em location conforme a nova tipagem
      location: {
        latitude: -10.2641,
        longitude: -55.5012,
      },
      ndvi: 0.35,
      temperature: 32,
      confidence: 0.92,
      status: 'active',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      propertyId: '1',
      type: 'fire',
      severity: 'critical',
      title: 'Queimada em Progresso',
      description: 'Temperatura anormal detectada',
      // Ajustado: agrupado em location conforme a nova tipagem
      location: {
        latitude: -10.2700,
        longitude: -55.5100,
      },
      temperature: 85,
      confidence: 0.95,
      status: 'active',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      propertyId: '1',
      type: 'frost',
      severity: 'medium',
      title: 'Geada Possível',
      description: 'Temperatura em queda para próximas horas',
      // Ajustado: agrupado em location conforme a nova tipagem
      location: {
        latitude: -10.2600,
        longitude: -55.5000,
      },
      temperature: 2,
      confidence: 0.75,
      status: 'acknowledged',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      // TODO: Conectar ao backend
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      // TODO: Chamar backend
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
        )
      );
      
      if (selectedAlert?.id === alertId) {
        setSelectedAlert((prev) => prev ? { ...prev, status: 'acknowledged' } : null);
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const selectAlert = (alert: AlertType | null) => {
    setSelectedAlert(alert);
  };

  const value: AlertContextType = {
    alerts,
    isLoading,
    selectedAlert,
    fetchAlerts,
    acknowledgeAlert,
    selectAlert,
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