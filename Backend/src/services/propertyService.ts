import { v4 as uuidv4 } from 'crypto';
import { query, queryOne, execute } from '@/database/db';
import { Property, CreatePropertyRequest, UpdatePropertyRequest } from '@/models/Property';
import { NotFoundError, ValidationError } from '@/utils/errors';
import { validatePropertyRequest } from '@/utils/validators';

export class PropertyService {
  async createProperty(
    userId: string,
    data: CreatePropertyRequest
  ): Promise<Property> {
    validatePropertyRequest(data.name, data.area, data.latitude, data.longitude);

    const propertyId = uuidv4();
    const now = new Date().toISOString();

    await execute(
      `INSERT INTO properties (id, userId, name, area, latitude, longitude, crops, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        propertyId,
        userId,
        data.name,
        data.area,
        data.latitude,
        data.longitude,
        data.crops || null,
        now,
        now,
      ]
    );

    const property = await queryOne<Property>('SELECT * FROM properties WHERE id = ?', [
      propertyId,
    ]);

    if (!property) {
      throw new Error('Falha ao criar propriedade');
    }

    return property;
  }

  async getPropertyById(propertyId: string, userId: string): Promise<Property> {
    const property = await queryOne<Property>(
      'SELECT * FROM properties WHERE id = ? AND userId = ?',
      [propertyId, userId]
    );

    if (!property) {
      throw new NotFoundError('Propriedade não encontrada');
    }

    return property;
  }

  async getUserProperties(userId: string): Promise<Property[]> {
    return query<Property>('SELECT * FROM properties WHERE userId = ? ORDER BY createdAt DESC', [
      userId,
    ]);
  }

  async updateProperty(
    propertyId: string,
    userId: string,
    data: UpdatePropertyRequest
  ): Promise<Property> {
    const property = await this.getPropertyById(propertyId, userId);

    if (data.name) validatePropertyRequest(data.name, data.area || property.area, data.latitude || property.latitude, data.longitude || property.longitude);

    const now = new Date().toISOString();
    const updateFields = Object.keys(data)
      .filter((key) => data[key as keyof UpdatePropertyRequest] !== undefined)
      .map((key) => `${key} = ?`)
      .join(', ');

    if (updateFields) {
      const values = Object.values(data).filter((v) => v !== undefined);
      values.push(now, propertyId, userId);

      await execute(
        `UPDATE properties SET ${updateFields}, updatedAt = ? WHERE id = ? AND userId = ?`,
        values
      );
    }

    const updatedProperty = await queryOne<Property>(
      'SELECT * FROM properties WHERE id = ?',
      [propertyId]
    );

    if (!updatedProperty) {
      throw new Error('Falha ao atualizar propriedade');
    }

    return updatedProperty;
  }

  async deleteProperty(propertyId: string, userId: string): Promise<void> {
    const property = await this.getPropertyById(propertyId, userId);

    await execute('DELETE FROM properties WHERE id = ? AND userId = ?', [propertyId, userId]);
  }
}

export const propertyService = new PropertyService();