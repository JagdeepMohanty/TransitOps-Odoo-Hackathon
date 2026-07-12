import * as fuelLogRepo from '../repositories/fuelLog.repository.js';
import * as vehicleRepo from '../repositories/vehicle.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';

export const getAllFuelLogs = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filters = {};
  if (query.vehicleId) filters.vehicleId = parseInt(query.vehicleId);
  if (query.tripId) filters.tripId = parseInt(query.tripId);

  const [logs, total] = await Promise.all([
    fuelLogRepo.findAll(filters, skip, limit),
    fuelLogRepo.countAll(filters),
  ]);
  return paginatedResponse(logs, total, page, limit);
};

export const createFuelLog = async (data) => {
  const vehicle = await vehicleRepo.findById(data.vehicleId);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  return fuelLogRepo.create(data);
};
