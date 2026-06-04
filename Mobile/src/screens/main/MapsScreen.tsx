import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { colors } from '@/utils/colors';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import { API_BASE_URL } from '@/utils/constants';

interface MapsScreenProps {
  navigation: any;
}

// Mapeamento das propriedades reais configuradas no seu Backend/Banco de dados
const PROPRIEDADES_REAIS = [
  { id: 'prop_teste_01', nome: 'Fazenda Santa Maria (SP)' },
  { id: 'prop_teste_02', nome: 'Sítio Alvorada (BA)' },
];

interface AnalysisState {
  averageNDVI: string;
  ndviClassification: string;
  temperature: string;
  humidity: string;
  fireRisk: string;
}

const MapsScreen: React.FC<MapsScreenProps> = ({ navigation }) => {
  const [selectedMap, setSelectedMap] = useState<'ndvi' | 'thermal'>('ndvi');
  const [propriedadeAtiva, setPropriedadeAtiva] = useState(PROPRIEDADES_REAIS[0]);
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const ndviLevels = [
    { range: '-0.3 a 0.1', label: 'Água / Estruturas', color: '#2196F3' },
    { range: '0.1 a 0.3', label: 'Solo Exposto', color: '#A0522D' },
    { range: '0.3 a 0.5', label: 'Vegetação Esparsa', color: '#FFD700' },
    { range: '0.5 a 0.7', label: 'Vegetação Moderada', color: '#7CB342' },
    { range: '0.7 a 1.0', label: 'Vegetação Densa', color: '#2E7D32' },
  ];

  const thermalLevels = [
    { range: '< 20°C', label: 'Frio / Úmido', color: '#1E90FF' },
    { range: '20 a 30°C', label: 'Moderado', color: '#FFD700' },
    { range: '30 a 40°C', label: 'Quente / Seco', color: '#FF8C42' },
    { range: '> 40°C', label: 'Anomalia Térmica', color: '#C0392B' },
  ];

  const fetchSatelliteData = async (propertyId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/nasa/analyze/property/${propertyId}`);
      if (response.data && response.data.analysis) {
        setAnalysis(response.data.analysis);
        setLastUpdate(new Date().toLocaleString('pt-BR'));
      }
    } catch (err) {
      console.error(`Erro ao carregar dados orbitais da propriedade ${propertyId}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  // Dispara a busca sempre que o usuário trocar de propriedade na lista horizontal
  useEffect(() => {
    fetchSatelliteData(propriedadeAtiva.id);
  }, [propriedadeAtiva]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSatelliteData(propriedadeAtiva.id);
    setRefreshing(false);
  };

  // Funções auxiliares para extração segura de dados numéricos (evita quebra por strings)
  const getNumericNDVI = () => {
    if (!analysis?.averageNDVI) return 0;
    return parseFloat(analysis.averageNDVI);
  };

  const getNumericTemp = () => {
    if (!analysis?.temperature) return 0;
    return parseFloat(analysis.temperature);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Painel Satelitário</Text>
          <Text style={styles.subtitle}>Sensoriamento remoto e índices biofísicos em tempo real</Text>
        </View>

        {/* Seletor Horizontal de Propriedades Reais */}
        <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Selecionar Área Monitorada:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.propertySelectorScroll}>
          {PROPRIEDADES_REAIS.map((prop) => (
            <TouchableOpacity
              key={prop.id}
              style={[
                styles.propertyButton,
                propriedadeAtiva.id === prop.id && styles.propertyButtonActive,
              ]}
              onPress={() => setPropriedadeAtiva(prop)}
            >
              <Ionicons 
                name="business" 
                size={14} 
                color={propriedadeAtiva.id === prop.id ? colors.white : colors.gray} 
              />
              <Text style={[styles.propertyButtonText, propriedadeAtiva.id === prop.id && styles.propertyButtonTextActive]}>
                {prop.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Seletor do Tipo de Camada Espectral (NDVI vs Térmico) */}
        <View style={styles.mapTypeContainer}>
          <TouchableOpacity
            style={[styles.mapTypeButton, selectedMap === 'ndvi' && styles.mapTypeButtonActive]}
            onPress={() => setSelectedMap('ndvi')}
          >
            <Ionicons name="leaf" size={18} color={selectedMap === 'ndvi' ? colors.white : colors.gray} />
            <Text style={[styles.mapTypeText, selectedMap === 'ndvi' && styles.mapTypeTextActive]}>
              Índice NDVI
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mapTypeButton, selectedMap === 'thermal' && styles.mapTypeButtonActive]}
            onPress={() => setSelectedMap('thermal')}
          >
            <Ionicons name="thermometer" size={18} color={selectedMap === 'thermal' ? colors.white : colors.gray} />
            <Text style={[styles.mapTypeText, selectedMap === 'thermal' && styles.mapTypeTextActive]}>
              Canal Térmico
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card do Placeholder Estruturado com os Dados Live */}
        {isLoading ? (
          <Card><View style={[styles.mapPreview, { justifyContent: 'center' }]}><Loading /></View></Card>
        ) : (
          <Card>
            <View style={styles.mapPreview}>
              <View style={styles.mapPlaceholder}>
                <Ionicons 
                  name={selectedMap === 'ndvi' ? 'leaf' : 'flame'} 
                  size={52} 
                  color={selectedMap === 'ndvi' ? colors.ndviGreen : colors.thermalRed} 
                />
                
                <Text style={styles.mapPlaceholderText}>
                  {selectedMap === 'ndvi' ? `Camada NDVI de Refletância` : `Mapeamento Térmico de Superfície`}
                </Text>
                
                {/* Leitura de Telemetria Real */}
                <View style={styles.telemetryBadge}>
                  <Text style={styles.telemetryValue}>
                    {selectedMap === 'ndvi' 
                      ? `Média: ${getNumericNDVI().toFixed(2)} (${analysis?.ndviClassification || 'N/A'})`
                      : `Temperatura: ${getNumericTemp().toFixed(1)}°C (UR: ${analysis?.humidity || '--'}%)`
                    }
                  </Text>
                </View>

                <Text style={styles.mapPlaceholderSubtext}>
                  Processamento de imagem Sentinel-2 / NASA FIRMS ativo
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Seção Dinâmica de Legendas */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>
            {selectedMap === 'ndvi' ? 'Escala do Índice de Vegetação' : 'Classificação Térmica Orbital'}
          </Text>
          <View style={styles.legend}>
            {(selectedMap === 'ndvi' ? ndviLevels : thermalLevels).map((level, index) => {
              // Destaca a legenda atual baseada no valor real que veio do backend
              const isCurrentNDVI = selectedMap === 'ndvi' && 
                ((index === 4 && getNumericNDVI() >= 0.7) || 
                 (index === 3 && getNumericNDVI() >= 0.5 && getNumericNDVI() < 0.7) ||
                 (index === 2 && getNumericNDVI() >= 0.3 && getNumericNDVI() < 0.5) ||
                 (index === 1 && getNumericNDVI() >= 0.1 && getNumericNDVI() < 0.3));

              const isCurrentThermal = selectedMap === 'thermal' && 
                ((index === 3 && getNumericTemp() > 40) || 
                 (index === 2 && getNumericTemp() >= 30 && getNumericTemp() <= 40) ||
                 (index === 1 && getNumericTemp() >= 20 && getNumericTemp() < 30) ||
                 (index === 0 && getNumericTemp() < 20));

              return (
                <View 
                  key={index} 
                  style={[
                    styles.legendItem, 
                    (isCurrentNDVI || isCurrentThermal) && styles.legendItemHighlighted
                  ]}
                >
                  <View style={[styles.legendColor, { backgroundColor: level.color }]} />
                  <View style={styles.legendText}>
                    <Text style={styles.legendRange}>{level.range}</Text>
                    <Text style={styles.legendLabel}>{level.label}</Text>
                  </View>
                  {(isCurrentNDVI || isCurrentThermal) && (
                    <Text style={styles.liveIndicatorText}>● LEITURA ATUAL</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Bloco Informativo de Apoio */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Metadados Técnicos</Text>
          <Card>
            <View style={styles.infoContent}>
              <Ionicons name="hardware-chip" size={22} color={colors.primary} />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Resolução e Cobertura</Text>
                <Text style={styles.infoDescription}>
                  Dados coletados em bandas de infravermelho próximo (NIR) e ondas curtas (SWIR), com amostragem geométrica tratada no servidor.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Registro Temporal da Coleta */}
        <Card variant="alert">
          <View style={styles.updateInfo}>
            <Ionicons name="time" size={20} color={colors.gold} />
            <View style={styles.updateText}>
              <Text style={styles.updateTitle}>Sincronização de Telemetria com a API</Text>
              <Text style={styles.updateTime}>
                Último handshake: {lastUpdate || 'Carregando...'}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: colors.gray,
    lineHeight: 16,
  },
  propertySelectorScroll: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  propertyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.darkGray,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  propertyButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  propertyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray,
  },
  propertyButtonTextActive: {
    color: colors.white,
  },
  mapTypeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
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
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray,
  },
  mapTypeTextActive: {
    color: colors.white,
  },
  mapPreview: {
    height: 260,
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
    padding: 16,
  },
  mapPlaceholderText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    marginTop: 10,
  },
  telemetryBadge: {
    backgroundColor: colors.dark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: colors.primary,
  },
  telemetryValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.white,
  },
  mapPlaceholderSubtext: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 12,
    textAlign: 'center',
  },
  legendContainer: {
    marginVertical: 20,
  },
  legendTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  legend: {
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 6,
    borderRadius: 6,
  },
  legendItemHighlighted: {
    backgroundColor: colors.darkGray,
    borderWidth: 0.5,
    borderColor: colors.primary,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendRange: {
    fontSize: 11,
    color: colors.gray,
    width: 70,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  liveIndicatorText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  infoContent: {
    flexDirection: 'row',
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
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
});

export default MapsScreen;