const expenseService = require('../services/expense.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { MESSAGES } = require('../constants/messages');

const getExpenses = asyncHandler(async (req, res) => {
  const result = await expenseService.getAllExpenses(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Expenses fetched.', result));
});

const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.EXPENSE_CREATED, expense));
});

module.exports = { getExpenses, createExpense };
