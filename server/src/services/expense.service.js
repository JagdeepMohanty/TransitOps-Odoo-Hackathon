const expenseRepo = require('../repositories/expense.repository');
const vehicleRepo = require('../repositories/vehicle.repository');
const { ApiError } = require('../utils/ApiError');
const { MESSAGES } = require('../constants/messages');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { getPagination, paginatedResponse } = require('../utils/pagination');

const getAllExpenses = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filters = {};
  if (query.vehicleId) filters.vehicleId = parseInt(query.vehicleId);
  if (query.type) filters.type = query.type;
  if (query.tripId) filters.tripId = parseInt(query.tripId);

  const [expenses, total] = await Promise.all([
    expenseRepo.findAll(filters, skip, limit),
    expenseRepo.countAll(filters),
  ]);
  return paginatedResponse(expenses, total, page, limit);
};

const createExpense = async (data) => {
  const vehicle = await vehicleRepo.findById(data.vehicleId);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  return expenseRepo.create(data);
};

module.exports = { getAllExpenses, createExpense };
