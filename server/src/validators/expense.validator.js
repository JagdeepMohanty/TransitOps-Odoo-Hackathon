const { z } = require('zod');
const { EXPENSE_TYPES } = require('../constants/expenseTypes');

const createExpenseSchema = z.object({
  vehicleId: z.number().int().positive(),
  tripId: z.number().int().positive().optional(),
  type: z.enum(Object.values(EXPENSE_TYPES)),
  amount: z.number().positive(),
  description: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
});

module.exports = { createExpenseSchema };
