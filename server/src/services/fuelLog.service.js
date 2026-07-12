const fuelLogRepo = require('../repositories/fuelLog.repository');
const vehicleRepo = require('../repositories/vehicle.repository');
const { ApiError } = require('../utils/ApiError');
const { MESSAGES } = require('../constants/messages');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { getPagination, paginatedResponse } = require('../utils/pagination');

const getAllFuelLogs = async (query) => {
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

const createFuelLog = async (data) => {
  const vehicle = await vehicleRepo.findById(data.vehicleId);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  return fuelLogRepo.create(data);
};

module.exports = { getAllFuelLogs, createFuelLog };
