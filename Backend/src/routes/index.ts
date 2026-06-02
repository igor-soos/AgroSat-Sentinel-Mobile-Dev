import { Router } from 'express';
import authRoutes from '@/routes/authRoutes';
import userRoutes from '@/routes/userRoutes';
import propertyRoutes from '@/routes/propertyRoutes';
import alertRoutes from '@/routes/alertRoutes';
import ndviRoutes from '@/routes/ndviRoutes';
import nasaRoutes from '@/routes/nasaRoutes';
import seedRoutes from '@/routes/seedRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/alerts', alertRoutes);
router.use('/data/ndvi', ndviRoutes);
router.use('/nasa', nasaRoutes);
router.use('/seed', seedRoutes);

export default router;