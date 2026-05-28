import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/utils/colors';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import { validateEmail, validatePasswordSimple } from '@/utils/validators';
import { useAuth } from '@/contexts/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    // Limpar erro anterior
    setErrors((prev) => ({ ...prev, server: undefined }));

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Email ou senha incorretos';
      
      setErrors((prev) => ({ 
        ...prev, 
        server: errorMessage 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>AgroSat</Text>
            <Text style={styles.subtitle}>Sentinel</Text>
            <Text style={styles.tagline}>Monitoramento por Satélite</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>Bem-vindo de volta</Text>
            <Text style={styles.formSubtitle}>
              Faça login para acessar seus alertas
            </Text>

            {errors.server && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {errors.server}</Text>
              </View>
            )}

            <TextInput
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              icon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              editable={!isSubmitting}
            />

            <TextInput
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              icon="lock-closed"
              secureTextEntry
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              error={errors.password}
              editable={!isSubmitting}
            />

            <Button
              label="Entrar"
              onPress={handleLogin}
              size="large"
              loading={isSubmitting}
              style={styles.loginButton}
              disabled={isSubmitting}
            />

            <Text style={styles.separator}>ou</Text>

            <Button
              label="Criar Conta"
              onPress={() => navigation.navigate('Register')}
              variant="outline"
              size="large"
              style={styles.registerButton}
              disabled={isSubmitting}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Tecnologia de sensoriamento remoto para proteção agrícola
            </Text>
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
  header: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    fontSize: 44,
    fontWeight: 'bold',
    color: colors.white,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.primary,
    marginTop: 4,
  },
  tagline: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 8,
    letterSpacing: 1,
  },
  form: {
    marginVertical: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 8,
  },
  separator: {
    color: colors.gray,
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 12,
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.darkGray,
  },
  footerText: {
    color: colors.gray,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
} as any);

export default LoginScreen;