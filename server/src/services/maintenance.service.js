import * as maintenanceRepo from '../repositories/maintenance.repository.js';
import * as vehicleRepo from '../repositories/vehicle.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { VEHICLE_STATUS, MAINTENANCE_STATUS } from '../constants/statuses.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';

export const getAllMaintenance = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filters = {};
  if (query.vehicleId) filters.vehicleId = parseInt(query.vehicleId);
  if (query.status) filters.status = query.status;

  const [logs, total] = await Promise.all([
    maintenanceRepo.findAll(filters, skip, limit),
    maintenanceRepo.countAll(filters),
  ]);
  return paginatedResponse(logs, total, page, limit);
};

export const getMaintenanceById = async (id) => {
  const log = await maintenanceRepo.findById(id);
  if (!log) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MAINTENANCE_NOT_FOUND);
  return log;
};

export const createMaintenance = async (data) => {
  const vehicle = await vehicleRepo.findById(data.vehicleId);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);

  await vehicleRepo.updateStatus(data.vehicleId, VEHICLE_STATUS.IN_SHOP);

  return maintenanceRepo.create({ ...data, status: MAINTENANCE_STATUS.ACTIVE });
};

export const updateMaintenance = async (id, data) => {
  const log = await maintenanceRepo.findById(id);
  if (!log) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MAINTENANCE_NOT_FOUND);
  if (log.status !== MAINTENANCE_STATUS.ACTIVE)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.MAINTENANCE_ALREADY_CLOSED);
  return maintenanceRepo.update(id, data);
};

export const closeMaintenance = async (id, data) => {
  const log = await maintenanceRepo.findById(id);
  if (!log) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MAINTENANCE_NOT_FOUND);
  if (log.status !== MAINTENANCE_STATUS.ACTIVE)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.MAINTENANCE_ALREADY_CLOSED);

  const vehicle = await vehicleRepo.findById(log.vehicleId);

  if (vehicle.status !== VEHICLE_STATUS.RETIRED) {
    await vehicleRepo.updateStatus(log.vehicleId, VEHICLE_STATUS.AVAILABLE);
  }

  return maintenanceRepo.update(id, { ...data, status: MAINTENANCE_STATUS.COMPLETED });
};
