const router = require('express').Router();
const { getReports, exportReportsCsv } = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(authenticate);

router.get('/', authorize('Fleet Manager', 'Financial Analyst', 'Admin'), getReports);
router.get('/export/csv', authorize('Fleet Manager', 'Financial Analyst', 'Admin'), exportReportsCsv);

module.exports = router;
