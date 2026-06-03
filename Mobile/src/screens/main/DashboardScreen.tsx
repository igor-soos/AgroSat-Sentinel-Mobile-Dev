import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/utils/colors';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { useAlerts } from '@/contexts/AlertContext';
import { nasaService } from '@/services/nasaService';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { alerts, fetchAlerts, isLoading } = useAlerts();
  const [refreshing, setRefreshing] = React.useState(false);
  const [temperature, setTemperature] = React.useState<number | null>(null);

  // ID padrão para carregar os dados climáticos iniciais no dashboard
  const DEFAULT_PROPERTY_ID = 'default_property';

  const loadDashboardData = async () => {
    try {
      // 1. Atualiza os alertas globais vindos do Context
      await fetchAlerts();
      
      // 2. Consome o método correto do nasaService usando o ID da propriedade
      const climate = await nasaService.getClimateFromProperty(DEFAULT_PROPERTY_ID);
      if (climate && climate.temperature !== undefined) {
        setTemperature(climate.temperature);
      }
    } catch (err) {
      console.log('Erro ao carregar dados do Dashboard:', err);
    }
  };

  // Executa apenas uma vez ao montar a tela
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Função única de Pull-to-Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
  const highAlerts = activeAlerts.filter(a => a.severity === 'high');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return colors.alertRed;
      case 'high':
        return colors.alertYellow;
      case 'medium':
        return colors.warning;
      default:
        return colors.info;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      drought: 'Seca',
      fire: 'Queimada',
      frost: 'Geada',
      flood: 'Enchente',
    };
    return labels[type] || type;
  };

  if (isLoading && alerts.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.fullName?.split(' ')[0]}</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR')}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.avatarButton}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Alert Summary */}
        <View style={styles.summaryContainer}>
          <Card variant="alert">
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Ionicons name="alert-circle" size={28} color={colors.alertRed} />
                </View>
                <View>
                  <Text style={styles.summaryLabel}>Críticos</Text>
                  <Text style={styles.summaryValue}>{criticalAlerts.length}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Ionicons name="warning" size={28} color={colors.alertYellow} />
                </View>
                <View>
                  <Text style={styles.summaryLabel}>Altos</Text>
                  <Text style={styles.summaryValue}>{highAlerts.length}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Ionicons name="list" size={28} color={colors.info} />
                </View>
                <View>
                  <Text style={styles.summaryLabel}>Total</Text>
                  <Text style={styles.summaryValue}>{activeAlerts.length}</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="leaf" size={32} color={colors.ndviGreen} />
              <Text style={styles.statLabel}>NDVI Médio</Text>
              <Text style={styles.statValue}>0.65</Text>
            </View>
          </Card>
          
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="thermometer" size={32} color={colors.thermalRed} />
              <Text style={styles.statLabel}>Temp. Real (NASA)</Text>
              <Text style={styles.statValue}>
                {temperature !== null ? `${temperature.toFixed(1)}°C` : '--°C'}
              </Text>
            </View>
          </Card>
        </View>

        {/* Recent Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alertas Recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
              <Text style={styles.seeAll}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          {activeAlerts.length === 0 ? (
            <Card>
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={48} color={colors.success} />
                <Text style={styles.emptyStateText}>Nenhum alerta ativo</Text>
                <Text style={styles.emptyStateSubtext}>Tudo corre bem em suas propriedades</Text>
              </View>
            </Card>
          ) : (
            activeAlerts.slice(0, 3).map((alert) => (
              <TouchableOpacity
                key={alert.id}
                onPress={() => navigation.navigate('Alerts')}
              >
                <Card variant="alert">
                  <View style={styles.alertItem}>
                    <View style={styles.alertLeft}>
                      <View
                        style={[
                          styles.alertIndicator,
                          { backgroundColor: getSeverityColor(alert.severity) },
                        ]}
                      />
                      <View style={styles.alertInfo}>
                        <Text style={styles.alertTitle}>{getAlertTypeLabel(alert.type)}</Text>
                        <Text style={styles.alertDescription} numberOfLines={1}>
                          {alert.description}
                        </Text>
                        <Text style={styles.alertTime}>
                          {new Date(alert.timestamp).toLocaleTimeString('pt-BR')}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.alertRight}>
                      <Text
                        style={[
                          styles.alertSeverity,
                          { color: getSeverityColor(alert.severity) },
                        ]}
                      >
                        {alert.severity.toUpperCase()}
                      </Text>
                      <Text style={styles.confidence}>
                        {Math.round(alert.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Maps')}
            >
              <Ionicons name="map" size={28} color={colors.primary} />
              <Text style={styles.actionLabel}>Mapas NDVI</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Alerts')}
            >
              <Ionicons name="notifications" size={28} color={colors.primary} />
              <Text style={styles.actionLabel}>Todos Alertas</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  date: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  avatarButton: {
    padding: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.darkerGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.darkGray,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  seeAll: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  alertIndicator: {
    width: 4,
    height: 60,
    borderRadius: 2,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  alertDescription: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  alertTime: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 4,
  },
  alertRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  alertSeverity: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 10,
    color: colors.gray,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.darkGray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
});

export default DashboardScreen;