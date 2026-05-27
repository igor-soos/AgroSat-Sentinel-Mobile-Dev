export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Minimum 8 characters, 1 uppercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePasswordSimple = (password: string): boolean => {
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }
  // Basic validation (simplified)
  return true;
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';
  if (password.length < 10) return 'medium';
  if (/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) return 'strong';
  return 'medium';
};
