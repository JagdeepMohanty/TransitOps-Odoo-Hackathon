const vehicleRepo = require('../repositories/vehicle.repository');
const { ApiError } = require('../utils/ApiError');
const { MESSAGES } = require('../constants/messages');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { getPagination, paginatedResponse } = require('../utils/pagination');

const getAllVehicles = async (query) => {
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

const getVehicleById = async (id) => {
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  return vehicle;
};

const getAvailableVehicles = async () => vehicleRepo.findAvailable();

const createVehicle = async (data) => {
  const existing = await vehicleRepo.findByRegistration(data.registrationNumber);
  if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_REG_EXISTS);
  return vehicleRepo.create(data);
};

const updateVehicle = async (id, data) => {
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);

  if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
    const existing = await vehicleRepo.findByRegistration(data.registrationNumber);
    if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_REG_EXISTS);
  }
  return vehicleRepo.update(id, data);
};

const deleteVehicle = async (id) => {
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  return vehicleRepo.remove(id);
};

module.exports = { getAllVehicles, getVehicleById, getAvailableVehicles, createVehicle, updateVehicle, deleteVehicle };
