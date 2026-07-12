const driverRepo = require('../repositories/driver.repository');
const { ApiError } = require('../utils/ApiError');
const { MESSAGES } = require('../constants/messages');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { getPagination, paginatedResponse } = require('../utils/pagination');

const getAllDrivers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filters = {};
  if (query.status) filters.status = query.status;

  const [drivers, total] = await Promise.all([
    driverRepo.findAll(filters, skip, limit),
    driverRepo.countAll(filters),
  ]);
  return paginatedResponse(drivers, total, page, limit);
};

const getDriverById = async (id) => {
  const driver = await driverRepo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);
  return driver;
};

const getAvailableDrivers = async () => driverRepo.findAvailable();

const createDriver = async (data) => {
  const existing = await driverRepo.findByLicense(data.licenseNumber);
  if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_LICENSE_EXISTS);
  return driverRepo.create(data);
};

const updateDriver = async (id, data) => {
  const driver = await driverRepo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);

  if (data.licenseNumber && data.licenseNumber !== driver.licenseNumber) {
    const existing = await driverRepo.findByLicense(data.licenseNumber);
    if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_LICENSE_EXISTS);
  }
  return driverRepo.update(id, data);
};

const deleteDriver = async (id) => {
  const driver = await driverRepo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);
  return driverRepo.remove(id);
};

module.exports = { getAllDrivers, getDriverById, getAvailableDrivers, createDriver, updateDriver, deleteDriver };
