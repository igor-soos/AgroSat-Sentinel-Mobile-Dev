import { Router } from 'express';
import { nasaController } from '@/controllers/nasaController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

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