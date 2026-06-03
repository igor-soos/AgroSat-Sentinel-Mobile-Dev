import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/utils/colors';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import {
  validateEmail,
  validatePasswordSimple,
  validateUsername,
} from '@/utils/validators';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

interface RegisterFormProps {
  onNavigateToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onNavigateToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { register, isLoading } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!username) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (!validateUsername(username)) {
      newErrors.username = 'Nome de usuário inválido (3-20 caracteres, apenas letras e números)';
    }

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!validatePasswordSimple(password)) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não correspondem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register({
        email,
        password,
        fullName,
        username,
      });
      // Clear form on success
      setFullName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar conta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Criar Conta</Text>
      <Text style={styles.formSubtitle}>
        Junte-se à nossa comunidade de monitoramento agrícola
      </Text>

      {/* Full Name Input */}
      <TextInput
        label="Nome Completo"
        placeholder="Seu nome completo"
        value={fullName}
        onChangeText={setFullName}
        icon="person"
        error={errors.fullName}
        editable={!isLoading}
      />

      {/* Username Input */}
      <TextInput
        label="Nome de Usuário"
        placeholder="seu_usuario"
        value={username}
        onChangeText={setUsername}
        icon="at"
        autoCapitalize="none"
        error={errors.username}
        editable={!isLoading}
      />

      {/* Email Input */}
      <TextInput
        label="Email"
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
        icon="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        editable={!isLoading}
      />

      {/* Password Input */}
      <TextInput
        label="Senha"
        placeholder="Crie uma senha forte"
        value={password}
        onChangeText={setPassword}
        icon="lock-closed"
        secureTextEntry
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        error={errors.password}
        editable={!isLoading}
      />

      {/* Confirm Password Input */}
      <TextInput
        label="Confirmar Senha"
        placeholder="Confirme sua senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        icon="lock-closed"
        secureTextEntry
        showPassword={showConfirmPassword}
        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        error={errors.confirmPassword}
        editable={!isLoading}
      />

      {/* Register Button */}
      <Button
        label="Criar Conta"
        onPress={handleRegister}
        size="large"
        loading={isLoading}
        style={styles.registerButton}
      />

      {/* Login Link */}
      <View style={styles.loginLink}>
        <Text style={styles.loginLinkText}>Já tem conta? </Text>
        <TouchableOpacity onPress={onNavigateToLogin} disabled={isLoading}>
          <Text style={styles.loginLinkButton}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.lightGray,
    marginBottom: 24,
    lineHeight: 20,
  },

  // Button Styles
  registerButton: {
    marginTop: 8,
    marginBottom: 20,
  },

  // Login Link
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.darkGray,
  },
  loginLinkText: {
    color: colors.gray,
    fontSize: 14,
  },
  loginLinkButton: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterForm;
