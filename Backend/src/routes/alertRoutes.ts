import { Router } from 'express';
import { alertController } from '@/controllers/alertController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// All alert routes require authentication
router.use(authMiddleware);

router.post('/', async (req, res, next) => {
  try {
    await alertController.createAlert(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await alertController.getAllAlerts(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await alertController.getAlert(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/property/:propertyId', async (req, res, next) => {
  try {
    await alertController.getPropertyAlerts(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await alertController.updateAlert(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/acknowledge', async (req, res, next) => {
  try {
    await alertController.acknowledgeAlert(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/resolve', async (req, res, next) => {
  try {
    await alertController.resolveAlert(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await alertController.deleteAlert(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;