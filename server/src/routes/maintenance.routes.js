const router = require('express').Router();
const { getMaintenance, getMaintenanceById, createMaintenance, updateMaintenance, closeMaintenance } = require('../controllers/maintenance.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createMaintenanceSchema, closeMaintenanceSchema } = require('../validators/maintenance.validator');

router.use(authenticate);

router.get('/', getMaintenance);
router.get('/:id', getMaintenanceById);
router.post('/', authorize('Fleet Manager', 'Admin'), validate(createMaintenanceSchema), createMaintenance);
router.put('/:id', authorize('Fleet Manager', 'Admin'), updateMaintenance);
router.post('/:id/close', authorize('Fleet Manager', 'Admin'), validate(closeMaintenanceSchema), closeMaintenance);

module.exports = router;
