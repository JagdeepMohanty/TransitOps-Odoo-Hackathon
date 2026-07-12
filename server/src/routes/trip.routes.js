const router = require('express').Router();
const { getTrips, getTrip, createTrip, updateTrip, dispatchTrip, completeTrip, cancelTrip } = require('../controllers/trip.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createTripSchema, updateTripSchema, completeTripSchema } = require('../validators/trip.validator');

router.use(authenticate);

router.get('/', getTrips);
router.get('/:id', getTrip);
router.post('/', authorize('Driver', 'Fleet Manager', 'Admin'), validate(createTripSchema), createTrip);
router.put('/:id', authorize('Driver', 'Fleet Manager', 'Admin'), validate(updateTripSchema), updateTrip);
router.post('/:id/dispatch', authorize('Driver', 'Fleet Manager', 'Admin'), dispatchTrip);
router.post('/:id/complete', authorize('Driver', 'Fleet Manager', 'Admin'), validate(completeTripSchema), completeTrip);
router.post('/:id/cancel', authorize('Driver', 'Fleet Manager', 'Admin'), cancelTrip);

module.exports = router;
