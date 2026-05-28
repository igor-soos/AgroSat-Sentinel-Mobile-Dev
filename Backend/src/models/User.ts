export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  password: string;
  role: 'farmer' | 'analyst' | 'admin' | 'civil_defense';
  avatar?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse extends Omit<User, 'password'> {}

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

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: UserResponse;
}