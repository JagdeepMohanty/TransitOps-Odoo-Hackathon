import { Router } from 'express';
import prisma from '../config/prisma.js';
import env from '../config/env.js';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import driverRoutes from './driver.routes.js';
import tripRoutes from './trip.routes.js';
import maintenanceRoutes from './maintenance.routes.js';
import fuelLogRoutes from './fuelLog.routes.js';
import expenseRoutes from './expense.routes.js';
import reportRoutes from './report.routes.js';

const router = Router();

// Health check
router.get('/health', async (req, res) => {
  let dbStatus = 'unreachable';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'unreachable';
  }

  res.status(200).json({
    success: true,
    message: 'TransitOps API is running',
    data: {
      status: 'healthy',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      environment: env.nodeEnv,
    },
  });
});

// Module routes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/trips', tripRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/fuel-logs', fuelLogRoutes);
router.use('/expenses', expenseRoutes);
router.use('/reports', reportRoutes);

export default router;
