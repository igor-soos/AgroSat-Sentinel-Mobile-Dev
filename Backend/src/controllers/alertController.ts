import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { alertService } from '@/services/alertService';
import { propertyService } from '@/services/propertyService';
import { CreateAlertRequest, UpdateAlertRequest } from '@/models/Alert';
import { HTTP_STATUS } from '@/utils/constants';

export class AlertController {
  async createAlert(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const data: CreateAlertRequest = req.body;

    // Verify property belongs to user
    await propertyService.getPropertyById(data.propertyId, userId);

    const result = await alertService.createAlert(data);

    res.status(HTTP_STATUS.CREATED).json(result);
  }

  async getAlert(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await alertService.getAlertById(id);

    res.status(HTTP_STATUS.OK).json(result);
  }

  async getPropertyAlerts(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { propertyId } = req.params;
    const { status } = req.query;

    // Verify property belongs to user
    await propertyService.getPropertyById(propertyId, userId);

    const result = await alertService.getPropertyAlerts(propertyId, status as string);

    res.status(HTTP_STATUS.OK).json(result);
  }

  async getAllAlerts(req: AuthRequest, res: Response): Promise<void> {
    const { limit = 50, offset = 0 } = req.query;
    const result = await alertService.getAllAlerts(
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(HTTP_STATUS.OK).json(result);
  }

  async updateAlert(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const data: UpdateAlertRequest = req.body;
    const result = await alertService.updateAlert(id, data);

    res.status(HTTP_STATUS.OK).json(result);
  }

  async acknowledgeAlert(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await alertService.acknowledgeAlert(id);

    res.status(HTTP_STATUS.OK).json(result);
  }

  async resolveAlert(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await alertService.resolveAlert(id);

    res.status(HTTP_STATUS.OK).json(result);
  }

  async deleteAlert(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    await alertService.deleteAlert(id);

    res.status(HTTP_STATUS.OK).json({
      message: 'Alerta deletado com sucesso',
    });
  }
}

export const alertController = new AlertController();