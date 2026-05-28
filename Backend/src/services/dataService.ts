import { v4 as uuidv4 } from 'crypto';
import { query, queryOne, execute } from '@/database/db';
import { NDVIData, CreateNDVIDataRequest } from '@/models/NDVIData';
import { ThermalAnomaly, CreateThermalAnomalyRequest } from '@/models/ThermalAnomaly';
import { NotFoundError } from '@/utils/errors';

export class DataService {
  // NDVI Methods
  async createNDVIData(data: CreateNDVIDataRequest): Promise<NDVIData> {
    const ndviId = uuidv4();
    const now = new Date().toISOString();

    await execute(
      `INSERT INTO ndvi_data (id, propertyId, latitude, longitude, value, classification, source, timestamp, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ndviId,
        data.propertyId,
        data.latitude,
        data.longitude,
        data.value,
        data.classification,
        data.source || 'sentinel2',
        now,
        now,
      ]
    );

    const ndvi = await queryOne<NDVIData>('SELECT * FROM ndvi_data WHERE id = ?', [ndviId]);

    if (!ndvi) {
      throw new Error('Falha ao criar dado NDVI');
    }

    return ndvi;
  }

  async getPropertyNDVIData(propertyId: string, limit = 100): Promise<NDVIData[]> {
    return query<NDVIData>(
      'SELECT * FROM ndvi_data WHERE propertyId = ? ORDER BY timestamp DESC LIMIT ?',
      [propertyId, limit]
    );
  }

  async getNDVIDataById(ndviId: string): Promise<NDVIData> {
    const ndvi = await queryOne<NDVIData>('SELECT * FROM ndvi_data WHERE id = ?', [ndviId]);

    if (!ndvi) {
      throw new NotFoundError('Dado NDVI não encontrado');
    }

    return ndvi;
  }

  // Thermal Anomaly Methods
  async createThermalAnomaly(data: CreateThermalAnomalyRequest): Promise<ThermalAnomaly> {
    const anomalyId = uuidv4();
    const now = new Date().toISOString();

    await execute(
      `INSERT INTO thermal_anomalies (id, propertyId, latitude, longitude, temperature, anomaly, confidence, timestamp, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        anomalyId,
        data.propertyId,
        data.latitude,
        data.longitude,
        data.temperature,
        data.anomaly ? 1 : 0,
        data.confidence,
        now,
        now,
      ]
    );

    const anomaly = await queryOne<ThermalAnomaly>(
      'SELECT * FROM thermal_anomalies WHERE id = ?',
      [anomalyId]
    );

    if (!anomaly) {
      throw new Error('Falha ao criar anomalia térmica');
    }

    return anomaly;
  }

  async getPropertyThermalAnomalies(propertyId: string, limit = 100): Promise<ThermalAnomaly[]> {
    return query<ThermalAnomaly>(
      'SELECT * FROM thermal_anomalies WHERE propertyId = ? ORDER BY timestamp DESC LIMIT ?',
      [propertyId, limit]
    );
  }

  async getThermalAnomalyById(anomalyId: string): Promise<ThermalAnomaly> {
    const anomaly = await queryOne<ThermalAnomaly>(
      'SELECT * FROM thermal_anomalies WHERE id = ?',
      [anomalyId]
    );

    if (!anomaly) {
      throw new NotFoundError('Anomalia térmica não encontrada');
    }

    return anomaly;
  }
}

export const dataService = new DataService();