import { Router } from 'express';
import authRoutes from './authRoutes';
import propertyRoutes from './propertyRoutes';
import alertRoutes from './alertRoutes';
import dataRoutes from './dataRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/alerts', alertRoutes);
router.use('/data', dataRoutes);
router.use('/users', userRoutes);

export default router;