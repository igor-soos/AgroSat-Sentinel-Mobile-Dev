export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'farmer' | 'analyst' | 'admin' | 'civil_defense';
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
  role: User['role'];
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

export interface Alert {
  id: string;
  propertyId: string;
  type: 'drought' | 'fire' | 'frost' | 'flood';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  ndvi?: number;
  temperature?: number;
  confidence: number;
  status: 'active' | 'acknowledged' | 'resolved';
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertContextType {
  alerts: Alert[];
  isLoading: boolean;
  fetchAlerts: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
}