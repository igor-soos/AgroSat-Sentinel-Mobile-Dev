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
import Button from '@/components/common/Button';
import { useAlerts } from '@/contexts/AlertContext';
import { Alert as AlertType } from '@/types';

interface AlertsScreenProps {
  navigation: any;
}

const AlertsScreen: React.FC<AlertsScreenProps> = ({ navigation }) => {
  const { alerts, fetchAlerts, isLoading, selectAlert, acknowledgeAlert } = useAlerts();
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

  const getAlertTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      drought: 'water',
      fire: 'flame',
      frost: 'snow',
      flood: 'rainy',
    };
    return icons[type] || 'alert-circle';
  };

  const renderAlertItem = ({ item }: { item: AlertType }) => (
    <Pressable
      onPress={() => {
        selectAlert(item);
        navigation.navigate('AlertDetail', { alertId: item.id });
      }}
    >
      <Card variant={item.status === 'active' ? 'alert' : 'default'}>
        <View style={styles.alertContainer}>
          <View style={styles.alertLeft}>
            <View
              style={[
                styles.alertIcon,
                { backgroundColor: getSeverityColor(item.severity) + '30' },
              ]}
            >
              <Ionicons
                name={getAlertTypeIcon(item.type) as any}
                size={24}
                color={getSeverityColor(item.severity)}
              />
            </View>
            <View style={styles.alertDetails}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertType}>{getAlertTypeLabel(item.type)}</Text>
                <Text
                  style={[
                    styles.severity,
                    { color: getSeverityColor(item.severity) },
                  ]}
                >
                  {item.severity.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.metadata}>
                <Text style={styles.metaItem}>
                  🌡️ {item.temperature?.toFixed(1) || 'N/A'}°C
                </Text>
                <Text style={styles.metaItem}>
                  📊 {item.ndvi?.toFixed(2) || 'N/A'} NDVI
                </Text>
                <Text style={styles.metaItem}>
                  ✓ {Math.round(item.confidence * 100)}%
                </Text>
              </View>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString('pt-BR')}
              </Text>
            </View>
          </View>
          <View style={styles.alertRight}>
            {item.status === 'active' && (
              <Ionicons name="radio-button-on" size={12} color={colors.alertRed} />
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alertas</Text>
          <Text style={styles.subtitle}>{filteredAlerts.length} alertas encontrados</Text>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['all', 'active', 'acknowledged'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(f as any)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Reconhecidos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading && filteredAlerts.length === 0 ? (
        <Loading fullScreen />
      ) : filteredAlerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
          <Text style={styles.emptyText}>Nenhum alerta encontrado</Text>
          <Text style={styles.emptySubtext}>
            Não há alertas com o filtro selecionado
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAlerts}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
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
    paddingVertical: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
    padding: 16,
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
    width: 48,
    height: 48,
    borderRadius: 10,
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
  },
  alertType: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  severity: {
    fontSize: 11,
    fontWeight: '700',
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
    marginBottom: 8,
  },
  metaItem: {
    fontSize: 11,
    color: colors.gray,
  },
  timestamp: {
    fontSize: 10,
    color: colors.gray,
    fontStyle: 'italic',
  },
  alertRight: {
    paddingLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginTop: 8,
    textAlign: 'center',
  },
} as any);

export default AlertsScreen;