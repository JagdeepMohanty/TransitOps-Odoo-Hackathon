import { Router } from 'express';
import { getFuelLogs, createFuelLog } from '../controllers/fuelLog.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createFuelLogSchema } from '../validators/fuelLog.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getFuelLogs);
router.post('/', authorize('DISPATCHER', 'FLEET_MANAGER'), validate(createFuelLogSchema), createFuelLog);

export default router;
