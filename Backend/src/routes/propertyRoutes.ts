import { Router } from 'express';
import { propertyController } from '@/controllers/propertyController';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// All property routes require authentication
router.use(authMiddleware);

router.post('/', async (req, res, next) => {
  try {
    await propertyController.createProperty(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await propertyController.getUserProperties(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await propertyController.getProperty(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await propertyController.updateProperty(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await propertyController.deleteProperty(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;