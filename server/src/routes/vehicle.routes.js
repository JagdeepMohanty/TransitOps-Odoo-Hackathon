import { Router } from 'express';
import { getVehicles, getVehicle, getAvailableVehicles, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicle.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicle.validator.js';

const router = Router();

router.use(authenticate);

router.get('/available', getAvailableVehicles);
router.get('/', getVehicles);
router.get('/:id', getVehicle);
router.post('/', authorize('FLEET_MANAGER'), validate(createVehicleSchema), createVehicle);
router.put('/:id', authorize('FLEET_MANAGER'), validate(updateVehicleSchema), updateVehicle);
router.delete('/:id', authorize('FLEET_MANAGER'), deleteVehicle);

export default router;
