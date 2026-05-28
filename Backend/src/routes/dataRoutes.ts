import { Router } from 'express';
import { dataController } from '@/controllers/dataController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// All data routes require authentication
router.use(authMiddleware);

// NDVI Routes
router.post('/ndvi', async (req, res, next) => {
  try {
    await dataController.createNDVIData(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/ndvi/:id', async (req, res, next) => {
  try {
    await dataController.getNDVIData(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/ndvi/property/:propertyId', async (req, res, next) => {
  try {
    await dataController.getPropertyNDVIData(req, res);
  } catch (error) {
    next(error);
  }
});

// Thermal Anomaly Routes
router.post('/thermal', async (req, res, next) => {
  try {
    await dataController.createThermalAnomaly(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/thermal/:id', async (req, res, next) => {
  try {
    await dataController.getThermalAnomaly(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/thermal/property/:propertyId', async (req, res, next) => {
  try {
    await dataController.getPropertyThermalAnomalies(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;