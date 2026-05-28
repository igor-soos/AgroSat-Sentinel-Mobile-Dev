// Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  role: 'farmer' | 'analyst' | 'admin' | 'civil_defense';
  location?: {
    latitude: number;
    longitude: number;
  };
  properties?: Property[];
  createdAt: string;
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
  role: User['role'];
  cpf?: string;
  phone?: string;
}

// Property/Farm Types
export interface Property {
  id: string;
  name: string;
  area: number; // hectares
  location: {
    latitude: number;
    longitude: number;
  };
  crops: string[];
  alerts?: Alert[];
  createdAt: string;
}

// Alert Types
export interface Alert {
  id: string;
  type: 'drought' | 'fire' | 'frost' | 'flood';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  ndvi?: number;
  temperature?: number;
  confidence: number; // 0-1
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  property?: Property;
}

// Satellite Data Types
export interface NDVIData {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  value: number; // -1 to 1
  classification: 'water' | 'barren' | 'sparse' | 'moderate' | 'dense';
  timestamp: string;
  source: 'sentinel2' | 'landsat8';
}

export interface ThermalAnomaly {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  temperature: number;
  anomaly: boolean;
  confidence: number;
  timestamp: string;
}

export interface Dashboard {
  totalAlerts: number;
  activeAlerts: Alert[];
  ndviAverage: number;
  thermalAnomalies: number;
  lastUpdate: string;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export interface AlertContextType {
  alerts: Alert[];
  isLoading: boolean;
  selectedAlert: Alert | null;
  fetchAlerts: () => Promise<void>;
  selectAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  clearAlerts: () => void;
}
