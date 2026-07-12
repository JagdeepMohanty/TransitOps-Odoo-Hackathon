import { Router } from 'express';
import { getTrips, getTrip, createTrip, updateTrip, dispatchTrip, completeTrip, cancelTrip } from '../controllers/trip.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createTripSchema, updateTripSchema, completeTripSchema } from '../validators/trip.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getTrips);
router.get('/:id', getTrip);
router.post('/', authorize('DISPATCHER', 'FLEET_MANAGER'), validate(createTripSchema), createTrip);
router.put('/:id', authorize('DISPATCHER', 'FLEET_MANAGER'), validate(updateTripSchema), updateTrip);
router.post('/:id/dispatch', authorize('DISPATCHER', 'FLEET_MANAGER'), dispatchTrip);
router.post('/:id/complete', authorize('DISPATCHER', 'FLEET_MANAGER'), validate(completeTripSchema), completeTrip);
router.post('/:id/cancel', authorize('DISPATCHER', 'FLEET_MANAGER'), cancelTrip);

export default router;
