import * as expenseService from '../services/expense.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const getExpenses = asyncHandler(async (req, res) => {
  const result = await expenseService.getAllExpenses(req.query);
  return new ApiResponse(HTTP_STATUS.OK, 'Expenses fetched.', result).send(res);
});

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.body);
  return new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.EXPENSE_CREATED, expense).send(res);
});
