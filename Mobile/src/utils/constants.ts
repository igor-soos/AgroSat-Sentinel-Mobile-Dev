// API Endpoints
import { Platform } from 'react-native';

const getApiBaseUrl = () => {
  // Se rodar no navegador (Web), força o uso do localhost independente do .env
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  }
  
  // Se rodar no Android/iOS, usa o .env ou o fallback padrão do emulador
  return process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:3000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_TIMEOUT = process.env.EXPO_PUBLIC_API_TIMEOUT 
  ? parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT, 10) 
  : 10000;

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@agrosat_user_token',
  USER_DATA: '@agrosat_user_data',
  FAVORITES: '@agrosat_favorites',
  ALERTS_CACHE: '@agrosat_alerts_cache',
  SETTINGS: '@agrosat_settings',
};

// Default values
export const DEFAULT_COORDINATES = {
  latitude: -10.2641,   // Brazil center
  longitude: -55.5012,
  latitudeDelta: 20,
  longitudeDelta: 20,
};

// NDVI Thresholds
export const NDVI_THRESHOLDS = {
  WATER: [-0.3, 0.1],
  BARREN: [0.1, 0.3],
  SPARSE_VEGETATION: [0.3, 0.5],
  MODERATE_VEGETATION: [0.5, 0.7],
  DENSE_VEGETATION: [0.7, 1.0],
};

// Fire detection thresholds (simulated)
export const FIRE_THRESHOLDS = {
  THERMAL_ANOMALY: 60,  // Celsius
  CONFIDENCE_HIGH: 0.8,
  CONFIDENCE_MEDIUM: 0.5,
};

// Pagination
export const PAGINATION = {
  ALERTS_PER_PAGE: 20,
  MAPS_PER_PAGE: 10,
};
