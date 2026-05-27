import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
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
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
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

            <Button
              label="Entrar"
              onPress={handleLogin}
              size="large"
              loading={isLoading}
              style={styles.loginButton}
            />

            <Text style={styles.separator}>ou</Text>

            <Button
              label="Criar Conta"
              onPress={() => navigation.navigate('Register')}
              variant="outline"
              size="large"
              style={styles.registerButton}
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