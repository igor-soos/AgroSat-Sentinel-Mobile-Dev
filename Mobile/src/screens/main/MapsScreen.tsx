import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/utils/colors';
import Card from '@/components/common/Card';

interface MapsScreenProps {
  navigation: any;
}

const MapsScreen: React.FC<MapsScreenProps> = ({ navigation }) => {
  const [selectedMap, setSelectedMap] = React.useState<'ndvi' | 'thermal'>('ndvi');

  const ndviLevels = [
    { range: '-0.3 a 0.1', label: 'Água', color: '#2196F3' },
    { range: '0.1 a 0.3', label: 'Solo Exposto', color: '#A0522D' },
    { range: '0.3 a 0.5', label: 'Vegetação Esparsa', color: '#FFD700' },
    { range: '0.5 a 0.7', label: 'Vegetação Moderada', color: '#7CB342' },
    { range: '0.7 a 1.0', label: 'Vegetação Densa', color: '#2E7D32' },
  ];

  const thermalLevels = [
    { range: '< 20°C', label: 'Frio', color: '#1E90FF' },
    { range: '20 a 30°C', label: 'Moderado', color: '#FFD700' },
    { range: '30 a 40°C', label: 'Quente', color: '#FF8C42' },
    { range: '> 40°C', label: 'Muito Quente', color: '#C0392B' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mapas de Satélite</Text>
          <Text style={styles.subtitle}>Visualize dados de sensoriamento remoto</Text>
        </View>

        {/* Map Type Selector */}
        <View style={styles.mapTypeContainer}>
          <TouchableOpacity
            style={[
              styles.mapTypeButton,
              selectedMap === 'ndvi' && styles.mapTypeButtonActive,
            ]}
            onPress={() => setSelectedMap('ndvi')}
          >
            <Ionicons name="leaf" size={20} color={selectedMap === 'ndvi' ? colors.white : colors.gray} />
            <Text style={[styles.mapTypeText, selectedMap === 'ndvi' && styles.mapTypeTextActive]}>
              NDVI
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mapTypeButton,
              selectedMap === 'thermal' && styles.mapTypeButtonActive,
            ]}
            onPress={() => setSelectedMap('thermal')}
          >
            <Ionicons name="thermometer" size={20} color={selectedMap === 'thermal' ? colors.white : colors.gray} />
            <Text style={[styles.mapTypeText, selectedMap === 'thermal' && styles.mapTypeTextActive]}>
              Térmico
            </Text>
          </TouchableOpacity>
        </View>

        {/* Map Preview */}
        <Card>
          <View style={styles.mapPreview}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={48} color={colors.primary} />
              <Text style={styles.mapPlaceholderText}>
                {selectedMap === 'ndvi' ? 'Mapa NDVI' : 'Mapa Térmico'}
              </Text>
              <Text style={styles.mapPlaceholderSubtext}>
                Imagem de satélite Sentinel-2
              </Text>
            </View>
          </View>
        </Card>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>
            {selectedMap === 'ndvi' ? 'Legenda NDVI' : 'Legenda Térmica'}
          </Text>
          <View style={styles.legend}>
            {(selectedMap === 'ndvi' ? ndviLevels : thermalLevels).map((level, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: level.color }]}
                />
                <View style={styles.legendText}>
                  <Text style={styles.legendRange}>{level.range}</Text>
                  <Text style={styles.legendLabel}>{level.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Information Cards */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Sobre {selectedMap === 'ndvi' ? 'NDVI' : 'Dados Térmicos'}</Text>
          
          {selectedMap === 'ndvi' ? (
            <>
              <Card>
                <View style={styles.infoContent}>
                  <Ionicons name="leaf" size={24} color={colors.ndviGreen} />
                  <View style={styles.infoText}>
                    <Text style={styles.infoTitle}>Índice de Vegetação</Text>
                    <Text style={styles.infoDescription}>
                      O NDVI mede a densidade e saúde da vegetação usando dados espectrais
                    </Text>
                  </View>
                </View>
              </Card>
              <Card>
                <View style={styles.infoContent}>
                  <Ionicons name="eye" size={24} color={colors.primary} />
                  <View style={styles.infoText}>
                    <Text style={styles.infoTitle}>Fonte de Dados</Text>
                    <Text style={styles.infoDescription}>
                      Satélite Sentinel-2 com resolução de 10m
                    </Text>
                  </View>
                </View>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <View style={styles.infoContent}>
                  <Ionicons name="thermometer" size={24} color={colors.thermalRed} />
                  <View style={styles.infoText}>
                    <Text style={styles.infoTitle}>Infravermelho Térmico</Text>
                    <Text style={styles.infoDescription}>
                      Detecta anomalias térmicas e possíveis focos de incêndio
                    </Text>
                  </View>
                </View>
              </Card>
              <Card>
                <View style={styles.infoContent}>
                  <Ionicons name="alert" size={24} color={colors.alertRed} />
                  <View style={styles.infoText}>
                    <Text style={styles.infoTitle}>Detecção de Focos</Text>
                    <Text style={styles.infoDescription}>
                      Identifica queimadas em tempo real usando dados orbitais
                    </Text>
                  </View>
                </View>
              </Card>
            </>
          )}
        </View>

        {/* Update Info */}
        <Card variant="alert">
          <View style={styles.updateInfo}>
            <Ionicons name="information-circle" size={20} color={colors.gold} />
            <View style={styles.updateText}>
              <Text style={styles.updateTitle}>Última atualização</Text>
              <Text style={styles.updateTime}>
                {new Date().toLocaleString('pt-BR')}
              </Text>
            </View>
          </View>
        </Card>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: colors.gray,
  },
  mapTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  mapTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.darkGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.darkGray,
    gap: 8,
  },
  mapTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  mapTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
  },
  mapTypeTextActive: {
    color: colors.white,
  },
  mapPreview: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.darkerGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.darkGray,
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  legendContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 12,
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendColor: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  legendText: {
    flex: 1,
  },
  legendRange: {
    fontSize: 11,
    color: colors.gray,
  },
  legendLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
    marginTop: 2,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 12,
  },
  infoContent: {
    flexDirection: 'row',
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  infoDescription: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
    lineHeight: 16,
  },
  updateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  updateText: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gold,
  },
  updateTime: {
    fontSize: 11,
    color: colors.gold,
    marginTop: 2,
    opacity: 0.8,
  },
} as any);

export default MapsScreen;