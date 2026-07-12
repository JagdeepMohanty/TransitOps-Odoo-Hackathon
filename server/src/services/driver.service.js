import * as driverRepo from '../repositories/driver.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';

export const getAllDrivers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filters = {};
  if (query.status) filters.status = query.status;

  const [drivers, total] = await Promise.all([
    driverRepo.findAll(filters, skip, limit),
    driverRepo.countAll(filters),
  ]);
  return paginatedResponse(drivers, total, page, limit);
};

export const getDriverById = async (id) => {
  const driver = await driverRepo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);
  return driver;
};

export const getAvailableDrivers = async () => driverRepo.findAvailable();

export const createDriver = async (data) => {
  const existing = await driverRepo.findByLicense(data.licenseNumber);
  if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_LICENSE_EXISTS);
  return driverRepo.create(data);
};

export const updateDriver = async (id, data) => {
  const driver = await driverRepo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);

  if (data.licenseNumber && data.licenseNumber !== driver.licenseNumber) {
    const existing = await driverRepo.findByLicense(data.licenseNumber);
    if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_LICENSE_EXISTS);
  }
  return driverRepo.update(id, data);
};

export const deleteDriver = async (id) => {
  const driver = await driverRepo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);
  return driverRepo.remove(id);
};
