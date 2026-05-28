import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { dataService } from '@/services/dataService';
import { propertyService } from '@/services/propertyService';
import { CreateNDVIDataRequest } from '@/models/NDVIData';
import { HTTP_STATUS } from '@/utils/constants';

export class NDVIController {
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
}

export const ndviController = new NDVIController();