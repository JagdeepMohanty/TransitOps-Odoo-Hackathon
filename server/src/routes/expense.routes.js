import { Router } from 'express';
import { getExpenses, createExpense } from '../controllers/expense.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createExpenseSchema } from '../validators/expense.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getExpenses);
router.post('/', authorize('DISPATCHER', 'FLEET_MANAGER', 'FINANCIAL_ANALYST'), validate(createExpenseSchema), createExpense);

export default router;
