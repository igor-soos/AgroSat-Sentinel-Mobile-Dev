import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import { colors } from '@/utils/colors';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import { validateEmail, validatePasswordSimple } from '@/utils/validators';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onNavigateToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onNavigateToRegister = () => {} }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, isLoading } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
      setEmail('');
      setPassword('');
      setShowPassword(false);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Bem-vindo de volta</Text>
      <Text style={styles.formSubtitle}>
        Faça login para acessar seus alertas e monitoramento
      </Text>

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
        placeholder="Sua senha"
        value={password}
        onChangeText={setPassword}
        icon="lock-closed"
        secureTextEntry
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        error={errors.password}
        editable={!isLoading}
      />

      {/* Login Button */}
      <Button
        label="Entrar"
        onPress={handleLogin}
        size="large"
        loading={isLoading}
        style={styles.loginButton}
      />

      {/* Divider */}
      <Text style={styles.separator}>ou</Text>

      {/* Register Button */}
      <Button
        label="Criar Conta"
        onPress={onNavigateToRegister}
        variant="outline"
        size="large"
        disabled={isLoading}
      />
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
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  separator: {
    textAlign: 'center',
    color: colors.gray,
    marginVertical: 16,
    fontSize: 14,
  },
});

export default LoginForm;
