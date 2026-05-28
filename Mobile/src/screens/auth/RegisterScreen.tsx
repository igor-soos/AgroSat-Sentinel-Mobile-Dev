import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<User['role']>('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { register, isLoading } = useAuth();

  const roles: { label: string; value: User['role']; icon: string }[] = [
    { label: 'Produtor', value: 'farmer', icon: 'leaf' },
    { label: 'Analista', value: 'analyst', icon: 'bar-chart' },
    { label: 'Defesa Civil', value: 'civil_defense', icon: 'alert-circle' },
  ];

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
        role,
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar conta');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Junte-se ao nosso sistema de monitoramento
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Nome Completo"
              placeholder="João Silva"
              value={fullName}
              onChangeText={setFullName}
              icon="person"
              error={errors.fullName}
            />

            <TextInput
              label="Nome de Usuário"
              placeholder="joaosilva"
              value={username}
              onChangeText={setUsername}
              icon="at"
              autoCapitalize="none"
              error={errors.username}
            />

            <TextInput
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              icon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Text style={styles.roleLabel}>Tipo de Usuário</Text>
            <View style={styles.roleContainer}>
              {roles.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  style={[
                    styles.roleButton,
                    role === r.value && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole(r.value)}
                >
                  <Ionicons
                    name={r.icon as any}
                    size={20}
                    color={role === r.value ? colors.primary : colors.gray}
                  />
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === r.value && styles.roleButtonTextActive,
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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
            />

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
            />

            <Button
              label="Criar Conta"
              onPress={handleRegister}
              size="large"
              loading={isLoading}
              style={styles.submitButton}
            />

            <View style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Já possui conta? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLinkButton}>Faça Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  form: {
    marginBottom: 40,
  },
  roleLabel: {
    color: colors.lightGray,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.darkGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  roleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.darkerGray,
  },
  roleButtonText: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  roleButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 16,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
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
} as any);

export default RegisterScreen;