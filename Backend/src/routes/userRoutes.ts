import { Router } from 'express';
import { userController } from '@/controllers/userController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get('/me', async (req, res, next) => {
  try {
    await userController.getCurrentUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/profile', async (req, res, next) => {
  try {
    await userController.updateProfile(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;