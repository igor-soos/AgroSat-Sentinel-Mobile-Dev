import { ValidationError } from './errors';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): void => {
  if (!password || password.length < 6) {
    throw new ValidationError('Senha deve ter pelo menos 6 caracteres');
  }
};

export const validateLoginRequest = (email: string, password: string): void => {
  if (!email || !validateEmail(email)) {
    throw new ValidationError('Email inválido');
  }
  validatePassword(password);
};

export const validateRegisterRequest = (
  email: string,
  password: string,
  fullName: string,
  username: string,
  role: string
): void => {
  if (!fullName || fullName.trim().length < 3) {
    throw new ValidationError('Nome completo deve ter pelo menos 3 caracteres');
  }

  if (!username || username.trim().length < 3) {
    throw new ValidationError('Username deve ter pelo menos 3 caracteres');
  }

  validateLoginRequest(email, password);

  const validRoles = ['farmer', 'analyst', 'admin', 'civil_defense'];
  if (!validRoles.includes(role)) {
    throw new ValidationError('Role inválido');
  }
};

export const validatePropertyRequest = (
  name: string,
  area: number,
  latitude: number,
  longitude: number
): void => {
  if (!name || name.trim().length < 3) {
    throw new ValidationError('Nome da propriedade deve ter pelo menos 3 caracteres');
  }

  if (!area || area <= 0) {
    throw new ValidationError('Área deve ser maior que 0');
  }

  if (latitude < -90 || latitude > 90) {
    throw new ValidationError('Latitude inválida');
  }

  if (longitude < -180 || longitude > 180) {
    throw new ValidationError('Longitude inválida');
  }
};