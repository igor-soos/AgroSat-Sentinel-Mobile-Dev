import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { authService } from '@/services/authService';
import { HTTP_STATUS } from '@/utils/constants';

export class UserController {
  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const user = await authService.getCurrentUser(userId);

    res.status(HTTP_STATUS.OK).json(user);
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const result = await authService.updateProfile(userId, req.body);

    res.status(HTTP_STATUS.OK).json(result);
  }
}

export const userController = new UserController();