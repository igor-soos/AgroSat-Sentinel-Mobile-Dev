import { Router } from 'express';
import { ndviController } from '@/controllers/ndviController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// All NDVI routes require authentication
router.use(authMiddleware);

router.post('/', async (req, res, next) => {
  try {
    await ndviController.createNDVIData(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await ndviController.getNDVIData(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/property/:propertyId', async (req, res, next) => {
  try {
    await ndviController.getPropertyNDVIData(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;