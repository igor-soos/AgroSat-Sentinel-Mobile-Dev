import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { propertyService } from '@/services/propertyService';
import { CreatePropertyRequest, UpdatePropertyRequest } from '@/models/Property';
import { HTTP_STATUS } from '@/utils/constants';

export class PropertyController {
  async createProperty(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const data: CreatePropertyRequest = req.body;
    const result = await propertyService.createProperty(userId, data);

    res.status(HTTP_STATUS.CREATED).json(result);
  }

  async getProperty(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { id } = req.params;
    const result = await propertyService.getPropertyById(id, userId);

    res.status(HTTP_STATUS.OK).json(result);
  }

  async getUserProperties(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const result = await propertyService.getUserProperties(userId);

    res.status(HTTP_STATUS.OK).json(result);
  }

  async updateProperty(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { id } = req.params;
    const data: UpdatePropertyRequest = req.body;
    const result = await propertyService.updateProperty(id, userId, data);

    res.status(HTTP_STATUS.OK).json(result);
  }

  async deleteProperty(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { id } = req.params;
    await propertyService.deleteProperty(id, userId);

    res.status(HTTP_STATUS.OK).json({
      message: 'Propriedade deletada com sucesso',
    });
  }
}

export const propertyController = new PropertyController();