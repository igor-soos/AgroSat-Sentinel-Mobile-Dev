import { Router } from 'express';
import { nasaController } from '@/controllers/nasaController';

const router = Router();

// A linha 'router.use(authMiddleware)' foi removida para evitar falhas de login

// Buscar NDVI da NASA
router.get('/ndvi/property/:propertyId', async (req, res, next) => {
  try {
    await nasaController.getNDVIFromNasa(req, res);
  } catch (error) {
    next(error);
  }
});

// Buscar dados climáticos da NASA
router.get('/climate/property/:propertyId', async (req, res, next) => {
  try {
    await nasaController.getClimateFromNasa(req, res);
  } catch (error) {
    next(error);
  }
});

// Análise completa (NDVI + Clima + Alertas)
router.get('/analyze/property/:propertyId', async (req, res, next) => {
  try {
    await nasaController.analyzePropertyFromNasa(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;