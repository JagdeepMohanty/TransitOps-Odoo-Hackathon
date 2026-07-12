import { Router } from 'express';
import { getDrivers, getDriver, getAvailableDrivers, createDriver, updateDriver, deleteDriver } from '../controllers/driver.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createDriverSchema, updateDriverSchema } from '../validators/driver.validator.js';

const router = Router();

router.use(authenticate);

router.get('/available', getAvailableDrivers);
router.get('/', getDrivers);
router.get('/:id', getDriver);
router.post('/', authorize('FLEET_MANAGER'), validate(createDriverSchema), createDriver);
router.put('/:id', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), validate(updateDriverSchema), updateDriver);
router.delete('/:id', authorize('FLEET_MANAGER'), deleteDriver);

export default router;
