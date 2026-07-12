const router = require('express').Router();
const { getFuelLogs, createFuelLog } = require('../controllers/fuelLog.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createFuelLogSchema } = require('../validators/fuelLog.validator');

router.use(authenticate);

router.get('/', getFuelLogs);
router.post('/', authorize('Driver', 'Fleet Manager', 'Admin'), validate(createFuelLogSchema), createFuelLog);

module.exports = router;
