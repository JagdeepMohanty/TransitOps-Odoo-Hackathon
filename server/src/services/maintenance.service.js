const maintenanceRepo = require('../repositories/maintenance.repository');
const vehicleRepo = require('../repositories/vehicle.repository');
const { ApiError } = require('../utils/ApiError');
const { MESSAGES } = require('../constants/messages');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { VEHICLE_STATUS, MAINTENANCE_STATUS } = require('../constants/statuses');
const { getPagination, paginatedResponse } = require('../utils/pagination');

const getAllMaintenance = async (query) => {
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

const getMaintenanceById = async (id) => {
  const log = await maintenanceRepo.findById(id);
  if (!log) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MAINTENANCE_NOT_FOUND);
  return log;
};

const createMaintenance = async (data) => {
  const vehicle = await vehicleRepo.findById(data.vehicleId);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);

  // Business Rule: Creating maintenance automatically sets vehicle status to In Shop
  await vehicleRepo.updateStatus(data.vehicleId, VEHICLE_STATUS.IN_SHOP);

  return maintenanceRepo.create({ ...data, status: MAINTENANCE_STATUS.ACTIVE });
};

const updateMaintenance = async (id, data) => {
  const log = await maintenanceRepo.findById(id);
  if (!log) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MAINTENANCE_NOT_FOUND);
  if (log.status === MAINTENANCE_STATUS.CLOSED)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.MAINTENANCE_ALREADY_CLOSED);
  return maintenanceRepo.update(id, data);
};

const closeMaintenance = async (id, data) => {
  const log = await maintenanceRepo.findById(id);
  if (!log) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MAINTENANCE_NOT_FOUND);
  if (log.status === MAINTENANCE_STATUS.CLOSED)
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.MAINTENANCE_ALREADY_CLOSED);

  const vehicle = await vehicleRepo.findById(log.vehicleId);

  // Business Rule: Closing maintenance restores vehicle to Available unless Retired
  if (vehicle.status !== VEHICLE_STATUS.RETIRED) {
    await vehicleRepo.updateStatus(log.vehicleId, VEHICLE_STATUS.AVAILABLE);
  }

  return maintenanceRepo.update(id, { ...data, status: MAINTENANCE_STATUS.CLOSED });
};

module.exports = { getAllMaintenance, getMaintenanceById, createMaintenance, updateMaintenance, closeMaintenance };
