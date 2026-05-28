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

export interface CreateThermalAnomalyRequest {
  propertyId: string;
  latitude: number;
  longitude: number;
  temperature: number;
  anomaly: boolean;
  confidence: number;
}