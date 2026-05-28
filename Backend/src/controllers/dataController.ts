import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { dataService } from '@/services/dataService';
import { propertyService } from '@/services/propertyService';
import { CreateNDVIDataRequest } from '@/models/NDVIData';
import { CreateThermalAnomalyRequest } from '@/models/ThermalAnomaly';
import { HTTP_STATUS } from '@/utils/constants';

export class DataController {
  // NDVI Methods
  async createNDVIData(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const data: CreateNDVIDataRequest = req.body;

    // Verify property belongs to user
    await propertyService.getPropertyById(data.propertyId, userId);

    const result = await dataService.createNDVIData(data);

    res.status(HTTP_STATUS.CREATED).json(result);
  }

  async getPropertyNDVIData(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { propertyId } = req.params;
    const { limit = 100 } = req.query;

    // Verify property belongs to user
    await propertyService.getPropertyById(propertyId, userId);

    const result = await dataService.getPropertyNDVIData(propertyId, parseInt(limit as string));

    res.status(HTTP_STATUS.OK).json(result);
  }

  async getNDVIData(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await dataService.getNDVIDataById(id);

    res.status(HTTP_STATUS.OK).json(result);
  }

  // Thermal Anomaly Methods
  async createThermalAnomaly(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const data: CreateThermalAnomalyRequest = req.body;

    // Verify property belongs to user
    await propertyService.getPropertyById(data.propertyId, userId);

    const result = await dataService.createThermalAnomaly(data);

    res.status(HTTP_STATUS.CREATED).json(result);
  }

  async getPropertyThermalAnomalies(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { propertyId } = req.params;
    const { limit = 100 } = req.query;

    // Verify property belongs to user
    await propertyService.getPropertyById(propertyId, userId);

    const result = await dataService.getPropertyThermalAnomalies(
      propertyId,
      parseInt(limit as string)
    );

    res.status(HTTP_STATUS.OK).json(result);
  }

  async getThermalAnomaly(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await dataService.getThermalAnomalyById(id);

    res.status(HTTP_STATUS.OK).json(result);
  }
}

export const dataController = new DataController();