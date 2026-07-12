import * as vehicleRepo from '../repositories/vehicle.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';

export const getAllVehicles = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filters = {};
  if (query.status) filters.status = query.status;
  if (query.type) filters.type = query.type;
  if (query.region) filters.region = query.region;

  const [vehicles, total] = await Promise.all([
    vehicleRepo.findAll(filters, skip, limit),
    vehicleRepo.countAll(filters),
  ]);
  return paginatedResponse(vehicles, total, page, limit);
};

export const getVehicleById = async (id) => {
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  return vehicle;
};

export const getAvailableVehicles = async () => vehicleRepo.findAvailable();

export const createVehicle = async (data) => {
  const existing = await vehicleRepo.findByRegistration(data.registrationNumber);
  if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_REG_EXISTS);
  return vehicleRepo.create(data);
};

export const updateVehicle = async (id, data) => {
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);

  if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
    const existing = await vehicleRepo.findByRegistration(data.registrationNumber);
    if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_REG_EXISTS);
  }
  return vehicleRepo.update(id, data);
};

export const deleteVehicle = async (id) => {
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  return vehicleRepo.remove(id);
};
