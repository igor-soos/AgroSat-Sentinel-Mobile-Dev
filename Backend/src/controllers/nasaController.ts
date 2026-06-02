import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { nasaService } from '@/services/nasaService';
import { propertyService } from '@/services/propertyService';
import { dataService } from '@/services/dataService';
import { HTTP_STATUS } from '@/utils/constants';
import { v4 as uuidv4 } from 'uuid';

export class NasaController {
  /**
   * Busca dados NDVI da NASA para uma propriedade
   */
  async getNDVIFromNasa(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { propertyId } = req.params;

    try {
      // Verificar se propriedade pertence ao usuário
      const property = await propertyService.getPropertyById(propertyId, userId);

      // Buscar dados da NASA
      const ndviData = await nasaService.getNDVIData(property.latitude, property.longitude);

      // Salvar no banco de dados
      const savedData = [];
      for (const data of ndviData) {
        const classification = nasaService.classifyNDVI(data.value);
        const saved = await dataService.createNDVIData({
          propertyId,
          latitude: data.latitude,
          longitude: data.longitude,
          value: data.value,
          classification,
          source: 'sentinel2', // Ajustado para respeitar as opções do banco de dados
        });
        savedData.push(saved);
      }

      res.status(HTTP_STATUS.OK).json({
        message: 'NDVI data fetched from NASA',
        count: savedData.length,
        data: savedData,
      });
    } catch (error) {
      console.error('Error in getNDVIFromNasa:', error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: 'Internal server error while fetching NDVI data from NASA.',
      });
    }
  }

  /**
   * Busca dados climáticos da NASA para uma propriedade
   */
  async getClimateFromNasa(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { propertyId } = req.params;

    try {
      // Verificar se propriedade pertence ao usuário
      const property = await propertyService.getPropertyById(propertyId, userId);

      // Buscar dados da NASA
      const weatherData = await nasaService.getClimateData(
        property.latitude,
        property.longitude
      );

      // Se risco de fogo > 0.6, criar alerta
      if (weatherData.fireRisk > 0.6) {
        await dataService.createThermalAnomaly({
          propertyId,
          latitude: weatherData.latitude,
          longitude: weatherData.longitude,
          temperature: weatherData.temperature,
          anomaly: true,
          confidence: weatherData.fireRisk,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        message: 'Climate data fetched from NASA',
        data: weatherData,
      });
    } catch (error) {
      console.error('Error in getClimateFromNasa:', error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: 'Internal server error while fetching climate data from NASA.',
      });
    }
  }

  /**
   * Análise integrada: combina NDVI + Clima para gerar alertas
   */
  async analyzePropertyFromNasa(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { propertyId } = req.params;

    try {
      const property = await propertyService.getPropertyById(propertyId, userId);

      // Buscar dados
      const ndviData = await nasaService.getNDVIData(property.latitude, property.longitude);
      const weatherData = await nasaService.getClimateData(
        property.latitude,
        property.longitude
      );

      // Analisar condições
      const alerts = [];
      const averageNDVI = ndviData.reduce((sum, d) => sum + d.value, 0) / ndviData.length;

      // Alerta de Seca
      if (averageNDVI < 0.4 && weatherData.humidity < 40) {
        alerts.push({
          type: 'drought',
          severity: averageNDVI < 0.3 ? 'critical' : 'high',
          title: 'Seca Detectada',
          description: `NDVI baixo (${averageNDVI.toFixed(2)}) e umidade crítica (${weatherData.humidity.toFixed(0)}%)`,
          confidence: 0.85,
        });
      }

      // Alerta de Fogo
      if (weatherData.fireRisk > 0.7 && weatherData.temperature > 30) {
        alerts.push({
          type: 'fire',
          severity: weatherData.fireRisk > 0.9 ? 'critical' : 'high',
          title: 'Risco de Queimada',
          description: `Risco de fogo elevado: ${(weatherData.fireRisk * 100).toFixed(0)}% - Temp: ${weatherData.temperature.toFixed(0)}°C`,
          confidence: weatherData.fireRisk,
        });
      }

      // Alerta de Geada
      if (weatherData.temperature < 5) {
        alerts.push({
          type: 'frost',
          severity: 'medium',
          title: 'Risco de Geada',
          description: `Temperatura muito baixa: ${weatherData.temperature.toFixed(0)}°C`,
          confidence: 0.8,
        });
      }

      // Vegetação Densa (sem alerta, informativo)
      if (averageNDVI > 0.7) {
        alerts.push({
          type: 'drought',
          severity: 'low',
          title: 'Vegetação em Bom Estado',
          description: `NDVI alto indica vegetação saudável: ${averageNDVI.toFixed(2)}`,
          confidence: 0.95,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        analysis: {
          propertyId,
          averageNDVI: averageNDVI.toFixed(2),
          ndviClassification: nasaService.classifyNDVI(averageNDVI),
          temperature: weatherData.temperature.toFixed(1),
          humidity: weatherData.humidity.toFixed(1),
          fireRisk: weatherData.fireRisk.toFixed(2),
        },
        alerts: alerts.length > 0 ? alerts : [{ type: 'info', message: 'Tudo corre bem' }],
      });
    } catch (error) {
      console.error('Error in analyzePropertyFromNasa:', error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        error: 'Internal server error during integrated property analysis.',
      });
    }
  }
}

export const nasaController = new NasaController();