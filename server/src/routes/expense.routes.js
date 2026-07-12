const router = require('express').Router();
const { getExpenses, createExpense } = require('../controllers/expense.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createExpenseSchema } = require('../validators/expense.validator');

router.use(authenticate);

router.get('/', getExpenses);
router.post('/', authorize('Driver', 'Fleet Manager', 'Financial Analyst', 'Admin'), validate(createExpenseSchema), createExpense);

module.exports = router;
