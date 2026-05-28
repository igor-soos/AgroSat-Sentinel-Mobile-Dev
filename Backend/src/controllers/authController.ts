import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { authService } from '@/services/authService';
import { RegisterRequest, LoginRequest } from '@/models/User';
import { HTTP_STATUS } from '@/utils/constants';

export class AuthController {
  async register(req: AuthRequest, res: Response): Promise<void> {
    const data: RegisterRequest = req.body;
    const result = await authService.register(data);

    res.status(HTTP_STATUS.CREATED).json(result);
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    const { email, password }: LoginRequest = req.body;
    const result = await authService.login(email, password);

    res.status(HTTP_STATUS.OK).json(result);
  }

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

  async refreshToken(req: AuthRequest, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);

    res.status(HTTP_STATUS.OK).json(result);
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    // Token invalidation would require a blacklist/database table
    // For now, just return success - frontend should discard token
    res.status(HTTP_STATUS.OK).json({
      message: 'Logout realizado com sucesso',
    });
  }
}

export const authController = new AuthController();