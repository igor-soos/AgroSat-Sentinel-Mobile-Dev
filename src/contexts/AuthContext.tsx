import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, RegisterRequest } from '@/types';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const userData = await storageService.getUserData();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Bootstrap error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user);
    } catch (error) {
      console.error('Login context error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
    } catch (error) {
      console.error('Register context error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout context error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const user = await authService.updateProfile(updatedUser);
      setUser(user);
    } catch (error) {
      console.error('Update user context error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: user !== null,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};