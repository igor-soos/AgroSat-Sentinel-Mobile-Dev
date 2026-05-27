import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/utils/colors';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      farmer: 'Produtor Rural',
      analyst: 'Analista de Dados',
      civil_defense: 'Defesa Civil',
      admin: 'Administrador',
    };
    return labels[role] || role;
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            await logout();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const menuItems = [
    { icon: 'notifications', label: 'Notificações', action: () => {} },
    { icon: 'settings', label: 'Configurações', action: () => {} },
    { icon: 'help-circle', label: 'Ajuda e Suporte', action: () => {} },
    { icon: 'document-text', label: 'Termos de Serviço', action: () => {} },
    { icon: 'shield-checkmark', label: 'Privacidade', action: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        {/* Profile Card */}
        <Card>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={48} color={colors.primary} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.fullName || 'Usuário'}</Text>
              <Text style={styles.email}>{user?.email}</Text>
              <View style={styles.roleBadge}>
                <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                <Text style={styles.roleText}>{getRoleLabel(user?.role || 'farmer')}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* User Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statItem}>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Propriedades</Text>
            </View>
          </Card>
          <Card style={styles.statItem}>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Alertas Recebidos</Text>
            </View>
          </Card>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minha Conta</Text>
          <Card>
            <View style={styles.accountItem}>
              <View style={styles.accountIcon}>
                <Ionicons name="mail" size={20} color={colors.primary} />
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountLabel}>Email</Text>
                <Text style={styles.accountValue}>{user?.email}</Text>
              </View>
            </View>
          </Card>
          <Card>
            <View style={styles.accountItem}>
              <View style={styles.accountIcon}>
                <Ionicons name="person-circle" size={20} color={colors.primary} />
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountLabel}>Tipo de Usuário</Text>
                <Text style={styles.accountValue}>{getRoleLabel(user?.role || 'farmer')}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.action}>
              <Card>
                <View style={styles.menuItem}>
                  <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.gray} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>AgroSat Sentinel</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
          <Text style={styles.copyright}>
            © 2024 AgroSat Sentinel. Tecnologia de sensoriamento remoto para proteção agrícola.
          </Text>
        </View>

        {/* Logout Button */}
        <Button
          label="Sair"
          onPress={handleLogout}
          variant="outline"
          size="large"
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  profileCard: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.darkerGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  email: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.darkerGray,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24,
  },
  statItem: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.darkerGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
  },
  accountValue: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
  infoSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  version: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  copyright: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 14,
  },
  logoutButton: {
    marginBottom: 24,
  },
} as any);

export default ProfileScreen;