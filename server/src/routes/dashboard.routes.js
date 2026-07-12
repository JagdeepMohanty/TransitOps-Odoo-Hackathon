import { Router } from 'express';
import { getKpis } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/kpis', authorize('FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST'), getKpis);

export default router;
