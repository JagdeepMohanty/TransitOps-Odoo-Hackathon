import { Router } from 'express';
import { getReports, exportReportsCsv } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), getReports);
router.get('/export/csv', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), exportReportsCsv);

export default router;
