import { v4 as uuidv4 } from 'uuid';
import { query, queryOne, execute } from '@/database/db';
import { Alert, CreateAlertRequest, UpdateAlertRequest } from '@/models/Alert';
import { NotFoundError } from '@/utils/errors';

export class AlertService {
  async createAlert(data: CreateAlertRequest): Promise<Alert> {
    const alertId = uuidv4();
    const now = new Date().toISOString();

    await execute(
      `INSERT INTO alerts (id, propertyId, type, severity, title, description, latitude, longitude, ndvi, temperature, confidence, status, timestamp, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        alertId,
        data.propertyId,
        data.type,
        data.severity,
        data.title,
        data.description,
        data.latitude,
        data.longitude,
        data.ndvi || null,
        data.temperature || null,
        data.confidence,
        'active',
        now,
        now,
        now,
      ]
    );

    const alert = await queryOne<Alert>('SELECT * FROM alerts WHERE id = ?', [alertId]);

    if (!alert) {
      throw new Error('Falha ao criar alerta');
    }

    return alert;
  }

  async getAlertById(alertId: string): Promise<Alert> {
    const alert = await queryOne<Alert>('SELECT * FROM alerts WHERE id = ?', [alertId]);

    if (!alert) {
      throw new NotFoundError('Alerta não encontrado');
    }

    return alert;
  }

  async getPropertyAlerts(propertyId: string, status?: string): Promise<Alert[]> {
    let sql = 'SELECT * FROM alerts WHERE propertyId = ?';
    const params: any[] = [propertyId];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    return query<Alert>(sql + ' ORDER BY timestamp DESC', params);
  }

  async getAllAlerts(limit = 50, offset = 0): Promise<Alert[]> {
    return query<Alert>(
      'SELECT * FROM alerts ORDER BY timestamp DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
  }

  async updateAlert(alertId: string, data: UpdateAlertRequest): Promise<Alert> {
    const alert = await this.getAlertById(alertId);

    const now = new Date().toISOString();
    const updateFields = Object.keys(data)
      .filter((key) => data[key as keyof UpdateAlertRequest] !== undefined)
      .map((key) => `${key} = ?`)
      .join(', ');

    if (updateFields) {
      const values = Object.values(data).filter((v) => v !== undefined);
      values.push(now, alertId);

      await execute(
        `UPDATE alerts SET ${updateFields}, updatedAt = ? WHERE id = ?`,
        values
      );
    }

    const updatedAlert = await queryOne<Alert>('SELECT * FROM alerts WHERE id = ?', [alertId]);

    if (!updatedAlert) {
      throw new Error('Falha ao atualizar alerta');
    }

    return updatedAlert;
  }

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    return this.updateAlert(alertId, { status: 'acknowledged' });
  }

  async resolveAlert(alertId: string): Promise<Alert> {
    return this.updateAlert(alertId, { status: 'resolved' });
  }

  async deleteAlert(alertId: string): Promise<void> {
    await this.getAlertById(alertId);
    await execute('DELETE FROM alerts WHERE id = ?', [alertId]);
  }
}

export const alertService = new AlertService();