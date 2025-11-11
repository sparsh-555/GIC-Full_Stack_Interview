import { Router } from 'express';
import cafeRoutes from './cafe.routes';
import employeeRoutes from './employee.routes';

const router = Router();

router.use('/cafes', cafeRoutes);
router.use('/employees', employeeRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
