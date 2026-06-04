import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/utils/colors';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import { useAlerts } from '@/contexts/AlertContext';
import { Alert as AlertType } from '@/types';

interface AlertsScreenProps {
  navigation: any;
}

const AlertsScreen: React.FC<AlertsScreenProps> = ({ navigation }) => {
  const { alerts, fetchAlerts, isLoading, selectAlert } = useAlerts();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged'>('active');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return colors.alertRed;
      case 'high':
        return colors.alertYellow;
      case 'medium':
        return colors.warning;
      case 'low':
      case 'info':
        return colors.success; // Verde para indicar estabilidade operacional
      default:
        return colors.info;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      drought: 'Estresse Hídrico / Seca',
      fire: 'Foco de Incêndio',
      frost: 'Risco de Geada',
      flood: 'Inundação',
      info: 'Monitoramento Estável',
    };
    return labels[type?.toLowerCase()] || type;
  };

  const getAlertTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      drought: 'water',
      fire: 'flame',
      frost: 'snow',
      flood: 'rainy',
      info: 'checkmark-circle',
    };
    return icons[type?.toLowerCase()] || 'alert-circle';
  };

  const renderAlertItem = ({ item }: { item: AlertType }) => {
    // Sanitização e conversão defensiva de tipos (evita quebra por strings vindas da API)
    const rawTemp = item.temperature !== undefined ? item.temperature : (item as any).temperature;
    const numericTemp = typeof rawTemp === 'string' ? parseFloat(rawTemp) : rawTemp;

    const rawNdvi = item.ndvi !== undefined ? item.ndvi : (item as any).ndvi;
    const numericNdvi = typeof rawNdvi === 'string' ? parseFloat(rawNdvi) : rawNdvi;

    const rawConfidence = item.confidence !== undefined ? item.confidence : ((item as any).confidence || 1.0);
    const numericConfidence = typeof rawConfidence === 'string' ? parseFloat(rawConfidence) : rawConfidence;

    // Se o alerta for do tipo 'info', a severidade padrão passa a ser considerada baixa
    const currentSeverity = item.type === 'info' ? 'info' : (item.severity || 'medium');

    return (
      <Pressable
        onPress={() => {
          selectAlert(item);
          navigation.navigate('AlertDetail', { alertId: item.id });
        }}
        style={{ marginBottom: 8 }}
      >
        <Card variant={item.status === 'active' ? 'alert' : 'default'}>
          <View style={styles.alertContainer}>
            <View style={styles.alertLeft}>
              <View
                style={[
                  styles.alertIcon,
                  { backgroundColor: getSeverityColor(currentSeverity) + '15' }, // Efeito opacidade sutil
                ]}
              >
                <Ionicons
                  name={getAlertTypeIcon(item.type) as any}
                  size={22}
                  color={getSeverityColor(currentSeverity)}
                />
              </View>
              
              <View style={styles.alertDetails}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertType}>{getAlertTypeLabel(item.type)}</Text>
                  <Text
                    style={[
                      styles.severity,
                      { color: getSeverityColor(currentSeverity) },
                    ]}
                  >
                    {(currentSeverity).toUpperCase()}
                  </Text>
                </View>
                
                <Text style={styles.description} numberOfLines={2}>
                  {item.description || item.message || 'Dados coletados via sensoriamento orbital padrão.'}
                </Text>
                
                <View style={styles.metadata}>
                  <Text style={styles.metaItem}>
                    🌡️ {isNaN(numericTemp) ? '--' : numericTemp.toFixed(1)}°C
                  </Text>
                  <Text style={styles.metaItem}>
                    📊 {isNaN(numericNdvi) ? '--' : numericNdvi.toFixed(2)} NDVI
                  </Text>
                  <Text style={styles.metaItem}>
                    ✓ {isNaN(numericConfidence) ? '100' : Math.round(numericConfidence * 100)}% Conf.
                  </Text>
                </View>
                
                <Text style={styles.timestamp}>
                  {item.timestamp ? new Date(item.timestamp).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR')}
                </Text>
              </View>
            </View>
            
            <View style={styles.alertRight}>
              {item.status === 'active' && item.type !== 'info' && (
                <Ionicons name="radio-button-on" size={12} color={colors.alertRed} />
              )}
            </View>
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Painel de Alertas</Text>
          <Text style={styles.subtitle}>{filteredAlerts.length} ocorrências identificadas</Text>
        </View>
      </View>

      {/* Abas de Filtragem Operacional */}
      <View style={styles.filterContainer}>
        {(['all', 'active', 'acknowledged'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Arquivados'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading && filteredAlerts.length === 0 ? (
        <Loading fullScreen />
      ) : filteredAlerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="shield-checkmark" size={56} color={colors.success} />
          <Text style={styles.emptyText}>Nenhuma anomalia pendente</Text>
          <Text style={styles.emptySubtext}>
            Sua área agrícola monitorada não apresenta desvios espectrais ou térmicos no momento.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAlerts}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item.id || `alert-${Math.random()}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  subtitle: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.darkGray,
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
  },
  filterTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  alertContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  alertLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertDetails: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingRight: 4,
  },
  alertType: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  severity: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 8,
    lineHeight: 16,
  },
  metadata: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  metaItem: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 10,
    color: colors.gray,
    opacity: 0.6,
  },
  alertRight: {
    paddingLeft: 4,
    paddingTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AlertsScreen;