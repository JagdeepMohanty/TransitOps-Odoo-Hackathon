import * as expenseRepo from '../repositories/expense.repository.js';
import * as vehicleRepo from '../repositories/vehicle.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';

export const getAllExpenses = async (query) => {
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

export const createExpense = async (data) => {
  const vehicle = await vehicleRepo.findById(data.vehicleId);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  return expenseRepo.create(data);
};
