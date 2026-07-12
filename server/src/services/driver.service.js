import * as driverRepo from '../repositories/driver.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { DRIVER_STATUS } from '../constants/statuses.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';

const VALID_SORT_FIELDS = new Set(['name', 'status', 'safetyScore', 'licenseExpiryDate', 'createdAt']);

const parseId = (raw) => {
  const id = parseInt(raw, 10);
  if (isNaN(id) || id < 1) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid ID parameter');
  return id;
};

const isExpired = (dateStr) => new Date(dateStr) <= new Date();

export const getAllDrivers = async (query) => {
  const { page, limit, skip } = getPagination(query);

  const andConditions = [];

  if (query.status) {
    if (!Object.values(DRIVER_STATUS).includes(query.status)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid status value: ${query.status}`);
    }
    andConditions.push({ status: query.status });
  }

  if (query.search) {
    andConditions.push({
      OR: [
        { name:          { contains: query.search } },
        { licenseNumber: { contains: query.search } },
        { contactNumber: { contains: query.search } },
      ],
    });
  }

  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  const sortBy    = VALID_SORT_FIELDS.has(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

  const [drivers, total] = await Promise.all([
    driverRepo.findAll(where, skip, limit, { [sortBy]: sortOrder }),
    driverRepo.countAll(where),
  ]);

  return paginatedResponse(drivers, total, page, limit);
};

export const getDriverById = async (rawId) => {
  const id = parseId(rawId);
  const driver = await driverRepo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);
  return driver;
};

export const getAvailableDrivers = () => driverRepo.findAvailable();

export const createDriver = async (data) => {
  if (isExpired(data.licenseExpiryDate)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.DRIVER_LICENSE_EXPIRED);
  }

  const existing = await driverRepo.findByLicense(data.licenseNumber);
  if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_LICENSE_EXISTS);

  return driverRepo.create({
    ...data,
    licenseExpiryDate: new Date(data.licenseExpiryDate),
  });
};

export const updateDriver = async (rawId, data) => {
  const id = parseId(rawId);
  const driver = await driverRepo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);

  if (data.licenseNumber && data.licenseNumber !== driver.licenseNumber) {
    const conflict = await driverRepo.findByLicense(data.licenseNumber);
    if (conflict) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_LICENSE_EXISTS);
  }

  const payload = { ...data };

  if (data.licenseExpiryDate) {
    if (isExpired(data.licenseExpiryDate)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.DRIVER_LICENSE_EXPIRED);
    }
    payload.licenseExpiryDate = new Date(data.licenseExpiryDate);
  }

  return driverRepo.update(id, payload);
};

export const deleteDriver = async (rawId) => {
  const id = parseId(rawId);
  const driver = await driverRepo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);

  if (driver.status === DRIVER_STATUS.ON_TRIP) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_ON_TRIP);
  }

  const activeTrip = await driverRepo.hasActiveTrip(id);
  if (activeTrip) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_ON_TRIP);

  await driverRepo.remove(id);
};
