import { apiClient } from './api';
import { storageService } from './storageService';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';

export class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Salva token e dados do usuário
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

      // Salva token e dados do usuário
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
      // Chama endpoint de logout no backend
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpa dados locais mesmo se o backend falhar
      await storageService.clearAll();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
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