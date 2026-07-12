const router = require('express').Router();
const { getVehicles, getVehicle, getAvailableVehicles, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicle.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createVehicleSchema, updateVehicleSchema } = require('../validators/vehicle.validator');

router.use(authenticate);

router.get('/available', getAvailableVehicles);
router.get('/', getVehicles);
router.get('/:id', getVehicle);
router.post('/', authorize('Fleet Manager', 'Admin'), validate(createVehicleSchema), createVehicle);
router.put('/:id', authorize('Fleet Manager', 'Admin'), validate(updateVehicleSchema), updateVehicle);
router.delete('/:id', authorize('Fleet Manager', 'Admin'), deleteVehicle);

module.exports = router;
