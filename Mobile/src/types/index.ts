export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export interface Property {
  id: string;
  userId: string;
  name: string;
  area: number;
  latitude: number;
  longitude: number;
  crops?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertContextType {
  alerts: Alert[];
  isLoading: boolean;
  selectedAlert: Alert | null;
  fetchAlerts: () => Promise<void>;
  selectAlert: (alert: Alert | null) => void;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert?: (alertId: string) => Promise<void>;
}

// 1. Tipo para Coordenadas Geográficas (Reutilizável)
export interface Location {
  latitude: number;
  longitude: number;
}

// 2. Modelo de Alerta Atualizado (Com a propriedade location obrigatória)
export interface Alert {
  id: string;
  propertyId?: string; // opcional se gerado via mock genérico
  type: 'drought' | 'fire' | 'frost' | 'flood';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: Location; // <-- Adicionado aqui conforme você pediu!
  ndvi?: number;
  temperature?: number;
  confidence: number;
  status: 'active' | 'acknowledged' | 'resolved';
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

// 3. Modelo de Dados NDVI (Índice de Vegetação por Diferença Normalizada)
export interface NDVIData {
  latitude: number;
  longitude: number;
  currentValue: number;
  historicalData: {
    date: string;
    value: number;
  }[];
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

// 4. Modelo de Anomalia Térmica (Focos de Calor captados por satélites tipo MODIS/INPE)
export interface ThermalAnomaly {
  id: string;
  location: Location;
  temperature: number; // Em graus Celsius (e.g., 85°C para focos intensos)
  satellite: string;   // Ex: AQUA, TERRA, NOAA
  confidence: number;  // Valor de 0 a 1 (ou 0% a 100%)
  timestamp: string;
}

// 5. Modelo do Dashboard Consolidado
export interface Dashboard {
  totalAlerts: number;
  activeAlertsCount: number;
  criticalAlertsCount: number;
  averageNDVI: number;
  recentAnomalies: ThermalAnomaly[];
  recentAlerts: Alert[];
}