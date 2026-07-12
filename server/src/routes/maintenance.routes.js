import { Router } from 'express';
import { getMaintenance, getMaintenanceById, createMaintenance, updateMaintenance, closeMaintenance } from '../controllers/maintenance.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createMaintenanceSchema, closeMaintenanceSchema } from '../validators/maintenance.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getMaintenance);
router.get('/:id', getMaintenanceById);
router.post('/', authorize('FLEET_MANAGER'), validate(createMaintenanceSchema), createMaintenance);
router.put('/:id', authorize('FLEET_MANAGER'), updateMaintenance);
router.post('/:id/close', authorize('FLEET_MANAGER'), validate(closeMaintenanceSchema), closeMaintenance);

export default router;
