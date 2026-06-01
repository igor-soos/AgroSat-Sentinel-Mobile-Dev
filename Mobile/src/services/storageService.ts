import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/utils/constants';
import { User } from '@/types';

class StorageService {
  async setUserToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }

  async getUserToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async setUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  async getUserData(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async setAlertCache(alerts: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ALERTS_CACHE, JSON.stringify(alerts));
    } catch (error) {
      console.error('Error saving alerts cache:', error);
    }
  }

  async getAlertCache(): Promise<any[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ALERTS_CACHE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting alerts cache:', error);
      return null;
    }
  }

  async setFavorites(favorites: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  async getFavorites(): Promise<string[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting favorites:', error);
      return null;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.ALERTS_CACHE,
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.SETTINGS,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }
}

export const storageService = new StorageService();