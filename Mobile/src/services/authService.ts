import { apiClient } from './api';
import { storageService } from './storageService';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      await storageService.setUserToken(token);
      await storageService.setUserData(user);

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);

      const { token, user } = response.data;

      await storageService.setUserToken(token);
      await storageService.setUserData(user);

      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint if needed
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await storageService.clearAll();
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh', {});
      const { token } = response.data;
      await storageService.setUserToken(token);
      return token;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await storageService.getUserData();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async updateProfile(user: User): Promise<User> {
    try {
      const response = await apiClient.put<User>('/auth/profile', user);
      await storageService.setUserData(response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();