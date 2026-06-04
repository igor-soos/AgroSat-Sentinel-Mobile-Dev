import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import { colors } from '@/utils/colors';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { useAlerts } from '@/contexts/AlertContext';

// Importa a URL base do seu backend configurada no .env do mobile
import { API_BASE_URL } from '@/utils/constants'; 

interface DashboardScreenProps {
  navigation: any;
}

interface AnalysisData {
  propertyId: string;
  averageNDVI: string;
  ndviClassification: string;
  temperature: string;
  humidity: string;
  fireRisk: string;
}

interface DynamicAlert {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  confidence: number;
  timestamp?: string;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { fetchAlerts } = useAlerts();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Estados para os dados dinâmicos da API
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [dynamicAlerts, setDynamicAlerts] = useState<DynamicAlert[]>([]);

  // ID padrão que representa a fazenda ativa do usuário para teste
  const DEFAULT_PROPERTY_ID = 'prop_teste_01';

  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      
      // 1. Sincroniza os alertas globais no Context (banco de dados)
      await fetchAlerts();
      
      // 2. Consome a rota de análise integrada do seu Backend (NASA + Clima)
      const response = await axios.get(`${API_BASE_URL}/nasa/analyze/property/${DEFAULT_PROPERTY_ID}`);
      
      if (response.data) {
        setAnalysis(response.data.analysis);
        
        // Formata os alertas vindos da análise da NASA inserindo o timestamp atual
        const formattedAlerts = response.data.alerts.map((alert: any) => ({
          ...alert,
          id: `dyn-${Math.random()}`,
          status: 'active',
          timestamp: new Date().toISOString()
        }));
        
        setDynamicAlerts(formattedAlerts);
      }
    } catch (err) {
      console.error('Erro ao carregar dados em tempo real da NASA:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Filtragem e contagem baseada nos alertas ativos retornados em tempo real pela API
  const activeAlerts = dynamicAlerts.filter(a => a.type !== 'info');
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

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'fire': return 'flame';
      case 'drought': return 'water';
      case 'frost': return 'snow';
      default: return 'alert-circle';
    }
  };

  if (loadingData && !refreshing) {
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
            <Text style={styles.greeting}>Olá, {user?.fullName?.split(' ')[0] || 'Produtor'}</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.avatarButton}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Resumo de Alertas Satelitários */}
        <View style={styles.summaryContainer}>
          <Card variant="alert">
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Ionicons name="alert-circle" size={24} color={colors.alertRed} />
                </View>
                <View>
                  <Text style={styles.summaryLabel}>Críticos</Text>
                  <Text style={styles.summaryValue}>{criticalAlerts.length}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Ionicons name="warning" size={24} color={colors.alertYellow} />
                </View>
                <View>
                  <Text style={styles.summaryLabel}>Altos</Text>
                  <Text style={styles.summaryValue}>{highAlerts.length}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Ionicons name="shield-checkmark" size={24} color={colors.success} />
                </View>
                <View>
                  <Text style={styles.summaryLabel}>Total Ativos</Text>
                  <Text style={styles.summaryValue}>{activeAlerts.length}</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Grid de Estatísticas em Tempo Real via API */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="leaf" size={28} color={colors.ndviGreen} />
              <Text style={styles.statLabel}>NDVI Médio</Text>
              <Text style={styles.statValue}>{analysis?.averageNDVI || '--'}</Text>
              <Text style={styles.statSubLabel}>Status: {analysis?.ndviClassification || '--'}</Text>
            </View>
          </Card>
          
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="thermometer" size={28} color={colors.thermalRed} />
              <Text style={styles.statLabel}>Temperatura (NASA)</Text>
              <Text style={styles.statValue}>
                {analysis?.temperature ? `${analysis.temperature}°C` : '--°C'}
              </Text>
              <Text style={styles.statSubLabel}>UR: {analysis?.humidity || '--'}%</Text>
            </View>
          </Card>
        </View>

        {/* Card Adicional de Risco de Fogo por Sensoriamento */}
        <View style={styles.summaryContainer}>
          <Card style={{ borderColor: colors.primary, borderWidth: 0.5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 4 }}>
              <Ionicons name="flame" size={32} color={colors.thermalRed} />
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>Índice Probabilístico de Queimada</Text>
                <Text style={[styles.statValue, { marginTop: 2, fontSize: 22 }]}>
                  {analysis?.fireRisk ? `${(parseFloat(analysis.fireRisk) * 100).toFixed(0)}%` : '--'}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Alertas Recentes Gerados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alertas Gerados por Órbita</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
              <Text style={styles.seeAll}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          {activeAlerts.length === 0 ? (
            <Card>
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={44} color={colors.success} />
                <Text style={styles.emptyStateText}>Nenhuma anomalia crítica</Text>
                <Text style={styles.emptyStateSubtext}>Análise de risco estável nesta área agroclimática</Text>
              </View>
            </Card>
          ) : (
            activeAlerts.slice(0, 3).map((alert: any) => (
              <TouchableOpacity
                key={alert.id}
                onPress={() => navigation.navigate('Alerts')}
                style={{ marginBottom: 8 }}
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Ionicons name={getAlertTypeIcon(alert.type)} size={16} color={getSeverityColor(alert.severity)} />
                          <Text style={styles.alertTitle}>{alert.title}</Text>
                        </View>
                        <Text style={styles.alertDescription} numberOfLines={2}>
                          {alert.description}
                        </Text>
                        <Text style={styles.alertTime}>
                          Atualizado: {new Date(alert.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
                        Conf: {Math.round(alert.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Ações Rápidas de Navegação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navegação Avançada</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Maps')}
            >
              <Ionicons name="map" size={24} color={colors.primary} />
              <Text style={styles.actionLabel}>Análise em Mapas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Alerts')}
            >
              <Ionicons name="notifications" size={24} color={colors.primary} />
              <Text style={styles.actionLabel}>Histórico Total</Text>
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
    marginBottom: 20,
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
    textTransform: 'capitalize'
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  summaryContainer: {
    marginBottom: 16,
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
    gap: 8,
  },
  summaryIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 8,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.darkGray,
    marginHorizontal: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 6,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 4,
  },
  statSubLabel: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 12,
    marginBottom: 16,
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
    paddingVertical: 24,
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    marginTop: 8,
  },
  emptyStateSubtext: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  alertIndicator: {
    width: 4,
    height: '100%',
    minHeight: 56,
    borderRadius: 2,
  },
  alertInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  alertDescription: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 2,
    lineHeight: 14,
  },
  alertTime: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 4,
  },
  alertRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
    paddingLeft: 8,
  },
  alertSeverity: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 9,
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
    padding: 14,
    alignItems: 'center',
    gap: 6,
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