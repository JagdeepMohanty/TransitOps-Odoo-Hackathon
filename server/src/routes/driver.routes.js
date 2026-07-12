const router = require('express').Router();
const { getDrivers, getDriver, getAvailableDrivers, createDriver, updateDriver, deleteDriver } = require('../controllers/driver.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createDriverSchema, updateDriverSchema } = require('../validators/driver.validator');

router.use(authenticate);

router.get('/available', getAvailableDrivers);
router.get('/', getDrivers);
router.get('/:id', getDriver);
router.post('/', authorize('Fleet Manager', 'Admin'), validate(createDriverSchema), createDriver);
router.put('/:id', authorize('Fleet Manager', 'Admin', 'Safety Officer'), validate(updateDriverSchema), updateDriver);
router.delete('/:id', authorize('Fleet Manager', 'Admin'), deleteDriver);

module.exports = router;
